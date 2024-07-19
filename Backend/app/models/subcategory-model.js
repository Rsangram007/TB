const mongoose = require('mongoose') 
const { Schema, model } = mongoose 

const subCategorySchema = new Schema({
    categoryName:{
        type:String,
        ref:"Category"
    },
    subCategory:String,
    image:String,
    status:{
        type:String,
        default:'inactive'
    },
    sequence:Number
}, { timestamps: true })

const SubCategory = model('SubCategory', subCategorySchema)

module.exports = SubCategory  