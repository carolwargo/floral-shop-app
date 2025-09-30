// client/src/pages/Home.jsx - NO INLINE STYLES
import { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom';
import axios from 'axios';
import Flower1 from '../../assets/images/Flower1.png';
import Flower2 from '../../assets/images/Flower2.png';
import Flower3 from '../../assets/images/Flower3.png';
import Flower4 from '../../assets/images/Flower4.png';
import '../../pages/Test/Test.css';        



function FeaturedTest() {
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
  {/* featured product */}
    <div className= "featured">
      <div className= "container">
      {/* item */}
        <div className= "featured-item">
          <div className= "featured-item-img">
            <img src = {Flower1} alt = "feature image"/>
          </div>
          <div className= "featured-item-content">
            <div className= "title">
              <h4>featured product </h4>
              <h2>red sofa with pillows</h2>
              <p className= "item-price">$55.00</p>
            </div>
            <p className= "text">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem quasi consequatur veniam, veritatis necessitatibus rem voluptas pariatur doloremque id culpa, eveniet, ratione libero eos fuga.
            </p>
            <div className= "featured-btns">
              <button type = "button" className= "btn">Explore</button>
              <button type = "button" className= "btn">Purchase</button>
            </div>
          </div>
        </div>
      {/* end of item */}
      {/* item */}
        <div className= "featured-item">
          <div className= "featured-item-img">
            <img src = {Flower2} alt = "feature image"/>
          </div>
          <div className= "featured-item-content">
            <div className= "title">
              <h4>featured product </h4>
              <h2>single comfort sofa chair</h2>
              <p className= "item-price">$42.00</p>
            </div>
            <p className= "text">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem quasi consequatur veniam, veritatis necessitatibus rem voluptas pariatur doloremque id culpa, eveniet, ratione libero eos fuga.
            </p>
            <div className= "featured-btns">
              <button type = "button" className= "btn">Explore</button>
              <button type = "button" className= "btn">Purchase</button>
            </div>
          </div>
        </div>
      {/* end of item */}


      
      {/* item */}
        <div className= "featured-item">
          <div className= "featured-item-img">
            <img src = {Flower3} alt = "feature image"/>
          </div>
          <div className= "featured-item-content">
            <div className= "title">
              <h4>featured product </h4>
              <h2>warm brown sofa</h2>
              <p className= "item-price">$78.00</p>
            </div>
            <p className= "text">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem quasi consequatur veniam, veritatis necessitatibus rem voluptas pariatur doloremque id culpa, eveniet, ratione libero eos fuga.
            </p>
            <div className= "featured-btns">
              <button type = "button" className= "btn">Explore</button>
              <button type = "button" className= "btn">Purchase</button>
            </div>
          </div>
        </div>
      {/* end of item */}
      {/* item */}
        <div className= "featured-item">
          <div className= "featured-item-img">
            <img src = {Flower4} alt = "feature image"/>
          </div>
          <div className= "featured-item-content">
            <div className= "title">
              <h4>featured product </h4>
              <h2>wide comfortable sofa</h2>
              <p className= "item-price">$90.55</p>
            </div>
            <p className= "text">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem quasi consequatur veniam, veritatis necessitatibus rem voluptas pariatur doloremque id culpa, eveniet, ratione libero eos fuga.
            </p>
            <div className= "featured-btns">
              <button type = "button" className= "btn">Explore</button>
              <button type = "button" className= "btn">Purchase</button>
            </div>
          </div>
        </div>
      {/* end of item */}
      </div>
    </div>
  {/* end of featured product */}
 </div>
  
 );
}

export default FeaturedTest;