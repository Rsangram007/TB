const Category = require('../models/category-model');
const SubCategory=require('../models/subcategory-model')

const productCreateValidation = {
    productName:{
        exists:{ errorMessage: ' product name is required' },
        notEmpty: { errorMessage: 'product name cannot be empty' },
        trim: true,
    },
    subCategory: {
        exists: { errorMessage: 'subcategory name is required' },
        notEmpty: { errorMessage: 'subcategory name cannot be empty' },
        trim: true,
        custom:{
            options:async function(value,{req}){
                const category=await SubCategory.findOne({subCategory:req.body.subCategory})
                if(!category){
                    throw new Error('Invalid SubCategory Name')
                }else{
                    return true
                }
            }
        }
    },
    categoryName:{
        exists: { errorMessage: 'Category name is required' },
        notEmpty: { errorMessage: 'Category name cannot be empty' },
        trim: true,
        custom:{
            options:async(value,{req})=>{
                const categoryExists=await Category.findOne({categoryName:req.body.categoryName})
                console.log(categoryExists)
                if(!categoryExists){
                    throw new Error('Invalid Category Name')
                }else{
                    return true
                }
            }
        }
    },
    image: {
        custom: {
            options: (value, { req }) => {
                //console.log('validation',req.file.fieldname)
                if ( req.file.fieldname !=='image') {
                    throw new Error('image is required');
                }
                const file = req.file;
                const allowedTypes = ['image/jpeg', 'image/png'];
                if (!allowedTypes.includes(file.mimetype)) {
                    throw new Error('Invalid file type');
                }
                if (file.size > 5 * 1024 * 1024) {
                    throw new Error('File size should not exceeds 5MB');
                }
                return true;
            }
        }
    },
    sequence: {
        exists: {errorMessage: 'Sequence is required'},
        isInt: {errorMessage: 'Sequence must be a number'},
        notEmpty: { errorMessage: 'Sequence name cannot be empty' },
        
    }
};

module.exports = productCreateValidation;

