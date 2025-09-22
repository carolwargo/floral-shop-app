// client/src/pages/Home.jsx - NO INLINE STYLES
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard/ProductCard';



function Test() {
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
 <main className="home-main">
 {/* Hero Section */}
 <section className="home-hero">
 <div className="home-hero-content">
 <h1 className="home-hero-title">Welcome to Floral Shop</h1>
 <p className="home-hero-subtitle">Discover the Beauty of Fresh Flowers</p>
 <Link to="/shop" className="home-hero-cta">
 Explore Collection
 </Link>
 </div>
 <div className="home-hero-visual">
 <div className="home-hero-placeholder">
 <span className="home-hero-flower">🌸</span>
 </div>
 </div>
 </section>

 {/* Featured Products */}
 <section className="home-featured">
 <div className="home-section-wrapper">
 <header className="home-section-header">
 <h2 className="home-section-title">Featured Bouquets</h2>
 <Link to="/shop" className="home-section-more">
 View All →
 </Link>
 </header>
 
 {error ? (
 <div className="home-error-state">
 <p className="home-error-text">{error}</p>
 <button 
 onClick={() => window.location.reload()} 
 className="home-error-retry"
 >
 Try Again
 </button>
 </div>
 ) : featuredProducts.length === 0 ? (
 <div className="home-empty-featured">
 <p className="home-empty-text">No featured products yet</p>
 </div>
 ) : (
 <div className="home-featured-grid">
 {featuredProducts.map((product) => (
 <ProductCard 
 key={product._id} 
 product={product} 
 onAddToCart={handleAddToCart} 
 />
 ))}
 </div>
 )}
 </div>
 </section>


 </main>
 );
}

export default Test;