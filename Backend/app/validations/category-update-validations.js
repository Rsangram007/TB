
const Category = require('../models/category-model');

const categoryUpdateValidation = {
    categoryName: {
        exists: { errorMessage: 'Category name is required'},
        notEmpty: { errorMessage: 'Category name cannot be empty'},
        trim: true,
        custom: {
            options: async function(value, { req }) {
                const categoryId = req.params.id; // Assuming the ID is passed as a route parameter
                const category = await Category.findOne({ categoryName: value });
                if (category && category._id.toString() !== categoryId) {
                    throw new Error('Category already exists');
                } else {
                    return true;
                }
            }
        }
    },
    image: {
        custom: {
            options: (value, { req }) => {
                if (!value) {
                    return true; // Allow empty or null value
                }
                // Validate if an image file is provided
                if (req.file.fieldname !== 'image') {
                    throw new Error('image is required');
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
            }
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
        exists: { errorMessage: 'Sequence is required' },
        isInt: { errorMessage: 'Sequence must be a number' }
    }
};

module.exports = categoryUpdateValidation;
