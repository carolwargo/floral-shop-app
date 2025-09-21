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
    console.log('Creating product with data:', req.body);
    console.log('File received:', req.file ? `Yes, ${req.file.originalname}` : 'No file');
    
    const { name, price, description, stock } = req.body;
    
    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const productData = {
      name,
      price: parseFloat(price),
      description: description || '',
      stock: parseInt(stock) || 0,
    };

    // Handle image upload if file is provided
    if (req.file) {
      try {
        console.log('Uploading file to Cloudinary:', req.file.originalname);
        const imageUrl = await uploadToCloudinary(req.file.buffer);
        console.log('Cloudinary upload successful:', imageUrl);
        productData.image = imageUrl;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ error: 'Failed to upload image' });
      }
    } else {
      console.log('No file uploaded, skipping image');
    }

    const product = new Product(productData);
    await product.save();
    console.log('Product saved successfully:', product._id);
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Product create error:', error);
    res.status(400).json({ error: error.message });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    console.log('Updating product with data:', req.body);
    console.log('File received:', req.file ? `Yes, ${req.file.originalname}` : 'No file');
    
    const { name, price, description, stock } = req.body;
    
    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const updateData = {
      name,
      price: parseFloat(price),
      description: description || '',
      stock: parseInt(stock) || 0,
    };

    // Handle image update if new file is uploaded
    if (req.file) {
      try {
        console.log('Uploading new file to Cloudinary:', req.file.originalname);
        const imageUrl = await uploadToCloudinary(req.file.buffer);
        console.log('Cloudinary upload successful:', imageUrl);
        updateData.image = imageUrl;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ error: 'Failed to upload image' });
      }
    } else {
      console.log('No new file, keeping existing image');
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    console.log('Product updated successfully:', product._id);
    res.json(product);
  } catch (error) {
    console.error('Product update error:', error);
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
    console.log('Product deleted successfully:', product._id);
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