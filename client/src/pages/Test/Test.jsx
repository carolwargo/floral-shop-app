// client/src/pages/Home.jsx - NO INLINE STYLES
import { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom';
import axios from 'axios';
import Flower1 from '../../assets/images/Flower1.png';
import Flower2 from '../../assets/images/Flower2.png';
import Flower3 from '../../assets/images/Flower3.png';
import Flower4 from '../../assets/images/Flower4.png';




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
    <header className= "header">
      <div className= "head-top">
        <a href = "index.html" className= "brand-name">
          Sofa
          <span>House</span>
        </a>
        <div>
          <span className= "head-icon">
            <i className= "fas fa-search"></i>
          </span>
          <span className= "head-icon">
            <i className= "fas fa-bell"></i>
          </span>
          <span className= "head-icon">
            <i className= "fas fa-shopping-bag"></i>
          </span>
          <span className= "head-icon">
            <i className= "fas fa-user-circle"></i>
          </span>
        </div>
      </div>

      <div className= "head-body container">
        <div className= "head-body-content">
          <h1 className= "head-title">
            welcome to SofaHouse furniture
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

  {/* featured product */}
    <section className= "featured">
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
    </section>
  {/* end of featured product */}

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


 </main>
  
 );
}

export default Test;