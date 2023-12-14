import { Router } from "express"
import { ProductManager } from '../Dao/managerDB/ProductManagerMongo.js'
import { CartManager } from '../Dao/managerDB/CartManagerMongo.js'
import { UserManager } from '../Dao/managerDB/UsersManagerMongo.js'

const router = Router()

const prodManager = new ProductManager()
const cartManager = new CartManager()
const userManager = new UserManager()
//funcion para mostrar productos desafio anterior
/*router.get('/products', async (req,res) => {
    const products = await prodManager.getProducts()
    console.log(products)
    res.render("home", { products })
})*/

router.get('/register', async (req, res) => {
    if (req.session.user) {
        return res.redirect("http://localhost:8080/api/views/products");
    }
    res.render("register");
})

router.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect("http://localhost:8080/api/views/products");
    }
    res.render("login");
})

router.get("/profile", (req, res) => {
    if (!req.session.user) {
      return res.redirect("http://localhost:8080/api/views/login");
    }
    console.log(req.session.user);
    res.render("profile", { user: req.session.user });
  });

router.get('/products', async (req,res) => {
    if (!req.session.user) {
        return res.redirect("http://localhost:8080/api/views/login");
    }

    try{
        let products = await prodManager.getProducts({})
        res.render("products", { products , user: req.session.user })
    }catch(error){
        res.status(500).json({ message: error.message })
    }
    
})

//funcion para mostrar los productos de un carrito
router.get('/carts/:cid', async (req,res) => {
    if (!req.session.user) {
        return res.redirect("http://localhost:8080/api/views/login")
    }

    const cid = req.params.cid
    try{
        const products = await cartManager.getProductsByCart(cid)
        if(!products){
            res.status(404).json({ message: "No existe el carrito" })
        }else{
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