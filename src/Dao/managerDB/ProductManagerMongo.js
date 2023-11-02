import { productsModel } from "../../db/models/products.model.js";

export class ProductManager {

    //función para agregar un producto a los ya existentes
    addProducts = async (product) => {
        try {
            await productsModel.create(product)
        }catch(error){
            throw new Error(error.message)
        }
    }

    //función para obtener todos los productos existentes
    getProducts = async () => {
        try{
            const products = await productsModel.find()
            return products
        }catch(error){
            throw new Error(error.message)
        }
    }

    //función para obtener un producto indicado por ID
    getProductByID = async (id) => {
        try{
            const product = await productsModel.findById(id)
            return product
        }catch(error){
            throw new Error(error.message)
        }
    }

    //función para actualizar producto indicado por ID
    updateProduct = async (id, updatedProduct) => {
        try{
            await productsModel.updateOne({ _id: id }, updatedProduct);
        }catch (error){
            throw new Error(error.message)
        }
    }

    //función para eliminar producto indicado por ID
    deleteProduct = async (id) => {
        try{
            await productsModel.deleteOne({ _id: id })
        }catch(error){
            throw new Error(error.message)
        }
    }

}

