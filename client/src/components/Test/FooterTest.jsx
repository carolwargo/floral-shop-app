// client/src/pages/Home.jsx - NO INLINE STYLES
import { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom';
import axios from 'axios';
import Flower1 from '../../assets/images/Flower1.png';
import Flower2 from '../../assets/images/Flower2.png';
import Flower3 from '../../assets/images/Flower3.png';
import Flower4 from '../../assets/images/Flower4.png';
import '../../pages/Test/Test.css';       



function FooterTest() {
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
  {/* footer */}
    <footer className= "footer container">
      <div className= "footer-item">
        <h2 className= "brand-name">
          Sofa <span>House</span>
        </h2>
        <p>social media accounts</p>
        <ul className= "footer-icons">
          <li>
            <a href = "#"><i className= "fab fa-facebook-f"></i></a>
          </li>
          <li>
            <a href = "#"><i className= "fab fa-twitter"></i></a>
          </li>
          <li>
            <a href = "#"><i className= "fab fa-instagram"></i></a>
          </li>
          <li>
            <a href = "#"><i className= "fab fa-linkedin"></i></a>
          </li>
          <li>
            <a href = "#"><i className= "fab fa-google-plus-g"></i></a>
          </li>
        </ul>
      </div>

      <div className= "footer-item">
        <h3>links</h3>
        <ul>
          <li><a href = "#">home</a></li>
          <li><a href = "#">download</a></li>
          <li><a href = "#">pricing</a></li>
          <li><a href = "#">about</a></li>
        </ul>
      </div>

      <div className= "footer-item">
        <h3>products</h3>
        <ul>
          <li><a href = "#">chair</a></li>
          <li><a href = "#">sofa</a></li>
          <li><a href = "#">pillow</a></li>
          <li><a href = "#">cushion</a></li>
        </ul>
      </div>

      <div className= "footer-item">
        <h3>support</h3>
        <ul>
          <li><a href = "#">FAQ</a></li>
          <li><a href = "#">how it works</a></li>
          <li><a href = "#">features</a></li>
          <li><a href = "#">contact</a></li>
        </ul>
      </div>
    </footer>
 </div>
  
 );
}

export default FooterTest;