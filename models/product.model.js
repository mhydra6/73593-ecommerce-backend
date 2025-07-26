const mongoose = require ("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema ({
    title : {
        type: String,
        required:true,
        trim: true,
        minlength: 3,
        maxlength: 100,
    },
    price: {
        type: Number,
        required:true,
    },
    image: {
        type: String,

    },
    reviews:{
        type: Number,
        required:true,
    },
    rating:{
        type: Number,
        required:true,
    },
    status:{
        type: String,
        required:true,
    },
    descripcion: {
        type: String,
        required:true,
        trim: true,
        minlength: 10,
        maxlength: 2000,
    },
    ingreso:{
        type: Date,
        required:true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
