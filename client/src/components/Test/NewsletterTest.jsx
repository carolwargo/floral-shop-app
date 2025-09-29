// client/src/pages/Home.jsx - NO INLINE STYLES
import { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../pages/Test/Test.css';       



function NewsletterTest() {
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
  {/* newsletter */}
    <section className= "newsletter">
      <div className= "container">
        <div className= "newsletter-content">
          <div className= "title">
            <h4>subscribe to our newsletter</h4>
            <h2>Newsletter</h2>
          </div>
          
          <form>
            <div className= "form-group">
              <input type = "email" className= "form-control" placeholder="Enter your email address"/>
              <button type = "submit" className= "subscribe-btn">
                subscribe
                <i className= "fas fa-chevron-right"></i>
              </button>
            </div>
          </form>

          <div className= "circle-box circle-1"></div>
          <div className= "circle-box circle-2"></div>
        </div>
      </div>
    </section>
  {/* end of newsletter*/}

 </div>
  
 );
}

export default NewsletterTest;