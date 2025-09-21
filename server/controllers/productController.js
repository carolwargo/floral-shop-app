const Product = require('../models/Product');
const { uploadToCloudinary } = require('../middleware/upload');

// Get all products with optional search and limit
const getProducts = async (req, res) => {
  try {
    const { search, limit } = req.query;
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    const products = await Product.find(query).limit(parseInt(limit) || 0);
    
    // Debug: Log image status for first few products
    if (process.env.NODE_ENV === 'development') {
      console.log('=== GET PRODUCTS DEBUG ===');
      products.slice(0, 3).forEach((product, index) => {
        console.log(`Product ${index + 1}:`, {
          name: product.name,
          image: product.image,
          hasImage: !!product.image,
          imageValid: product.image && product.image.startsWith('http')
        });
      });
      console.log(`Total products: ${products.length}`);
      console.log('========================');
    }
    
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
    
    // Debug: Log product image info
    if (process.env.NODE_ENV === 'development') {
      console.log('=== GET PRODUCT DEBUG ===');
      console.log('Product:', {
        name: product.name,
        image: product.image,
        hasImage: !!product.image,
        imageValid: product.image && product.image.startsWith('http'),
        imageLength: product.image ? product.image.length : 0
      });
      console.log('============================');
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
    console.log('=== CREATE PRODUCT DEBUG ===');
    console.log('Request body:', req.body);
    console.log('Request file:', {
      fieldname: req.file?.fieldname,
      originalname: req.file?.originalname,
      mimetype: req.file?.mimetype,
      size: req.file?.size,
      bufferLength: req.file?.buffer?.length
    });
    
    const { name, price, description, stock } = req.body;
    
    // Validate required fields
    if (!name || !price) {
      console.log('❌ Validation failed: missing name or price');
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const productData = {
      name: name.trim(),
      price: parseFloat(price),
      description: description ? description.trim() : '',
      stock: parseInt(stock) || 0,
    };

    console.log('Base product data:', productData);

    // Handle image upload if file is provided
    if (req.file) {
      console.log('🔄 Processing image upload...');
      try {
        if (!req.file.buffer || req.file.buffer.length === 0) {
          throw new Error('Empty file buffer received');
        }
        
        const imageUrl = await uploadToCloudinary(req.file.buffer);
        
        // VALIDATE the URL before saving
        if (!imageUrl || !imageUrl.startsWith('http')) {
          console.error('❌ Invalid image URL from Cloudinary:', imageUrl);
          return res.status(500).json({ 
            error: 'Image upload failed - invalid URL returned',
            receivedUrl: imageUrl
          });
        }
        
        console.log('✅ Valid image URL received:', {
          url: imageUrl,
          length: imageUrl.length,
          startsWithCloudinary: imageUrl.startsWith('https://res.cloudinary.com')
        });
        
        productData.image = imageUrl;
      } catch (uploadError) {
        console.error('❌ Cloudinary upload failed:', uploadError);
        console.error('Upload error details:', {
          message: uploadError.message,
          code: uploadError.code,
          http_code: uploadError.http_code
        });
        
        // Don't fail the entire product creation if image fails
        // Just log the error and continue without image
        console.log('⚠️ Continuing without image...');
      }
    } else {
      console.log('ℹ️ No file uploaded - product will save without image');
    }

    console.log('Final product data before save:', productData);
    
    const product = new Product(productData);
    const savedProduct = await product.save();
    
    console.log('✅ Product saved successfully:', {
      id: savedProduct._id,
      name: savedProduct.name,
      hasImage: !!savedProduct.image,
      imageUrl: savedProduct.image
    });
    
    // Return the saved product with populated fields if needed
    const responseProduct = await Product.findById(savedProduct._id);
    res.status(201).json(responseProduct);
  } catch (error) {
    console.error('❌ Product creation failed:', error);
    console.error('Error stack:', error.stack);
    res.status(400).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    console.log('=== UPDATE PRODUCT DEBUG ===');
    console.log('Updating product ID:', req.params.id);
    console.log('Request body:', req.body);
    console.log('Request file:', {
      fieldname: req.file?.fieldname,
      originalname: req.file?.originalname,
      mimetype: req.file?.mimetype,
      size: req.file?.size,
      bufferLength: req.file?.buffer?.length
    });
    
    const { name, price, description, stock } = req.body;
    
    // Validate required fields
    if (!name || !price) {
      console.log('❌ Validation failed: missing name or price');
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const updateData = {
      name: name.trim(),
      price: parseFloat(price),
      description: description ? description.trim() : '',
      stock: parseInt(stock) || 0,
    };

    console.log('Base update data:', updateData);

    // Handle image update if new file is uploaded
    if (req.file) {
      console.log('🔄 Processing image update...');
      try {
        if (!req.file.buffer || req.file.buffer.length === 0) {
          throw new Error('Empty file buffer received');
        }
        
        const imageUrl = await uploadToCloudinary(req.file.buffer);
        
        // VALIDATE the URL before saving
        if (!imageUrl || !imageUrl.startsWith('http')) {
          console.error('❌ Invalid image URL from Cloudinary:', imageUrl);
          return res.status(500).json({ 
            error: 'Image upload failed - invalid URL returned',
            receivedUrl: imageUrl
          });
        }
        
        console.log('✅ Valid image URL for update:', imageUrl);
        updateData.image = imageUrl;
      } catch (uploadError) {
        console.error('❌ Cloudinary upload failed during update:', uploadError);
        // Don't fail the entire update if image fails
        console.log('⚠️ Continuing update without image change...');
      }
    } else {
      console.log('ℹ️ No new file - keeping existing image');
      // If no file, don't include image in updateData to preserve existing image
      delete updateData.image;
    }

    console.log('Final update data:', updateData);
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      console.log('❌ Product not found for update:', req.params.id);
      return res.status(404).json({ error: 'Product not found' });
    }
    
    console.log('✅ Product updated successfully:', {
      id: product._id,
      name: product.name,
      hasImage: !!product.image,
      imageUrl: product.image
    });
    
    res.json(product);
  } catch (error) {
    console.error('❌ Product update failed:', error);
    res.status(400).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    console.log('=== DELETE PRODUCT DEBUG ===');
    console.log('Deleting product ID:', req.params.id);
    
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      console.log('❌ Product not found for deletion:', req.params.id);
      return res.status(404).json({ error: 'Product not found' });
    }
    
    console.log('✅ Product deleted successfully:', {
      id: product._id,
      name: product.name
    });
    
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