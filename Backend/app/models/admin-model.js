const mongoose = require('mongoose') 
const { Schema, model } = mongoose 

const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    role:{
        type:String,
        default:"admin"
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, { timestamps: true })

const User = model('User', userSchema)

module.exports = User 