const Category = require('../models/category-model');

const subCategoryUpdateValidation = {
    subCategory: {
        exists: {errorMessage: 'subCategory name is required' },
        notEmpty: {errorMessage: 'subcategory name cannot be empty'},
        trim: true
    },
    categoryName:{
        exists: {errorMessage: 'Category name is required'},
        notEmpty: {errorMessage: 'Category name cannot be empty'},
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
            options: ((value, { req }) => {
                if (!req.file) {
                    // If no file is provided, skip the validation
                    return true;
                }
    
                // If a file is provided, perform the validation
                if (req.file.fieldname !== 'image') {
                    throw new Error('Image is required');
                }
                const file = req.file;
                const allowedTypes = ['image/jpeg', 'image/png'];
                if (!allowedTypes.includes(file.mimetype)) {
                    throw new Error('Invalid file type');
                }
                if (file.size > 5 * 1024 * 1024) {
                    throw new Error('File size should not exceed 5MB');
                }
                return true;
            })
        }
    },
    status: {
        exists: {errorMessage: 'Status is required'},
        isIn: {
            options: [['active', 'inactive']],
            errorMessage: 'Status must be either active or inactive'
        }
    },
    sequence: {
        exists: {errorMessage: 'Sequence is required'},
        isInt: { errorMessage: 'Sequence must be a number' },
        notEmpty: {errorMessage: 'Sequence name cannot be empty'},
    }
};

module.exports = subCategoryUpdateValidation;
