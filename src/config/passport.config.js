import passport from "passport";
import { UserManager } from '../Dao/managerDB/UsersManagerMongo.js'
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { hashData, compareData } from "../utils.js";

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
                const createdUser = await userManager.createUser({
                ...req.body,
                password: hashedPassword,
                });
                return done(null, createdUser);
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
            return done(null, false);
        }
        try {
          const user = await userManager.getUserByEmail(email);
          if (!user) {
            //no existe el usuario
            return done(null, false);
          }
          
          const isPasswordValid = await compareData(password, user.password);
          if (!isPasswordValid) {
            //no es correcta la password
            return done(null, false);
          }else{
            return done(null, user);
          }
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
        clientID: "Iv1.13a3189b9c08c353",
        clientSecret: "195991909df69574d54fdf2ffb8d7d06e0437d88",
        callbackURL: "http://localhost:8080/api/sessions/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        try {
          //Si el email es publico, lo registro con el email
          if(profile._json.email){
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
              first_name: profile._json.name.split(" ")[0] || "Usuario Github", // ['farid','sesin']
              last_name: profile._json.name.split(" ")[1] || profile.username,
              email: profile._json.email,
              password: " ",
              isGithub: true,
            };
            console.log(infoUser)
            const createdUser = await userManager.createUser(infoUser);
            return done(null, createdUser);
          }else{
            //si el email es privado, lo registro con el ID de github en lugar del email
            const userDB = await userManager.getUserByEmail(profile.id);
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
              first_name: "Usuario Github",
              last_name: profile.username,
              email: profile.id,
              password: " ",
              isGithub: true,
            };
            console.log(infoUser)
            const createdUser = await userManager.createUser(infoUser);
            return done(null, createdUser);
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    // _id
    return done(null, user._id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userManager.getUserById(id);
      return done(null, user);
    } catch (error) {
      done(error);
    }
  });