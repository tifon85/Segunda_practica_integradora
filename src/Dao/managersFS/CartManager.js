
import fs from 'fs'

export class CartManager{
    constructor(path){
        this.path=path
    }

    //funcion para crear el carrito vacio
    createCart = async () => {
        try{
            let carts = await this.getCarts()
            let cart = {}
            if(carts.length == 0){
                cart.idCart = 1
            }else{
                cart.idCart = carts[carts.length-1].idCart + 1
            }
            cart.products = []
            carts = [...carts, cart]
            await this.updateFile(carts)
        }catch(error){
            throw new Error(error.message)
        }
    }

    //funcion para traer todos los carritos existentes
    getCarts = async () => {
        try{
            if(fs.existsSync(this.path)){
                const dataCarts = await fs.promises.readFile(this.path, 'utf-8')
                return JSON.parse(dataCarts)
            }else{
                await this.updateFile([])
                return []
            }
        }catch(error){
            throw new Error(error.message)
        }
    }

    //funcion para obtener todos los productos de un carrito indicado
    getProductsByCart = async (idCart) => {
        try{
            const carts = await this.getCarts()
            const cart = carts.find(item => item.idCart == idCart)
            const products = cart.products
            return products
        }catch(error){
            throw new Error(error.message)
        }
    }

    //funcion para agregar un producto al carrito
    addProductToCart = async (idCart, idProduct) => {
        try{
            let carts = await this.getCarts()
            const cartIndex = carts.findIndex(item => item.idCart == idCart)
            const productIndex = carts[cartIndex].products.findIndex(item => item.idProduct == idProduct)
            if(productIndex === -1){
                carts[cartIndex].products = [...carts[cartIndex].products, {idProduct, cantidad: 1}]
            }else{
                carts[cartIndex].products[productIndex].cantidad++
            }
            await this.updateFile(carts)
        }catch(error){
            throw new Error(error.message)
        }
    }

    //función para actualizar archivo JSON
    updateFile = async (carts) => {
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null,'\t'))
    }
    
}