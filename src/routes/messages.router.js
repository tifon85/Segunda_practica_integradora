import { Router } from "express";
import { MessageManager } from '../Dao/managerDB/MessageManagerMongo.js'

const router = Router();

const messageManager = new MessageManager()

router.post('/', async (req,res) => {
    const message = req.body
    try{
        await messageManager.createMessage(message)
    }catch(error){
        res.status(500).json({ message: error.message })
    }
})

export default router;