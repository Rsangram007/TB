const { validationResult } = require('express-validator')
const Product=require('../models/product-model')
const productCltr={}

productCltr.create=async(req,res)=>{
    const errors = validationResult(req) 
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()})
        }
        const body=req.body
        try{
        const category=new Product(body)
        category.image=req.file.path
        category.save()
        res.status(201).json(category)
    }catch(err) {
        console.log(err)
        res.status(500).json({ error: 'something went wrong'})
    }
}

productCltr.update = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const id = req.params.id;
    const body = req.body;
    try {
        // Find the existing subcategory
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json('No subcategory found');
        }
        // Check if a new image is uploaded
        if (req.file) {
            const file = req.file;
            const allowedTypes = ['image/jpeg', 'image/png'];
            
            if (!allowedTypes.includes(file.mimetype)) {
                return res.status(400).json({ error: 'Invalid file type' });
            }
            
            if (file.size > 5 * 1024 * 1024) {
                return res.status(400).json({ error: 'File size should not exceed 5MB' });
            }
            // If valid, update the image field in the body with the new image path (assuming you handle image storage and get the path)
            body.image = req.file.path; // Adjust this to how you store/get your image path
        } else {
            // If no new image is uploaded, keep the existing image
            body.image = existingProduct.image;
        }
        // Update the subcategory
        const product = await Product.findByIdAndUpdate(id, body, { new: true });
        return res.json(product);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

productCltr.delete=async(req,res)=>{
    const id=req.params.id
    try{
        const product=await Product.findOneAndDelete(id)
        if(!product){
            return res.status(404).json('No category found')
        }
        return res.json(product)
    }catch(err) {
        console.log(err)
        res.status(500).json({ error: 'something went wrong'})
    }
}

productCltr.allProducts=async(req,res)=>{
    try{
        const products=await Product.find()
        if(products.length===0){
            return res.status(404).json("No categories found")
        }
        return res.json(products)
    }catch(err) {
        console.log(err)
        res.status(500).json({ error: 'something went wrong'})
    }
}

productCltr.singleProduct=async(req,res)=>{
    const id=req.params.id
    try{
        const product=await Product.findById(id)
        if(product){
            return res.json(product)
        }
        return res.status(404).json({})
    }catch(err) {
        console.log(err)
        res.status(500).json({ error: 'something went wrong'})
    }
}

module.exports=productCltr
