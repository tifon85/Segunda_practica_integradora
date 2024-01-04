// _dirname
import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
//import jwt from "jsonwebtoken";
//const SECRET_KEY_JWT = "jwtSecret";

//hash para cifrar las password
export const hashData = async (data) => {
  return bcrypt.hash(data, 10);
};
  
//verificar si la password coincide
export const compareData = async (data, hashedData) => {
  return bcrypt.compare(data, hashedData);
};

//generar token - jwt
/*export const generateToken = (user) => {
  const token = jwt.sign(user, SECRET_KEY_JWT, { expiresIn: 300 });
  console.log("token", token);
  return token;
};*/

export const __dirname = dirname(fileURLToPath(import.meta.url));