import { Router } from "express"
import { ProductManager } from '../Dao/managerDB/ProductManagerMongo.js'
import { CartManager } from '../Dao/managerDB/CartManagerMongo.js'
import { SessionManager } from '../Dao/managerDB/SessionManagerMongo.js'

const router = Router()

const prodManager = new ProductManager()
const cartManager = new CartManager()
const sessionManager = new SessionManager()
//funcion para mostrar productos desafio anterior
/*router.get('/products', async (req,res) => {
    const products = await prodManager.getProducts()
    console.log(products)
    res.render("home", { products })
})*/

const sessionMiddleware = (req, res, next) => {
    if (req.session.user) {
      return res.redirect('/products')
    }
  
    return next()
}

router.get('/register', sessionMiddleware, async (req, res) => {
    if (req.session.user) {
        return res.redirect("/profile");
    }
    res.render("register");
})

router.get('/login', sessionMiddleware, (req, res) => {
    if (req.session.user) {
        return res.redirect("/profile");
    }
    res.render("login");
})

router.get("/profile", sessionMiddleware, (req, res) => {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    console.log(req.session.user);
    res.render("profile", { user: req.session.user });
});  

router.get('/products', sessionMiddleware, async (req,res) => {
    if (!req.session.user) {
        return res.redirect('/login')
    }

    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    let query = req.query.query
    const sort = req.query.sort

    const params = { page, limit, query, sort }

    try{
        let products = await prodManager.getProducts(params)
        products = products.docs
        console.log(products)
        res.render("products", { products })
    }catch(error){
        res.status(500).json({ message: error.message })
    }
    
})

//funcion para mostrar los productos de un carrito
router.get('/carts/:cid', sessionMiddleware, async (req,res) => {
    if (!req.session.user) {
        return res.redirect('/login')
    }

    const cid = req.params.cid
    try{
        const cart = await cartManager.getCartByID(cid)
        if(!cart){
            res.status(404).json({ message: "No existe el carrito" })
        }else{
            console.log(cart.products)
            const products = cart.products.map(doc => doc.toObject())
            console.log(products)
            res.render("cart", { products })
        }
    }catch(error){
        res.status(500).json({ message: error.message })
    }
})

//funcion para mostrar productos en tiempo real
router.get('/realtimeproducts', async (req,res) => {
    res.render("realtimeproducts")
})

//funcion para mostrar chat en tiempo real
router.get("/chat", (req, res) => {
    res.render("chat");
});

export default router