import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../ProductCard/ProductCard';

function Search() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query') || '';

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/products?search=${encodeURIComponent(query)}`);
        setProducts(res.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch search results');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [query]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Search Results for "{query}"</h2>
      {loading && <p style={styles.loading}>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {products.length === 0 && !loading && !error && (
        <p style={styles.noResults}>No products found for "{query}"</p>
      )}
      <div style={styles.productGrid}>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      <Link to="/shop" style={styles.backLink}>Back to Shop</Link>
    </div>
  );
}

const styles = {
  container: {
    maxHeight: '100vh', 
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '2rem',
    color: '#2E4A2E',
    textAlign: 'center',
    marginBottom: '20px',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#4A4A4A',
  },
  error: {
    textAlign: 'center',
    color: '#D4A017',
    fontSize: '1.2rem',
  },
  noResults: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#4A4A4A',
  },
  backLink: {
    display: 'block',
    textAlign: 'center',
    marginTop: '20px',
    color: '#2E4A2E',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
};

export default Search;