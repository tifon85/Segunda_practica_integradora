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

    getProducts = async (obj) => {

        let { limit, page, sort, query } = obj

        if(!limit){
            limit=10
        }

        if(!page){
            page=1
        }

        if (sort=='asc' || sort==1) {
            sort = { price: 1 }
        }else{
            if(sort=='desc' || sort==-1){
                sort = { price: -1 }
            }else{
                sort=null
            }
        }
    
        if(query){
            query={query}
        }else{
            query={}
        }

        try{
            const response = await productsModel.paginate(query, {limit, page, sort})
            const products = {
                payload: response.docs,
                totalPages: response.totalPages,
                prevPage: response.prevPage,
                nextPage: response.nextPage,
                Page: response.page,
                hasPrevPage: response.hasPrevPage,
                hasNextPage: response.hasNextPage,
                next: response.hasNextPage
                  ? `http://localhost:8080/api/products?page=${response.nextPage}`
                  : null,
                prev: response.hasPrevPage
                  ? `http://localhost:8080/api/products?page=${response.prevPage}`
                  : null,
            };
            return products;
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

    //funcion que verifica si existe producto con el codigo a registrar
    existProductCode = async (code) => {
        try{
            const product = await productsModel.find({code:code})
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

