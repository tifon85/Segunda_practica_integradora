import { sessionsModel } from "../../db/models/sessions.model.js";

export class SessionManager{

    //funcion para crear el carrito vacio
    createUser = async (datosUser) => {
        try{
            const newUser = datosUser;
            const user = await sessionsModel.create(newUser);
        }catch(error){
            throw new Error(error.message)
        }
    }

    //funcion para traer carrito por id
    getUserByEmail = async (email) => {
        try{
            const user = await sessionsModel.findOne({ email })
            return user
        }catch(error){
            throw new Error(error.message)
        }
    }

}