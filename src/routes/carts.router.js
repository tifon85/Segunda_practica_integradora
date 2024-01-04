import { Router } from "express";
import { CartManager } from '../Dao/managerDB/CartManagerMongo.js'
import { ProductManager } from '../Dao/managerDB/ProductManagerMongo.js'

const router = Router();

const cartManager = new CartManager()
const prodManager = new ProductManager()

//funcion para crear un carrito
router.post('/', async (req,res) => {
    try{
        await cartManager.createCart()
        res.status(200).json({ message: "Carrito creado" })
    }catch(error){
        res.status(500).json({ message: error.message })
    }
})

//funcion para obtener los productos de un carrito
router.get('/:cid', async (req,res) => {
    const cid = req.params.cid
    try{
        const products = await cartManager.getProductsByCart(cid)
        res.status(200).json({ message: "Productos asociados al id de carrito indicado", products })
    }catch(error){
        res.status(500).json({ message: error.message })
    }
})

//funcion para agregar producto al carrito
router.post('/:cid/product/:pid', async (req,res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    try{
        const cart = await cartManager.getCartByID(cid)
        const prod = await prodManager.getProductByID(pid)
        if(!prod){
            res.status(404).json({ message: "No existe el producto con el id indicado" })
        }else{
            if(!cart){
                res.status(404).json({ message: "No existe el carrido con el id indicado" })
            }else{
                await cartManager.addProductToCart(cid,pid)
                res.status(200).json({ message: "Agregado el producto al carrito" })
            }
        }
        res.redirect("http://localhost:8080/api/views/products")
    }catch(error){
        res.status(500).json({ message: error.message })
    }
})

//funcion para eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req,res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    try{
        const cart = await cartManager.getCartByID(cid)
        console.log(cart)
        console.log(cid)
        console.log(pid)
        if(!cart){
            res.status(404).json({ message: "No existe el carrito" })
        }else{
            const product = cart.products.find(product => product.product._id==pid)
            console.log(product)
            if(!product){
                res.status(404).json({ message: "El producto no está en el carrito" })
            }else{
                await cartManager.deleteProductToCart(cart,pid)
                res.status(200).json({ message: "Producto eliminado del carrito", cart })
            }
        }
    }catch(error){
        res.status(500).json({ message: error.message })
    }
})

//funcion para actualizar carrito
router.put('/:cid', async (req,res) => {
    const cid = req.params.cid
    const products = req.body
    try{
        const cart = await cartManager.getCartByID(cid)
        if(!cart){
            res.status(404).json({ message: "No existe el carrito" })
        }else{
            cart.products=products
            await cartManager.updateCart(cid, cart)
            res.status(200).json({ message: "Carrito vacio", cart })
        }
    }catch(error){
        res.status(500).json({ message: error.message })
    }
})

//funcion actualizar cantidad de unidades de un producto del carrito
router.put('/:cid/products/:pid', async (req,res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const quantity = req.body.quantity
    try{
        const cart = await cartManager.getCartByID(cid)
        if(!cart){
            res.status(404).json({ message: "No existe el carrito" })
        }else{
            const productIndex = cart.products.findIndex((p) => p.product.equals(pid));
            if (productIndex === -1) {
                res.status(404).json({ message: "El producto no está en el carrito" })
            }else{
                cart.products[productIndex].quantity=quantity
                await cartManager.updateCart(cid, cart)
                res.status(200).json({ message: "Cantidad del producto actualizado en el carrito", cart })
            }
        }
    }catch(error){
        res.status(500).json({ message: error.message })
    }
})

router.delete('/:cid', async (req,res) => {
    const cid = req.params.cid
    try{
        const cart = await cartManager.getCartByID(cid)
        if(!cart){
            res.status(404).json({ message: "No existe el carrito" })
        }else{
            await cartManager.deleteAllProductsToCart(cart)
            res.status(200).json({ message: "Carrito vacio", cart })
        }
    }catch(error){
        res.status(500).json({ message: error.message })
    }
})


export default router;