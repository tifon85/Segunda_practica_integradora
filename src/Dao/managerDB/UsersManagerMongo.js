import { UsersModel } from "../../db/models/users.model.js"

export class UserManager{

    //funcion para crear el carrito vacio
    createUser = async (datosUser) => {
        try{
            const response = await UsersModel.create(datosUser);
            return response;
        }catch(error){
            throw new Error(error.message)
        }
    }

    //funcion para traer carrito por email
    getUserByEmail = async (email) => {
        try{
            const user = await UsersModel.findOne({ email })
            return user
        }catch(error){
            throw new Error(error.message)
        }
    }

    //funcion para traer carrito por id
    getUserById = async (id) => {
        try{
            const user = await UsersModel.findOne({ _id: id })
            return user
        }catch(error){
            throw new Error(error.message)
        }
    }

}