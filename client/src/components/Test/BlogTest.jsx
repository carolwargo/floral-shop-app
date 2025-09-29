// client/src/pages/Home.jsx - NO INLINE STYLES
import { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom';
import axios from 'axios';
import Flower1 from '../../assets/images/Flower1.png';
import Flower2 from '../../assets/images/Flower2.png';
import Flower3 from '../../assets/images/Flower3.png';
import '../../pages/Test/Test.css';    



function BlogTest() {
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

  {/* blog */}
    <section className= "blog">
      <div className= "container">
        <div className= "title">
          <h4>daily update</h4>
          <h2>latest blog</h2>
        </div>

        <div className= "blog-grid">
        {/* item */}
          <div className= "blog-item">
            <div className= "blog-item-img">
              <img src = {Flower1} alt = "blog image"/>
            </div>
            <div className= "blog-item-content">
              <a href = "#">creative ideas for decoration</a>
              <div>
                <span>january 20 | design | furniture</span>
              </div>
            </div>
          </div>
        {/* end of item */}
        {/* item */}
          <div className= "blog-item">
            <div className= "blog-item-img">
              <img src ={Flower2}alt = "blog image"/>
            </div>
            <div className= "blog-item-content">
              <a href = "#">decorate your home with the most modern furnishings.</a>
              <div>
                <span>january 25 | design | furniture</span>
              </div>
            </div>
          </div>
        {/* end of item */}
        {/* item */}
          <div className= "blog-item">
            <div className= "blog-item-img">
              <img src = {Flower3} alt = "blog image"/>
            </div>
            <div className= "blog-item-content">
              <a href = "#">furniture designs & contemporary art</a>
              <div>
                <span>january 28 | design | furniture</span>
              </div>
            </div>
          </div>
        {/* end of item */}
        </div>
      </div>
    </section>
  {/* end of blog */}
 </div>
  
 );
}

export default BlogTest;