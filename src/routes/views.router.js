import { Router } from "express"
import { ProductManager } from '../Dao/managerDB/ProductManagerMongo.js'

const router = Router()

const prodManager = new ProductManager()

router.get('/products', async (req,res) => {
    const products = await prodManager.getProducts()
    console.log(products)
    res.render("home", { products })
})

router.get('/realtimeproducts', async (req,res) => {
    res.render("realtimeproducts")
})

router.get("/chat", (req, res) => {
    res.render("chat");
  });

export default router