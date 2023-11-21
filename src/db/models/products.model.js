import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2";

const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
	description: {
        type: String,
        required: true
    },
	code: {
        type: String,
        required: true,
        unique: true
    },
	price: {
        type: Number,
        required: true
    },
	stock: {
        type: Number,
        default: 0
    },
	category: {
        type: String,
        required: true
    },
	thumbnails: {
        type: Array,
        default:[]
    },
	status: {
        type: Boolean,
        default: true
    }
})

productsSchema.plugin(mongoosePaginate);

export const productsModel = mongoose.model('Products',productsSchema)