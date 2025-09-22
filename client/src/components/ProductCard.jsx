import { Link } from 'react-router-dom';
import '../ProductCard.css'; // Import the CSS file

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      {/* FIXED: Use PlaceKitten instead of broken placeholder */}
      <img
        src={product.image || 'https://placekitten.com/200/150'} 
        alt={product.name || 'Product image'}
        className="product-card-image"
        onError={(e) => {
          // Double fallback - if PlaceKitten fails too (unlikely)
          e.target.src = 'https://placekitten.com/200/150';
          console.log('Image fallback activated for:', product.name);
        }}
        onLoad={() => {
          // Optional: Log successful loads
          console.log('Image loaded:', product.name, product.image);
        }}
      />
      <h3 className="product-card-title">{product.name}</h3>
      <p className="product-card-price">
        ${parseFloat(product.price || 0).toFixed(2)}
      </p>
      <p className="product-card-description">
        {product.description || 'Beautiful floral arrangement'}
      </p>
      <div className="product-card-button-group">
        <button 
          onClick={() => onAddToCart(product)} 
          className={`product-card-add-button ${product.stock === 0 ? 'disabled' : ''}`}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
        </button>
        <Link to={`/product/${product._id}`} className="product-card-details-link">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;