// client/src/pages/Home.jsx - NO INLINE STYLES
import { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom';
import axios from 'axios';
import Flower1 from '../../assets/images/Flower1.png';
import Flower2 from '../../assets/images/Flower2.png';
import Flower3 from '../../assets/images/Flower3.png';
import Flower4 from '../../assets/images/Flower4.png';
import '../../pages/Test/Test.css';    



function TrendingTest() {
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
  {/* trending product */}
    <section className= "trend">
      <div className= "container">
        <div className= "title">
          <h4>trending now</h4>
          <h2>best selling product</h2>
        </div>

        <div className= "trend-grid">
        {/* item */}
          <div className= "trend-item">
            <img src = {Flower2} alt = "best product"/>
            <div className= "trend-item-content">
              <h4>Brown Sofa With Pillows</h4>
              <h4>$60.00</h4>
              <div className= "stars">
                <span><i className= "fas fa-star"></i></span>
                <span><i className= "fas fa-star"></i></span>
                <span><i className= "fas fa-star"></i></span>
                <span><i className= "fas fa-star"></i></span>
                <span><i className= "far fa-star"></i></span>
              </div>
              <span className= "chevron-icon">
                <i className= "fas fa-chevron-right"></i>
              </span>
            </div>
          </div>
        {/* end of item */}
        {/* item */}
          <div className= "trend-item">
            <img src = {Flower3} alt = "best product"/>
            <div className= "trend-item-content">
              <h4>Comfortable Pink Sofa</h4>
              <h4>$80.00</h4>
              <div className= "stars">
                <span><i className= "fas fa-star"></i></span>
                <span><i className= "fas fa-star"></i></span>
                <span><i className= "fas fa-star"></i></span>
                <span><i className= "fas fa-star"></i></span>
                <span><i className= "far fa-star"></i></span>
              </div>
              <span className= "chevron-icon">
                <i className= "fas fa-chevron-right"></i>
              </span>
            </div>
          </div>
        {/* end of item */}
        {/* item */}
          <div className= "trend-item">
            <img src = {Flower4} alt = "best product"/>
            <div className= "trend-item-content">
              <h4>Stylish Red Chair</h4>
              <h4>$30.00</h4>
              <div className= "stars">
                <span><i className= "fas fa-star"></i></span>
                <span><i className= "fas fa-star"></i></span>
                <span><i className= "fas fa-star"></i></span>
                <span><i className= "fas fa-star"></i></span>
                <span><i className= "far fa-star"></i></span>
              </div>
              <span className= "chevron-icon">
                <i className= "fas fa-chevron-right"></i>
              </span>
            </div>
          </div>
        {/* end of item */}
        </div>
      </div>
    </section>
  {/* end of trending product */}

    <div className= "underline"></div>

 </div>
  
 );
}

export default TrendingTest;