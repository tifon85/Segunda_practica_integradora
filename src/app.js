import express from 'express'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import messagesRouter from './routes/messages.router.js'
import viewsRouter from './routes/views.router.js'
import sessionsRouter from './routes/sessions.router.js'
import { __dirname } from './utils.js'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import { ProductManager } from './Dao/managerDB/ProductManagerMongo.js'
import { MessageManager } from './Dao/managerDB/MessageManagerMongo.js'
import { CartManager } from './Dao/managerDB/CartManagerMongo.js'
import { URI } from "./db/configDB.js"
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import "./config/passport.config.js";
import passport from "passport";

const app = express()
const port = 8080

app.use(cookieParser())

//mongo
app.use(
    session({
        store: new MongoStore({
            mongoUrl: URI,
      }),
      secret: "secretSession",
      cookie: { maxAge: 60000 },
    })
  );

// passport
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))

// handlebars
app.engine("handlebars", engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// routes
app.use('/api/products',productsRouter)
app.use('/api/carts',cartsRouter)
app.use('/api/messages',messagesRouter)
app.use('/api/sessions',sessionsRouter)
app.use('/api/views',viewsRouter)

const httpServer = app.listen(port,(error)=>{
    if(error) console.log(error)
    console.log("Servidor escuchando en el puerto: ", port)
})

const socketServer = new Server(httpServer)

const prodManager = new ProductManager()
const messageManager = new MessageManager()
const cartManager = new CartManager()

//socket productos
socketServer.on("connection", async (socket) => {

    const products = await prodManager.getProducts({})
    const messages = await messageManager.getMessage()

    //socket productos
    socketServer.emit("products", products);
    socketServer.emit("chat", messages);

    socket.on("CreateProduct", async (value) => {
        await prodManager.addProducts(value)
        const products = await prodManager.getProducts({})
        socketServer.emit("products", products);
    });
    socket.on("deleteId", async (value) => {
        await prodManager.deleteProduct(value)
        const products = await prodManager.getProducts({})
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

    //socket productos carrito
    /*socket.on("newCart", async () => {
        const idCart = await cartManager.createCart()
        console.log(idCart)
        socket.emit("cartID", idCart);
    });*/

    socket.on("addProduct", async (infoProduct) => {
        console.log(infoProduct)
        await cartManager.addProductToCart(infoProduct.idCart, infoProduct.idProd)
    });

    socket.on("getCartProducts", async (idCart) => {
        console.log(idCart)
        const products = await cartManager.getProductsByCart(idCart)
        socket.emit("productsCart", products);
    });

  });