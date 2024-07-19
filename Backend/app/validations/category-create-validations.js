
const Category = require('../models/category-model');

const categoryCreateValidation = {
    categoryName: {
        exists: { errorMessage: 'Category name is required' },
        notEmpty: { errorMessage: 'Category name cannot be empty' },
        trim: true,
        custom:{
            options:async function(value,{req}){
                const category=await Category.findOne({categoryName:req.body.categoryName})
                if(category){
                    throw new Error('Category already exists')
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
        exists: { errorMessage: 'Sequence is required' },
        notEmpty: { errorMessage: 'Category name cannot be empty' },
        isInt: { errorMessage: 'Sequence must be a number' }
    }
};

module.exports = categoryCreateValidation;
