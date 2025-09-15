import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
        setError(null);
      } catch (err) {
        setError('Failed to load product');
        console.error('Fetch product error:', err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    // Replace with actual cart logic
    alert(`${product.name} added to cart!`);
  };

  if (!product) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.card}>
        <img
          src={product.image || 'https://via.placeholder.com/400'}
          alt={product.name}
          style={styles.image}
        />
        <div style={styles.content}>
          <h2 style={styles.title}>{product.name}</h2>
          <p style={styles.price}>${product.price.toFixed(2)}</p>
          <p style={styles.description}>{product.description || 'No description available'}</p>
          <p style={styles.stock}>In Stock: {product.stock}</p>
          <div style={styles.buttonGroup}>
            <button onClick={handleAddToCart} style={styles.addButton}>
              Add to Cart
            </button>
            <button onClick={() => navigate('/shop')} style={styles.backButton}>
              Back to Shop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#FFFFFF', // White
    color: '#000000', // Black
    minHeight: 'calc(100vh - 70px)', // Adjust for Nav height
  },
  card: {
    display: 'flex',
    gap: '20px',
    backgroundColor: '#D3D3D3', // Light Gray
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    flexWrap: 'wrap',
  },
  image: {
    width: '100%',
    maxWidth: '400px',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  title: {
    fontSize: '1.8rem',
    color: '#2E4A2E', // Dark Green
    margin: '0',
  },
  price: {
    fontSize: '1.5rem',
    color: '#000000', // Black
    fontWeight: 'bold',
  },
  description: {
    fontSize: '1rem',
    color: '#4A4A4A', // Gray
  },
  stock: {
    fontSize: '1rem',
    color: '#4A4A4A', // Gray
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  addButton: {
    padding: '12px 20px',
    backgroundColor: '#2E4A2E', // Dark Green
    color: '#FFFFFF', // White
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
  },
  backButton: {
    padding: '12px 20px',
    backgroundColor: '#4A4A4A', // Gray
    color: '#FFFFFF', // White
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
  },
  error: {
    color: '#D4A017', // Gold
    textAlign: 'center',
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#4A4A4A', // Gray
    padding: '50px',
  },
};

export default ProductDetail;