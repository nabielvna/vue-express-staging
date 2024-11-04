const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// Define upload directories for different types
const uploadDirs = {
    products: 'public/products',
    profiles: 'public/profiles',
    reviews: 'public/reviews'
};

// Create directories if they don't exist
Object.values(uploadDirs).forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const uploadErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                status: 'error',
                message: 'File too large. Maximum size is 20MB'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                status: 'error',
                message: 'Too many files'
            });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                status: 'error',
                message: `Unexpected field '${err.field}'. Please check your form data field names`
            });
        }
    }
    
    return res.status(500).json({
        status: 'error',
        message: err.message || 'Error processing upload'
    });
};

// Configure storage for different types
const createStorage = (uploadType) => {
    return multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, uploadDirs[uploadType]);
        },
        filename: function(req, file, cb) {
            const uniqueSuffix = uuidv4();
            cb(null, `${uploadType}-${uniqueSuffix}${path.extname(file.originalname)}`);
        }
    });
};

// File filter for images
const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

// Create multer instances for different types
const createMulterInstance = (uploadType, fileLimit = 1) => {
    return multer({
        storage: createStorage(uploadType),
        fileFilter: imageFileFilter,
        limits: {
            fileSize: 20 * 1024 * 1024, // 20MB
            files: fileLimit
        }
    });
};

// Export different upload middlewares
module.exports = {
    // Notice we changed 'images' to 'assets' here to match the client's field name
    uploadErrorHandler,
    products: createMulterInstance('products', 10).array('assets'),
    profilePicture: createMulterInstance('profiles').single('profile_picture'), 
    reviews: createMulterInstance('reviews', 5).array('images')
};