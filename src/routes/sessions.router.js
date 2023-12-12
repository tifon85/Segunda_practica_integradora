
import { Router } from "express";
import { SessionManager } from '../Dao/managerDB/SessionManagerMongo.js'

const sessionRouter = Router();

const sessionManager = new SessionManager()

sessionRouter.get('/', (req, res) => {
    if (!req.session.counter) {
      req.session.counter = 1
      req.session.name = req.query.name
  
      return res.status(200).json(`Bienvenido ${req.session.name}`)
    } else {
      req.session.counter++
  
      return res.status(200).json(`${req.session.name} has visitado la página ${req.session.counter} veces`)
    }
  })
  
  sessionRouter.post('/register', async (req, res) => {
    const user = await userModel.create(req.body)
  
    return res.redirect('/login')
    //return res.status(201).json(user)
  })
  
  sessionRouter.post('/login', async (req, res) => {
    let user = await sessionManager.getUserByEmail(req.body.email)
  
    if (!user) {
      return res.status(401).json({
        error: 'El usuario no existe en el sistema'
      })
    }
  
    if (user.password !== req.body.password) {
      return res.status(401).json({
        error: 'Datos incorrectos'
      })
    }
  
    user = user.toObject()
  
    delete user.password
  
    req.session.user = user
    
    return res.redirect('/products')
  })
  
  module.exports = sessionRouter