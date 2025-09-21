import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import '../Shop.css';

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});
  const { addToCart } = useContext(AuthContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (error) {
        console.error('Fetch products error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId, quantity) => {
    if (!addToCart) {
      alert('Please log in to add items to cart');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    
    try {
      await addToCart(productId, quantity);
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="shop-loading-container">
        <div className="shop-loading-spinner"></div>
        <p className="shop-loading-text">Loading our floral collection...</p>
      </div>
    );
  }

  return (
    <div className="shop-container">
      <h2 className="shop-title">Our Floral Collection</h2>
      
      {products.length === 0 ? (
        <div className="shop-empty-state">
          <p className="shop-empty-message">No products available at the moment</p>
          <div className="shop-empty-flower">🌸</div>
        </div>
      ) : (
        <div className="shop-products-grid">
          {products.map((product) => {
            const isAdding = addingToCart[product._id];
            
            return (
              <div key={product._id} className="shop-product-card">
                <div className="shop-image-container">
                  <img 
                    src={product.image || 'https://placekitten.com/150/150'} 
                    alt={product.name || 'Product image'}
                    className="shop-product-image"
                    onError={(e) => {
                      e.target.src = 'https://placekitten.com/150/150';
                    }}
                  />
                  {product.stock === 0 && (
                    <div className="shop-out-of-stock-badge">Out of Stock</div>
                  )}
                </div>
                
                <div className="shop-product-info">
                  <h3 className="shop-product-name">{product.name}</h3>
                  
                  <p className="shop-product-price">
                    ${parseFloat(product.price || 0).toFixed(2)}
                  </p>
                  
                  {product.description && (
                    <p className="shop-product-description">
                      {product.description.length > 80 
                        ? `${product.description.substring(0, 80)}...` 
                        : product.description
                      }
                    </p>
                  )}
                  
                  <div className="shop-stock-info">
                    {product.stock > 0 ? (
                      <span className="shop-in-stock">
                        📦 In Stock: {product.stock}
                      </span>
                    ) : (
                      <span className="shop-out-of-stock">❌ Out of Stock</span>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => handleAddToCart(product._id, 1)}
                    disabled={isAdding || product.stock === 0 || !addToCart}
                    className={`shop-add-to-cart-button ${isAdding || product.stock === 0 || !addToCart ? 'disabled' : ''}`}
                  >
                    {isAdding ? (
                      <>
                        <div className="shop-button-spinner"></div>
                        Adding...
                      </>
                    ) : product.stock === 0 ? (
                      'Sold Out'
                    ) : !addToCart ? (
                      'Log In to Add'
                    ) : (
                      'Add to Cart'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Shop;