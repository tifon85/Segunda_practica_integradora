import passport from "passport";
import { UserManager } from '../Dao/managerDB/UsersManagerMongo.js'
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { hashData, compareData } from "./utils.js";

const userManager = new UserManager()

passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        const { first_name, last_name } = req.body;
        if (!first_name || !last_name || !email || !password) {
          return done(null, false);
        }
        try {
            const user = await userManager.getUserByEmail(email)
            if(!user){
                //no existe el usuario, entonces lo registramos
                const hashedPassword = await hashData(password);
                const createdUser = await usersManager.createOne({
                ...req.body,
                password: hashedPassword,
                });
                done(null, createdUser);
            }else{
                //ya existe el usuario
                return done(null,false)
            }
        } catch (error) {
            done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        if (!email || !password) {
            //no pueden venir vacios estos campos, son obligatorios
            done(null, false);
        }
        try {
          const user = await userManager.getUserByEmail(email);
          if (!user) {
            //no existe el usuario
            done(null, false);
          }
  
          const isPasswordValid = await compareData(password, user.password);
          if (!isPasswordValid) {
            //no es correcta la password
            return done(null, false);
          }
          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

// github
passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: "Iv1.5102287754bdfd53",
        clientSecret: "ec0aad261cbc70dcff6923bc4dfbb48b160ec586",
        callbackURL: "http://localhost:8080/api/sessions/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const userDB = await userManager.getUserByEmail(profile._json.email);
          // login
          if (userDB) {
            if (userDB.isGithub) {
              return done(null, userDB);
            } else {
              return done(null, false);
            }
          }
          // signup
          const infoUser = {
            first_name: profile._json.name.split(" ")[0], // ['farid','sesin']
            last_name: profile._json.name.split(" ")[1],
            email: profile._json.email,
            password: " ",
            isGithub: true,
          };
          const createdUser = await userManager.createUser(infoUser);
          done(null, createdUser);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    // _id
    done(null, user._id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await usersManager.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });