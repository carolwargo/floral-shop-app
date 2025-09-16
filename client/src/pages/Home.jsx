import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Subscribe from '../components/Subscribe';

function Homepage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // Assuming an API endpoint for featured products; adjust as needed
        const res = await axios.get('http://localhost:5000/api/products?limit=3');
        setFeaturedProducts(res.data);
        setError(null);
      } catch (err) {
        setError('Failed to load featured products');
        console.error('Fetch featured products error:', err);
      }
    };
    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = (product) => {
    // Implement cart logic here
    alert(`${product.name} added to cart!`);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Welcome to Floral Shop</h1>
        <p style={styles.subtitle}>Discover the Beauty of Fresh Flowers</p>
        <Link to="/shop" style={styles.shopButton}>Shop Now</Link>
      </header>
      <section style={styles.adSection}>
        <h2 style={styles.adTitle}>Featured Bouquets</h2>
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.featuredGrid}>
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </section>
      <section>
        <Subscribe />
      </section>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#FFFFFF', // White
    color: '#000000', // Black
    minHeight: '100vh',
    padding: '0',
  },
  header: {
    backgroundColor: '#2E4A2E', // Dark Green
    color: '#FFFFFF', // White
    textAlign: 'center',
    padding: '60px 20px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
  },
  title: {
    fontSize: '3rem',
    margin: '0 0 20px',
    color: '#D4A017', // Gold
  },
  subtitle: {
    fontSize: '1.5rem',
    margin: '0 0 30px',
    color: '#D3D3D3', // Light Gray
  },
  shopButton: {
    display: 'inline-block',
    padding: '15px 30px',
    backgroundColor: '#D4A017', // Gold
    color: '#000000', // Black
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  adSection: {
    maxWidth: '1200px',
    margin: '40px auto',
    padding: '20px',
  },
  adTitle: {
    fontSize: '2rem',
    color: '#2E4A2E', // Dark Green
    textAlign: 'center',
    marginBottom: '30px',
  },
  error: {
    color: '#D4A017', // Gold
    textAlign: 'center',
    marginBottom: '20px',
  },
  featuredGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  },
};

export default Homepage;