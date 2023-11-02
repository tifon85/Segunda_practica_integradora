import { messagesModel } from "../../db/models/messages.model.js";

export class MessageManager{

    //función para guardar un mensaje
    createMessage = async (message) => {
        try {
            await messagesModel.create(message)
        }catch(error){
            throw new Error(error.message)
        }
    }

    getMessage = async () => {
        try{
            const messages = await messagesModel.find()
            return messages
        }catch(error){
            throw new Error(error.message)
        }
    }

}