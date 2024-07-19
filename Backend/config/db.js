const mongoose = require('mongoose')

const configureDb = async()=>{
    try{
        await mongoose.connect( "mongodb+srv://sangram:sangram@sangram.44sfsmu.mongodb.net/Table")
        console.log('successfully connect to the database')
    }catch(err){
        console.log(err)
    }
}

module.exports=configureDb;