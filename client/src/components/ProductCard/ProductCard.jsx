// components/ProductCard/ProductCard.jsx
import { Link } from 'react-router-dom';
import './ProductCard.css'; // Import the CSS file

function ProductCard({ product, onAddToCart }) {
  const isOutOfStock = product.stock === 0;

  return (
    <div className="product-card">
      {/* Image Container - required for proper styling */}
      <div className="product-image-container">
        <img
          src={product.image || 'https://placekitten.com/300/240'} 
          alt={product.name || 'Product image'}
          className="product-image" // ✅ Now matches CSS
          onError={(e) => {
            e.target.src = 'https://placekitten.com/300/240';
            console.log('Image fallback activated for:', product.name);
          }}
          onLoad={() => {
            console.log('Image loaded:', product.name, product.image);
          }}
        />
        {/* Out of stock badge - uses your CSS */}
        {isOutOfStock && (
          <span className="product-out-of-stock">Out of Stock</span>
        )}
      </div>

      {/* Content Container - required for proper flex layout */}
      <div className="product-content">
        <h3 className="product-title">{product.name}</h3> {/* ✅ Matches CSS */}
        <p className="product-price">
          ${parseFloat(product.price || 0).toFixed(2)}
        </p> {/* ✅ Matches CSS */}
        <p className="product-description">
          {product.description || 'Beautiful floral arrangement'}
        </p> 
        <div className="product-actions">
          <button 
            onClick={() => onAddToCart(product)} 
            className={`product-button product-button-primary ${isOutOfStock ? 'disabled' : ''}`} 
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
          </button>
          <Link 
            to={`/product/${product._id}`} 
            className="product-button product-button-secondary" 
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;