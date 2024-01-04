
import { Router } from "express";
import { UserManager } from '../Dao/managerDB/UsersManagerMongo.js'
//import { generateToken } from "../utils.js";
import passport from "passport";

const sessionRouter = Router();

const userManager = new UserManager()

// SIGNUP - LOGIN - PASSPORT LOCAL

sessionRouter.post('/register', 
                      passport.authenticate("register", {
                             successRedirect: "http://localhost:8080/api/views/login",
                             failureRedirect: "http://localhost:8080/api/views/error",
                           })
                        , async (req, res) => {
  try{
    res.status(200).json({ message: "Signed up" });
  } catch (error) {
    res.status(500).json({ error });
  }
})


sessionRouter.post('/login',
                      passport.authenticate("login", {
                             //successRedirect: "http://localhost:8080/api/views/products",
                             failureRedirect: "http://localhost:8080/api/views/register",
                           })
                        , async (req, res) => {
  try{
    const { email, password } = req.body;
    const user = await userManager.getUserByEmail(email);
    const sessionInfo =
        email === "adminCoder@coder.com" && password === "adminCod3r123"
          ? { email, first_name: user.first_name, isAdmin: true, cart: user.cart }
          : { email, first_name: user.first_name, isAdmin: false, cart: user.cart };
    req.session.user = sessionInfo;
    res.redirect("http://localhost:8080/api/views/products")
  } catch (error) {
    res.status(500).json({ error });
  }
})
  
// SIGNUP - LOGIN - PASSPORT GITHUB

sessionRouter.get("/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

//REVISAR DATOS DE LA COOKIE
sessionRouter.get("/callback",
                     passport.authenticate("github",{
                      //successRedirect: "http://localhost:8080/api/views/products",
                      failureRedirect: "http://localhost:8080/api/views/error",
                     })
                     , async (req, res) => {
    try{
      console.log(req.session.passport.user)
      const user = await userManager.getUserById(req.session.passport.user);
      console.log(user)
      req.session.user = { email: user.email, first_name: user.first_name, isAdmin: false, cart: user.cart };
      res.redirect("http://localhost:8080/api/views/products")
    } catch (error) {
      res.status(500).json({ error });
    }
  
});

// SIGNUP - LOGIN - PASSPORT GOOGLE
/*sessionRouter.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

sessionRouter.get("/auth/google/callback",
                    passport.authenticate("google", { 
                      successRedirect: "http://localhost:8080/api/views/products",
                      failureRedirect: "http://localhost:8080/api/views/error",
                     })
                    , (req, res) => {
    // Successful authentication, redirect home.
    console.log(req);
    res.redirect("/profile");
  }
);*/

sessionRouter.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("http://localhost:8080/api/views/login");
  });
});

sessionRouter.post("/restaurar", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userManager.getUserByEmail(email);
    if (!user) {
      //no existe el usuario
      return res.redirect("http://localhost:8080/api/views/register");
    }
    const hashedPassword = await hashData(password);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

sessionRouter.get("/current", (req, res) => {
  res.render("currentSession", req.session.user);
});

export default sessionRouter