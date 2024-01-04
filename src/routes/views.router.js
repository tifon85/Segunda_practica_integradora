import { Router } from "express"
import { ProductManager } from '../Dao/managerDB/ProductManagerMongo.js'
import { CartManager } from '../Dao/managerDB/CartManagerMongo.js'
import passport from "passport";

const router = Router()

const prodManager = new ProductManager()
const cartManager = new CartManager()

router.get('/', async (req, res) => {
    res.redirect("http://localhost:8080/api/views/login");
})

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

router.get("/profile", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (!req.session.user) {
      return res.redirect("http://localhost:8080/api/views/login");
    }
    /*console.log(req.session.user);*/
    res.render("profile", { user: req.session.user });
  });

  router.get("/restaurar", (req, res) => {
    res.render("restaurar");
  });
  
  router.get("/error", (req, res) => {
    res.render("error");
  });

router.get('/products', async (req,res) => {
    if (!req.session.user) {
        return res.redirect("http://localhost:8080/api/views/login");
    }

    try{
        console.log(req.session.user)
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