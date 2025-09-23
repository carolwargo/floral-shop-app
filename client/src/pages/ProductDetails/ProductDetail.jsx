//client/src/pages/ProductDetail/ProductDetail.jsx  
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
    try {
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="product-detail-loading">
          <div className="product-detail-loading-spinner"></div>
          <p className="product-detail-loading-text">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-container">
        <div className="product-detail-error-container">
          <div className="product-detail-error">
            <p>{error || 'Product not found'}</p>
            <button 
              onClick={() => navigate('/shop')} 
              className="product-detail-back-button"
            >
         Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-card">
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
      <p className="product-detail-description">
            {product.description || 'No description available'}
          </p>
          <p className="product-detail-stock">In Stock: {product.stock}</p>
                               <p className="product-detail-price">${product.price.toFixed(2)}</p>
           
          <div className="product-detail-button-group">
           

       
    
          </div>
           <button 
              onClick={handleAddToCart} 
              className="product-detail-back-button"
              disabled={product.stock === 0}
            >
              <span className="button-content">
                <span className="button-text">
                  {product.stock === 0 ? 'Out of Stock' : 'Buy Now'}
                </span>
              </span>
            </button>
                       
<a className='product-detail-back-link'
              onClick={() => navigate('/shop')} 
            >
              <i></i>
             Continue Shopping
            </a>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;