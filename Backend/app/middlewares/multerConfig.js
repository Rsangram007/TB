const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Destination directory for storing uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
});

const fileFilter = (req, file, cb) => {
    //console.log('File MIME type:', file.mimetype);  // Log the MIME type
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true); // Accept file
    } else {
        cb(new Error('Invalid file type'), false); // Reject file
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
    