const mongoose = require('mongoose') 
const { Schema, model } = mongoose 

const categorySchema = new Schema({
    categoryName:String,
    image:String,
    status:{
        type:String,
        default:"inactive"
    },
    sequence:Number
}, { timestamps: true })

const Category = model('Category', categorySchema)

module.exports = Category