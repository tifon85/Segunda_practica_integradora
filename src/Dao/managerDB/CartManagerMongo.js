import { cartsModel } from "../../db/models/carts.model.js";

export class CartManager{

    //funcion para crear el carrito vacio
    createCart = async () => {
        try{
            const newCart = { products: [] };
            const cart = await cartsModel.create(newCart);
            return cart._id.toString()
        }catch(error){
            throw new Error(error.message)
        }
    }

    //funcion para obtener todos los productos de un carrito indicado
    getProductsByCart = async (idCart) => {
        try{
            const cart = await cartsModel.findById(idCart).populate("products.product", ["name", "price"]);
            const products = cart.products.map((p) => p.toObject())
            return products
        }catch(error){
            throw new Error(error.message)
        }
    }

    //funcion para agregar un producto al carrito
    addProductToCart = async (idCart, idProduct) => {
        try{
            const cart = await cartsModel.findById(idCart);

            const productIndex = cart.products.findIndex((p) => p.product.equals(idProduct));
            if (productIndex === -1) {
                cart.products.push({ product: idProduct, quantity: 1 });
            } else {
                cart.products[productIndex].quantity++;
            }
            return cart.save();
        }catch(error){
            throw new Error(error.message)
        }
    }

    //funcion para traer carrito por id
    getCartByID = async (id) => {
        try{
            const cart = await cartsModel.findById(id).populate("products.product")
            return cart
        }catch(error){
            throw new Error(error.message)
        }
    }

    //función para eliminar un producto del carrito
    deleteProductToCart = async (cart, idProduct) => {
        try{
            cart.products = cart.products.filter(product => product.product._id!=idProduct)
            return cart.save();
        }catch(error){
            throw new Error(error.message)
        }
    }

    //Actualiza los productos del carrito
    updateCart = async (id, updatedCart) => {
        try{
            await cartsModel.updateOne({ _id: id }, updatedCart);
        }catch (error){
            throw new Error(error.message)
        }
    }

    //función para eliminar todos los productos de un carrito
    deleteAllProductsToCart = async (cart) => {
        try{
            cart.products = []
            return cart.save();
        }catch(error){
            throw new Error(error.message)
        }
    }
    
}