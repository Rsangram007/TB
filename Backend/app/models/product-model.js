const mongoose = require('mongoose') 
const { Schema, model } = mongoose 

const productSchema = new Schema({
    productName:String,
    categoryName:{
        type:String,
        ref:"Category"
    },
    subCategory:{
        type:String,
        ref:'SubCategory'
    },
    image:String,
    status:{
        type:String,
        default:"inactive"
    },
    sequence:Number
}, { timestamps: true })

const Product = model('Product', productSchema)

module.exports = Product   