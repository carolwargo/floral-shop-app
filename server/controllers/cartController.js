// server/controllers/cartController.js
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get user's cart
const getCart = async (req, res) => {
  try {
    console.log('Cart request user:', req.user);
    
    // Find or create cart for user
    let cart = await Cart.findOne({ userId: req.user._id })
      .populate('items.productId', 'name price image description stock');
    
    if (!cart) {
      cart = new Cart({ 
        userId: req.user._id, 
        items: []
      });
      await cart.save();
    }
    
    // Calculate totals for response (since model doesn't store them)
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + (item.productId?.price * item.quantity || 0);
    }, 0);
    
    const totalItems = cart.items.reduce((sum, item) => {
      return sum + (item.quantity || 0);
    }, 0);
    
    res.json({
      ...cart.toObject(),
      subtotal,
      totalItems
    });
  } catch (error) {
    console.error('Cart fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ error: 'Valid product ID and quantity required' });
    }
    
    // Check if product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({ 
        error: `Insufficient stock. Only ${product.stock} available` 
      });
    }
    
    // Find existing cart
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ 
        userId: req.user._id, 
        items: []
      });
      await cart.save();
    }
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId && item.productId.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      // Update existing item quantity
      const existingItem = cart.items[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;
      
      if (newQuantity > product.stock) {
        return res.status(400).json({ 
          error: `Cannot exceed available stock. Max: ${product.stock}` 
        });
      }
      
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        quantity
      });
    }
    
    await cart.save();
    
    // Populate product details for response
    await cart.populate('items.productId', 'name price image description stock');
    
    // Calculate totals for response
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + (item.productId?.price * item.quantity || 0);
    }, 0);
    
    const totalItems = cart.items.reduce((sum, item) => {
      return sum + (item.quantity || 0);
    }, 0);
    
    res.status(201).json({
      message: 'Item added to cart',
      cart: {
        ...cart.toObject(),
        subtotal,
        totalItems
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1) {
      // If quantity is 0 or less, delete the item
      return deleteCartItem(req, res);
    }
    
    // Find the cart and the specific item
    const cart = await Cart.findOne({ 
      userId: req.user._id, 
      'items._id': itemId 
    });
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    // Find the specific item in the cart
    const cartItem = cart.items.id(itemId);
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    // Get product to check stock
    const product = await Product.findById(cartItem.productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (quantity > product.stock) {
      return res.status(400).json({ 
        error: `Insufficient stock. Only ${product.stock} available` 
      });
    }
    
    // Update quantity
    cartItem.quantity = quantity;
    await cart.save();
    
    // Populate product details
    await cart.populate('items.productId', 'name price image description stock');
    
    // Calculate totals for response
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + (item.productId?.price * item.quantity || 0);
    }, 0);
    
    const totalItems = cart.items.reduce((sum, item) => {
      return sum + (item.quantity || 0);
    }, 0);
    
    res.json({
      message: 'Cart item updated',
      cart: {
        ...cart.toObject(),
        subtotal,
        totalItems
      }
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};

// Delete cart item
const deleteCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const cart = await Cart.findOneAndUpdate(
      { 
        userId: req.user._id, 
        'items._id': itemId 
      },
      { $pull: { items: { _id: itemId } } },
      { new: true }
    );
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    // Populate product details for remaining items
    await cart.populate('items.productId', 'name price image description stock');
    
    // Calculate totals for response
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + (item.productId?.price * item.quantity || 0);
    }, 0);
    
    const totalItems = cart.items.reduce((sum, item) => {
      return sum + (item.quantity || 0);
    }, 0);
    
    res.json({
      message: 'Item removed from cart',
      cart: {
        ...cart.toObject(),
        subtotal,
        totalItems
      }
    });
  } catch (error) {
    console.error('Delete cart item error:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items: [] },
      { new: true }
    );
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    res.json({
      message: 'Cart cleared successfully',
      cart: {
        ...cart.toObject(),
        subtotal: 0,
        totalItems: 0
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart
};