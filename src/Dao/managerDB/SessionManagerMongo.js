import { sessionsModel } from "../../db/models/sessions.model.js";

export class SessionManager{

    //funcion para crear el carrito vacio
    createUser = async (datosUser) => {
        try{
            const response = await sessionsModel.create(datosUser);
            return response;
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