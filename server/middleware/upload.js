//server/middleware/upload.js
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const stream = require('stream');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for memory storage (process file in memory)
const storage = multer.memoryStorage();
const multerUpload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Upload stream to Cloudinary
const uploadToCloudinary = (buffer, callback) => {
  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'floral-shop-products',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto' }
      ]
    },
    (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, {
          path: result.secure_url,
          filename: result.public_id
        });
      }
    }
  );
  
  const upload = stream.Readable.from(buffer);
  upload.pipe(uploadStream);
};

// Middleware to handle file upload and Cloudinary processing
const processUpload = multerUpload.single('image');
const uploadMiddleware = (req, res, next) => {
  processUpload(req, res, async (err) => {
    if (err) {
      return next(err);
    }
    
    if (req.file) {
      try {
        const { path, filename } = await new Promise((resolve, reject) => {
          uploadToCloudinary(req.file.buffer, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
        });
        
        req.file.cloudFile = { path, filename };
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        return next(error);
      }
    }
    
    next();
  });
};

module.exports = { uploadMiddleware, multerUpload };