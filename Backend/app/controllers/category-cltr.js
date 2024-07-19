const { validationResult } = require('express-validator')
const Category=require('../models/category-model')
const categoryCltr={}

categoryCltr.create=async(req,res)=>{
     const errors = validationResult(req) 
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()})
        }
        const body=req.body
        try{
        const category=new Category(body)
        category.image=req.file.path
        category.save()
        res.status(201).json(category)
    }catch(err) {
        res.status(500).json({ error: 'something went wrong'})
    }
} 

categoryCltr.update = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const id = req.params.id;
    const body = req.body;
    try {
        const existingCategory = await Category.findById(id);
        if (!existingCategory) {
            return res.status(404).json('No category found');
        }
        if (req.file) {
            const file = req.file;
            const allowedTypes = ['image/jpeg', 'image/png'];
            
            if (!allowedTypes.includes(file.mimetype)) {
                return res.status(400).json({ error: 'Invalid file type' });
            }
            
            if (file.size > 5 * 1024 * 1024) {
                return res.status(400).json({ error: 'File size should not exceed 5MB' });
            }
            
            body.image = req.file.path; 
        } else {
            body.image = existingCategory.image;
        }
        const category = await Category.findByIdAndUpdate(id, body, { new: true });
        return res.json(category);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

categoryCltr.delete=async(req,res)=>{
    const id=req.params.id
    try{
        const category=await Category.findOneAndDelete(id)
        if(!category){
            return res.status(404).json('No category found')
        }
        return res.json('Deleted successfully')
    }catch(err) {
        console.log(err)
        res.status(500).json({ error: 'something went wrong'})
    }
}

categoryCltr.allCategories=async(req,res)=>{
    try{
        const categories=await Category.find()
        if(categories.length===0){
            return res.status(404).json("No categories found")
        }
        return res.json(categories)
        
    }catch(err) {
        console.log(err)
        res.status(500).json({ error: 'something went wrong'})
    }
}

categoryCltr.singleCategory=async(req,res)=>{
    const id=req.params.id
    try{
        const category=await Category.findById(id)
        if(category){
            return res.json(category)
        }
        return res.status(404).json({})

    }catch(err) {
        console.log(err)
        res.status(500).json({ error: 'something went wrong'})
    }
}

module.exports=categoryCltr