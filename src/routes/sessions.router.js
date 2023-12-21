
import { Router } from "express";
import { UserManager } from '../Dao/managerDB/UsersManagerMongo.js'
import { hashData, compareData } from "../utils.js";
import passport from "passport";

const sessionRouter = Router();

const userManager = new UserManager()

// SIGNUP - LOGIN - PASSPORT LOCAL

sessionRouter.post('/register', async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }
  try {
    const createdUser = await userManager.createUser(req.body);
    res.status(200).json({ message: "User created", user: createdUser });
  } catch (error) {
    res.status(500).json({ error });
  }
})

sessionRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }
  try {
    const user = await userManager.getUserByEmail(email);
    if (!user) {
      return res.redirect("http://localhost:8080/api/views/register");
    }
    /*const isPasswordValid = password === user.password;*/
    const isPasswordValid = await compareData(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password incorrecta" });
    }
    const sessionInfo =
        email === "adminCoder@coder.com" && password === "adminCod3r123"
          ? { email, first_name: user.first_name, isAdmin: true }
          : { email, first_name: user.first_name, isAdmin: false };
    req.session.user = sessionInfo;
    res.redirect("http://localhost:8080/api/views/products");
  } catch (error) {
    res.status(500).json({ error });
  }

})
  
// SIGNUP - LOGIN - PASSPORT GITHUB

sessionRouter.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

sessionRouter.get("/callback", passport.authenticate("github"), (req, res) => {
  res.redirect("http://localhost:8080/api/views/products");
});

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

export default sessionRouter