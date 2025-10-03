// client/src/pages/Home.jsx 
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../components/ProductCard/ProductCard';
import Subscribe from '../../components/Subscribe/Subscribe';
//import './Home.css'; // ← ADD THIS IMPORT
import HeaderTest from '../../components/Test/HeaderTest';

function Homepage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get('http://localhost:5000/api/products?limit=3');
        setFeaturedProducts(res.data);
      } catch (err) {
        setError('Failed to load featured products');
        console.error('Fetch featured products error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = (product) => {
    alert(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="home-loading-container">
        <div className="home-loading-spinner"></div>
        <p className="home-loading-text">Discovering beautiful arrangements...</p>
      </div>
    );
  }

  return (
 <div>
    <header className= "header">
<HeaderTest />
    </header>
  {/* end of header */}
      {/* Featured Products */}
            <div className = "container">
        <div className = "title">
         <h4>trending now</h4>
          <h2>best selling product</h2>
        </div>
     
 <section className="home-section-container"> {/* ✅ Fixed: was "home-section-wrapper" */}
          <header className="home-section-header">
            <h2 className="home-section-title">Featured Bouquets</h2>
            
            <Link to="/shop" className="home-section-view-all"> {/* ✅ Fixed: was "home-section-more" */}
              View All →
            </Link>
          </header>
          
          {error ? (
            <div className="home-error"> {/* ✅ Fixed: was "home-error-state" */}
              <p className="home-error-message">{error}</p> {/* ✅ Fixed: was "home-error-text" */}
              <button 
                onClick={() => window.location.reload()} 
                className="home-error-button" 
              >
                Try Again
              </button>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="home-empty"> {/* ✅ Fixed: was "home-empty-featured" */}
              <p className="home-empty-message">No featured products yet</p> {/* ✅ Fixed: was "home-empty-text" */}
            </div>
          ) : (
  <div className="product-grid">
  {featuredProducts.map((product) => (
    <ProductCard 
      key={product._id} 
      product={product} 
      onAddToCart={handleAddToCart} 
    />
              ))}
            </div>
          )}
        </section>
     
   </div>
      {/* Newsletter */}
      <section className="home-newsletter-section"> {/* ✅ Fixed: was "home-newsletter" */}
        <Subscribe />
      </section>

    </div>
  );
}

export default Homepage;