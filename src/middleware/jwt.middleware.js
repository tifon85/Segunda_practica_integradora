import jwt from "jsonwebtoken";
const SECRET_KEY_JWT = "jwtSecret";

/* export const jwtValidation = (req, res, next) => {
   try {
     const authHeader = req.get("Authorization");
     const token = authHeader.split(" ")[1];
     console.log("authHeader", token);
     const userToken = jwt.verify(token, SECRET_KEY_JWT);
     req.user = userToken;
     next();
   } catch (error) {
     res.json({ error: error.message });
   }
 };*/

//AUTENTICACION POR TOKEN, PUEDE UTILIZARSE ESTE MIDDLEWARE O EN EL PASSPORT
export const jwtValidation = (req, res, next) => {
  try {
    console.log(req);
    const token = req.cookies.token;
    const userToken = jwt.verify(token, SECRET_KEY_JWT);
    req.user = userToken;
    next();
  } catch (error) {
    res.json({ error: error.message });
  }
};