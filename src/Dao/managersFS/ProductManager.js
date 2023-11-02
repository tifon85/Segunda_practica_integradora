
import fs from 'fs'

export class ProductManager {
    constructor(path){
        this.path=path
    }

    //función para agregar un producto a los ya existentes
    addProducts = async (product) => {
        try {
            const products = await this.getProducts()
            if(products.length == 0){
                product.id=1
            }else{
                product.id=products[products.length-1].id + 1
            }
            product.status=true
            const addedProducts=[...products,product]
            await this.updateFile(addedProducts)
        }catch(error){
            throw new Error(error.message)
        }
    }

    //función para obtener todos los productos existentes
    getProducts = async () => {
        try{
            if(fs.existsSync(this.path)){
                const dataProducts = await fs.promises.readFile(this.path, 'utf-8')
                return JSON.parse(dataProducts)
            }else{
                await this.updateFile([])
                return []
            }
        }catch(error){
            throw new Error(error.message)
        }
    }

    //función para obtener un producto indicado por ID
    getProductByID = async (id) => {
        try{
            const products = await this.getProducts()
            const product = products.find(item => item.id==id)
            return product
        }catch(error){
            throw new Error(error.message)
        }
    }

    //función para actualizar producto indicado por ID
    updateProduct = async (id, updatedProduct) => {
        let products = await this.getProducts()
        const index = products.findIndex(product => product.id == id)
        try{
            products[index] = { ...updatedProduct, id: products[index].id }
            await this.updateFile(products)
        }catch (error){
            throw new Error(error.message)
        }
    }

    //función para eliminar producto indicado por ID
    deleteProduct = async (id) => {
        try{
            const products = await this.getProducts()
            const filterProducts = products.filter(product => product.id!=id)
            await this.updateFile(filterProducts)
        }catch(error){
            throw new Error(error.message)
        }
    }

    //función para actualizar archivo JSON
    updateFile = async (products) => {
        await fs.promises.writeFile(this.path, JSON.stringify(products, null,'\t'))
    }

}

