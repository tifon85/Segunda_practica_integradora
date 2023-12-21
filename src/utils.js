// _dirname
import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

//hash para cifrar las password
export const hashData = async (data) => {
    return bcrypt.hash(data, 10);
  };
  
  //verificar si la password coincide
  export const compareData = async (data, hashedData) => {
    return bcrypt.compare(data, hashedData);
  };

export const __dirname = dirname(fileURLToPath(import.meta.url));

export default __dirname