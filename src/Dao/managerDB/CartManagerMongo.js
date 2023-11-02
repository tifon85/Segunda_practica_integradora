import { cartsModel } from "../../db/models/carts.model.js";

export class CartManager{

    //funcion para crear el carrito vacio
    createCart = async () => {
        try{
            const newCart = { products: [] };
            await cartsModel.create(newCart);
        }catch(error){
            throw new Error(error.message)
        }
    }

    //funcion para obtener todos los productos de un carrito indicado
    getProductsByCart = async (idCart) => {
        try{
            const cart = await cartsModel.findById(idCart).populate("products.product", ["name", "price"]);
            return cart
    return response;
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
            const cart = await cartsModel.findById(id)
            return cart
        }catch(error){
            throw new Error(error.message)
        }
    }
    
}