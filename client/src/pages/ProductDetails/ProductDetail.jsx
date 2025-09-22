//client/src/pages/ProductDetail.jsx  
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError('Failed to load product');
        console.error('Fetch product error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    // Replace with actual cart logic
    try {
      // You can integrate with your AuthContext addToCart here
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  if (loading) {
    return <div className="product-detail-loading">Loading...</div>;
  }

  if (error || !product) {
    return (
      <div className="product-detail-container">
        <div className="product-detail-error">
          <p>{error || 'Product not found'}</p>
          <button 
            onClick={() => navigate('/shop')} 
            className="product-detail-back-button"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-card">
        {/* Fixed Image with Fallback */}
        <img
          src={product.image || 'https://placekitten.com/400/300'} 
          alt={product.name || 'Product image'}
          className="product-detail-image"
          onError={(e) => {
            e.target.src = 'https://placekitten.com/400/300';
          }}
        />
        
        <div className="product-detail-content">
          <h2 className="product-detail-title">{product.name}</h2>
          <p className="product-detail-price">${product.price.toFixed(2)}</p>
          <p className="product-detail-description">
            {product.description || 'No description available'}
          </p>
          <p className="product-detail-stock">In Stock: {product.stock}</p>
          
          <div className="product-detail-button-group">
            <button 
              onClick={handleAddToCart} 
              className="product-detail-add-button"
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button 
              onClick={() => navigate('/shop')} 
              className="product-detail-back-button"
            >
              Back to Shop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;