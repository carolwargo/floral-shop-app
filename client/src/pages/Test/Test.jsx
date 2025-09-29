// client/src/pages/Home.jsx - NO INLINE STYLES
import { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom';
import axios from 'axios';
import './Test.css';    
import HeaderTest from '../../components/Test/HeaderTest';
import NewsletterTest from '../../components/Test/NewsletterTest';
import BlogTest from '../../components/Test/BlogTest';
import FooterTest from '../../components/Test/FooterTest';
import Trending from '../../components/Trending/Trending';
import FeaturedTest from '../../components/Test/FeaturedTest';



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
 <div>
    <header className= "header">
<HeaderTest />
    </header>
  {/* end of header */}

  {/* trending product */}
<Trending />
  {/* end of trending product */}

    <div className= "underline"></div>

  {/* featured product */}
<FeaturedTest/>
  {/* end of featured product */}

  {/* blog */}
<BlogTest />
  {/* end of blog */}

  {/* newsletter */}
<NewsletterTest />
  {/* end of newsletter*/}

  {/* footer */}
<FooterTest />
 </div>
  
 );
}

export default Test;