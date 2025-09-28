import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import './HomeHeader.css'; // Import Nav.css for header styles

function Header() {


  return (

    <div>
   
              {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-content">
          <h1 className="home-hero-title">Welcome to Floral Shop</h1>
          <p className="home-hero-subtitle">Discover the Beauty of Flowers- Expedita cumque sint eaque earum nulla voluptate animi molestiae quasi aut illum delectus. Praesentium!</p>
          <Link to="/shop" className="home-hero-button"> {/* ✅ Fixed: was "home-hero-cta" */}
            Explore Collection 
            <span><FontAwesomeIcon icon={faArrowRight} /></span>
          </Link>
        </div>
      </section>
      </div>
  );
}

export default Header;