import { Link } from 'react-router-dom';

function ProductCard({ product, onAddToCart }) {
  return (
    <div style={styles.card}>
      <img
        src={product.image || 'https://via.placeholder.com/200'}
        alt={product.name}
        style={styles.image}
      />
      <h3 style={styles.title}>{product.name}</h3>
      <p style={styles.price}>${product.price.toFixed(2)}</p>
      <p style={styles.description}>{product.description || 'No description available'}</p>
      <div style={styles.buttonGroup}>
        <button onClick={() => onAddToCart(product)} style={styles.addButton}>
          Add to Cart
        </button>
        <Link to={`/product/${product._id}`} style={styles.detailsLink}>
          View Details
        </Link>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#FFFFFF', // White
    border: '1px solid #4A4A4A', // Gray
    borderRadius: '10px',
    padding: '15px',
    width: '220px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    transition: 'transform 0.3s',
  },
  image: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  title: {
    fontSize: '1.2rem',
    color: '#000000', // Black
    margin: '10px 0',
  },
  price: {
    fontSize: '1.1rem',
    color: '#005c00ff', // Dark Green
    fontWeight: 'bold',
  },
  description: {
    fontSize: '0.9rem',
    color: '#4A4A4A', // Gray
    margin: '10px 0',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
  },
  addButton: {
    padding: '10px',
    backgroundColor: '#005c00ff', // Dark Green
    color: '#FFFFFF', // White
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  detailsLink: {
    padding: '10px',
    backgroundColor: '#D4A017', // Gold
    color: '#000000', // Black
    borderRadius: '5px',
    textDecoration: 'none',
    fontSize: '0.9rem',
  },
};

export default ProductCard;