import express from 'express'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import messagesRouter from './routes/messages.router.js'
import viewsRouter from './routes/views.router.js'
import { __dirname } from './utils.js'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import { ProductManager } from './Dao/managerDB/ProductManagerMongo.js'
import { MessageManager } from './Dao/managerDB/MessageManagerMongo.js'
import "./db/configDB.js"

const app = express()
const port = 8080


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))


app.engine("handlebars", engine());

app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");


app.use('/api/products',productsRouter)
app.use('/api/carts',cartsRouter)
app.use('/api/messages',messagesRouter)
app.use('/api/views',viewsRouter)

const httpServer = app.listen(port,(error)=>{
    if(error) console.log(error)
    console.log("Servidor escuchando en el puerto: ", port)
})

const socketServer = new Server(httpServer)

const prodManager = new ProductManager()
const messageManager = new MessageManager()

//socket productos
socketServer.on("connection", async (socket) => {

    const products = await prodManager.getProducts()
    const messages = await messageManager.getMessage()

    //socket productos
    socketServer.emit("products", products);
    socketServer.emit("chat", messages);

    socket.on("CreateProduct", async (value) => {
        await prodManager.addProducts(value)
        const products = await prodManager.getProducts()
        socketServer.emit("products", products);
    });
    socket.on("deleteId", async (value) => {
        await prodManager.deleteProduct(value)
        const products = await prodManager.getProducts()
        socketServer.emit("products", products);
    });

    //socket chat
    socket.on("newUser", (user) => {
        socket.broadcast.emit("userConnected", user);
        socket.emit("connected");
    });
    socket.on("message", async (infoMessage) => {
        await messageManager.createMessage(infoMessage)
        const messages = await messageManager.getMessage()
        socketServer.emit("chat", messages);
    });

  });