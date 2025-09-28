import { Link } from 'react-router-dom';
import './HomeHeader.css'; // Import Nav.css for header styles


function Header() {


  return (

    <div>
   
              {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-content">
          <h1 className="home-hero-title">Welcome to Floral Shop</h1>
          <p className="home-hero-subtitle">Discover the Beauty of Fresh Flowers</p>
          <Link to="/shop" className="home-hero-button"> {/* ✅ Fixed: was "home-hero-cta" */}
            Explore Collection
          </Link>
        </div>
      </section>
      </div>
  );
}

export default Header;