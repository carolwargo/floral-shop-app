const Product = require('../models/Product');
const { uploadToCloudinary } = require('../middleware/upload');

// Get all products with optional search and limit
const getProducts = async (req, res) => {
  try {
    const { search, limit } = req.query;
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    const products = await Product.find(query).limit(parseInt(limit) || 0);
    res.json(products);
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Fetch product error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  try {
    console.log('\n🚀 === NEW PRODUCT CREATION START ===');
    
    // Log incoming request details
    console.log('📡 Request info:');
    console.log(`  - Method: ${req.method}`);
    console.log(`  - URL: ${req.originalUrl}`);
    console.log(`  - Content-Type: ${req.headers['content-type'] || 'NOT SET'}`);
    
    // Log form fields
    console.log('\n📋 Form fields received:');
    console.log('  Raw req.body:', req.body);
    console.log('  Body type:', typeof req.body);
    console.log('  Body keys:', Object.keys(req.body || {}));
    
    // Log file status
    console.log('\n🖼️ File upload status:');
    if (req.file) {
      console.log('  ✅ FILE RECEIVED SUCCESSFULLY!');
      console.log('  File details:', {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: `${req.file.size} bytes`,
        bufferLength: req.file.buffer ? `${req.file.buffer.length} bytes` : 'NO BUFFER',
        bufferType: typeof req.file.buffer
      });
    } else {
      console.log('  ❌ NO FILE RECEIVED');
      console.log('  Possible causes:');
      console.log('    - Frontend not using FormData');
      console.log('    - Multer middleware missing from route');
      console.log('    - Wrong field name (should be "image")');
      console.log('    - File size too large (>5MB)');
    }
    
    // Extract form data
    const { name, price, description, stock } = req.body;
    
    // Validate required fields
    if (!name || !price) {
      console.log('❌ VALIDATION FAILED: Missing required fields');
      console.log('  Name received:', name);
      console.log('  Price received:', price);
      return res.status(400).json({ error: 'Name and price are required' });
    }
    
    // Prepare base product data
    const productData = {
      name: name.trim(),
      price: parseFloat(price),
      description: description ? description.trim() : '',
      stock: parseInt(stock) || 0,
    };
    
    console.log('\n📝 Base product data prepared:');
    console.log('  - Name:', productData.name);
    console.log('  - Price:', productData.price);
    console.log('  - Stock:', productData.stock);
    
    // Handle image upload
    let imageUrl = null;
    if (req.file) {
      console.log('\n☁️ === CLOUDINARY UPLOAD PROCESS ===');
      
      try {
        // Validate file before processing
        if (!req.file.buffer) {
          throw new Error('File buffer is missing - multer configuration issue');
        }
        
        if (!Buffer.isBuffer(req.file.buffer)) {
          throw new Error(`Invalid buffer type: ${typeof req.file.buffer}`);
        }
        
        if (req.file.buffer.length === 0) {
          throw new Error('File buffer is empty - file corruption');
        }
        
        if (!req.file.mimetype || !req.file.mimetype.startsWith('image/')) {
          throw new Error(`Invalid file type received: ${req.file.mimetype || 'unknown'}`);
        }
        
        console.log('✅ File validation PASSED');
        console.log('  - Buffer size:', req.file.buffer.length, 'bytes');
        console.log('  - First 10 bytes (hex):', req.file.buffer.slice(0, 10).toString('hex'));
        
        // Upload to Cloudinary
        console.log('📤 Initiating Cloudinary upload...');
        imageUrl = await uploadToCloudinary(req.file.buffer);
        
        // Validate Cloudinary response
        if (!imageUrl) {
          throw new Error('Cloudinary returned null/undefined URL');
        }
        
        if (typeof imageUrl !== 'string') {
          throw new Error(`Cloudinary returned non-string type: ${typeof imageUrl}`);
        }
        
        if (imageUrl.length < 10) {
          throw new Error(`Cloudinary URL too short: ${imageUrl}`);
        }
        
        if (!imageUrl.startsWith('http')) {
          throw new Error(`Invalid URL protocol: ${imageUrl.substring(0, 20)}...`);
        }
        
        if (!imageUrl.includes('res.cloudinary.com')) {
          throw new Error(`URL not from Cloudinary: ${imageUrl.substring(0, 50)}...`);
        }
        
        console.log('✅ CLOUDINARY UPLOAD SUCCESSFUL!');
        console.log('  URL:', imageUrl.substring(0, 60) + '...');
        console.log('  Length:', imageUrl.length);
        console.log('  Domain:', imageUrl.includes('res.cloudinary.com') ? '✅ Cloudinary' : '❌ Unknown');
        
        // Add to product data
        productData.image = imageUrl;
        
      } catch (uploadError) {
        console.error('\n❌ === CLOUDINARY UPLOAD FAILURE ===');
        console.error('  Error type:', uploadError.constructor.name);
        console.error('  Error message:', uploadError.message);
        console.error('  Error code:', uploadError.code);
        console.error('  HTTP code:', uploadError.http_code);
        console.error('  Full error object:', JSON.stringify(uploadError, null, 2));
        console.error('====================================');
        
        // Don't fail the entire product creation
        imageUrl = null;
        console.log('⚠️  CONTINUING WITHOUT IMAGE - product will save without photo');
      }
    } else {
      console.log('\nℹ️  NO IMAGE UPLOAD - product will save without photo');
    }
    
    // Final data validation
    console.log('\n🔍 === FINAL DATA VALIDATION ===');
    console.log('  All fields:', Object.keys(productData));
    console.log('  Name:', productData.name);
    console.log('  Price:', productData.price);
    console.log('  Image field exists:', 'image' in productData);
    console.log('  Image value:', productData.image || 'NO IMAGE');
    console.log('  Image is valid URL:', productData.image ? productData.image.startsWith('http') : false);
    
    // CRITICAL: Prevent empty image strings
    if (productData.image === '' || productData.image === null || productData.image === undefined) {
      console.log('🧹 REMOVING INVALID IMAGE FIELD');
      delete productData.image;
    }
    
    // Save to database
    console.log('\n💾 === DATABASE SAVE ===');
    const product = new Product(productData);
    
    console.log('  Creating new Product instance...');
    const savedProduct = await product.save();
    
    console.log('✅ DATABASE SAVE SUCCESS!');
    console.log('  Product ID:', savedProduct._id.toString());
    console.log('  Product name:', savedProduct.name);
    console.log('  Image field in saved doc:', 'image' in savedProduct._doc);
    console.log('  Saved image value:', savedProduct.image);
    console.log('  Image is valid URL:', savedProduct.image ? savedProduct.image.startsWith('http') : false);
    
    // Verify by fetching fresh from database
    console.log('\n🔍 === DATABASE VERIFICATION ===');
    const freshProduct = await Product.findById(savedProduct._id);
    
    console.log('  Fresh from DB - ID:', freshProduct._id.toString());
    console.log('  Fresh from DB - Name:', freshProduct.name);
    console.log('  Fresh from DB - Image field exists:', 'image' in freshProduct._doc);
    console.log('  Fresh from DB - Image value:', freshProduct.image);
    console.log('  Fresh from DB - Image is valid:', freshProduct.image ? freshProduct.image.startsWith('http') : false);
    
    console.log('\n🌸 === UPLOAD PROCESS COMPLETE ===');
    console.log('=' .repeat(50));
    
    // Return the fresh product
    res.status(201).json(freshProduct);
    
  } catch (error) {
    console.error('\n💥 === CRITICAL FAILURE ===');
    console.error('  Timestamp:', new Date().toISOString());
    console.error('  Error type:', typeof error);
    console.error('  Error constructor:', error.constructor ? error.constructor.name : 'Unknown');
    console.error('  Error message:', error.message);
    console.error('  Error code:', error.code);
    console.error('  Full error:', error);
    console.error('  Stack trace:', error.stack ? error.stack.split('\n').slice(0, 5).join('\n') : 'No stack trace');
    console.error('=' .repeat(50));
    
    res.status(500).json({
      error: 'Failed to create product',
      debug: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        code: error.code,
        stack: error.stack
      } : undefined
    });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    console.log('\n🔄 === PRODUCT UPDATE ===');
    console.log('Target ID:', req.params.id);
    console.log('Form data:', req.body);
    
    if (req.file) {
      console.log('New image file received:', req.file.originalname);
    } else {
      console.log('No new image - preserving existing');
    }
    
    const { name, price, description, stock } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }
    
    const updateData = {
      name: name.trim(),
      price: parseFloat(price),
      description: description ? description.trim() : '',
      stock: parseInt(stock) || 0,
    };
    
    // Only update image if new file provided
    if (req.file) {
      try {
        console.log('Processing image update...');
        const imageUrl = await uploadToCloudinary(req.file.buffer);
        
        if (imageUrl && imageUrl.startsWith('https://res.cloudinary.com')) {
          updateData.image = imageUrl;
          console.log('Image updated successfully');
        } else {
          console.log('Invalid image URL, skipping image update');
        }
      } catch (error) {
        console.error('Image update failed:', error.message);
        // Continue without image update
      }
    }
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    console.log('Product updated:', product.name);
    res.json(product);
  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({ error: error.message });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Product delete error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};