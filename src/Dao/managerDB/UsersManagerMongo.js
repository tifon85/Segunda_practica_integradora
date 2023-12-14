import { UsersModel } from "../../db/models/users.model.js"

export class UserManager{

    //funcion para crear el carrito vacio
    createUser = async (datosUser) => {
        try{
            console.log(datosUser)
            const response = await UsersModel.create(datosUser);
            return response;
        }catch(error){
            throw new Error(error.message)
        }
    }

    //funcion para traer carrito por id
    getUserByEmail = async (email) => {
        try{
            const user = await UsersModel.findOne({ email })
            return user
        }catch(error){
            throw new Error(error.message)
        }
    }

}