
import { Router } from "express";
import { UserManager } from '../Dao/managerDB/UsersManagerMongo.js'
import { hashData } from "../utils.js";
import passport from "passport";

const sessionRouter = Router();

const userManager = new UserManager()

// SIGNUP - LOGIN - PASSPORT LOCAL

sessionRouter.post(
  "/register",
  passport.authenticate("register", {
    successRedirect: "http://localhost:8080/api/views/products",
    failureRedirect: "http://localhost:8080/api/views/error",
  })
);

sessionRouter.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "http://localhost:8080/api/views/products",
    failureRedirect: "http://localhost:8080/api/views/error",
  })
);
  
// SIGNUP - LOGIN - PASSPORT GITHUB

sessionRouter.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

sessionRouter.get("/callback", passport.authenticate("github"), (req, res) => {
  res.send("Probando");
});

sessionRouter.get("/signout", (req, res) => {
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

export default sessionRouter