import { Router } from "express";
import { ProductManager } from '../Dao/managerDB/ProductManagerMongo.js'

const router = Router();

const prodManager = new ProductManager()

//OK
router.get('/', async (req,res) => {
    const limit = req.query.limit
    try{
        const products = await prodManager.getProducts()
        limit ? res.status(200).send(products.filter(product => product.id <= limit)) : res.status(200).send(products)
    }catch(error){
        res.status(500).json({ message: error.message })
    }
})

//OK
router.get('/:pid', async (req,res) => {
    const pid = req.params.pid
    try{
        const product = await prodManager.getProductByID(pid)
        if(!product){
            res.status(404).json({ message: "Producto no encontrado con el id de producto indicado" })
        }else{
            res.status(200).json({ message: "Producto encontrado", product })
        }
    }catch(error){
        res.status(500).json({ message: error.message })
    }
})

router.put('/:pid', async (req,res) => {
    const pid = req.params.pid
    const prod = req.body
    try{
        const product = await prodManager.getProductByID(pid)
        if(!product){
            res.status(404).json({ message: "No se encontró el producto a actualizar" })
        }else{
            product.title = prod.title || product.title
            product.description = prod.description || product.description
            product.price = prod.price || product.price
            product.code = prod.code || product.code
            product.stock = prod.stock || product.stock
            product.category = prod.category || product.category
            product.thumbnails = prod.thumbnails || product.thumbnails
            product.status = prod.status || product.status
            await prodManager.updateProduct(pid, product)
            res.status(200).json({ message: "Producto actualizado" })
        }
    }catch(error){
        res.status(500).json({ message: error.message })
    }
})

//OK
router.post('/', async (req,res) => {
    const product = req.body
    try{
        //VALIDACIONES
        if(!product.title || !product.description || !product.price || !product.category || !product.code || !product.stock){
            res.status(404).json({ message: "Todos los campos son obligatorios" })
        }
        const products = await prodManager.getProducts()
        const yaEsta = products.find(item => item.code==product.code)
        if(yaEsta){
            res.status(404).json({ message: "Ya existe un producto registrado con ese codigo" })
        }else{
            await prodManager.addProducts(product)
            res.status(200).json({ message: "Producto agregado" })
        }
    }catch(error){
        res.status(500).json({ message: error.message })
    }
})

//OK
router.delete('/:pid', async (req,res) => {
    const pid = req.params.pid
    try{
        const product = await prodManager.getProductByID(pid)
        if(!product){
            res.status(404).json({ message: "Producto no encontrado con el id de producto indicado" })
        }else{
            await prodManager.deleteProduct(pid)
            res.status(200).json({ message: "Producto eliminado" })
        }
    }catch(error){
        res.status(500).json({ message: error.message })
    }
})

export default router;