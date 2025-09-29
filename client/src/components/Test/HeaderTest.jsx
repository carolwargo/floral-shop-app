// client/src/pages/Home.jsx - NO INLINE STYLES
import { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom';
import axios from 'axios';
import Flower1 from '../../assets/images/Flower1.png';
import '../../pages/Test/Test.css';        



function HeaderTest() {
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
      <div className= "head-body container">
        <div className= "head-body-content">
          <h1 className= "head-title">
            welcome to Floral Shop
          </h1>
          <p className= "text">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam nam repudiandae aliquam ullam nulla sunt voluptate dolorem cumque sed corporis, debitis iste odit necessitatibus repellat!
          </p>
          <button type = "button" className= "btn">
            shop now
          </button>
        </div>

        <div className= "head-body-img">
          <img src = {Flower1} alt = "header image"/>
        </div>
      </div>
    </header>
  {/* end of header */}
 </div>
  
 );
}

export default HeaderTest;