import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faSearch, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import "./Nav.css";

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const closeMenu = () => setIsMenuOpen(false);

  // Prevent body scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
  }, [isMenuOpen]);

  return (
    <header className="nav-header">
      <div className="nav-branding">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          Floral Shop
        </Link>

        {/* Hamburger / Close Button */}
        <button
          className="nav-hamburger"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
        >
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
        </button>
      </div>

      {/* Navigation */}
      <nav className={`nav-main ${isMenuOpen ? "open" : ""}`}>
        
        {/* Search */}
        <form className="nav-search-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="search"
            className="nav-search-input"
            placeholder="Search flowers..."
            aria-label="Search flowers"
          />
          <button type="submit" className="nav-search-button">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>

        {/* Links */}
        <ul className="nav-links">
          <li>
            <Link to="/shop" className="nav-link" onClick={closeMenu}>
              Shop
            </Link>
          </li>
          <li>
            <Link to="/about" className="nav-link" onClick={closeMenu}>
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className="nav-link" onClick={closeMenu}>
              Contact
            </Link>
          </li>
          <li>
            <Link to="/cart" className="nav-link nav-cart-link" onClick={closeMenu}>
              <FontAwesomeIcon icon={faShoppingCart} className="nav-cart-icon" />
              <span className="nav-cart-badge">0</span>
            </Link>
          </li>
        </ul>

        {/* User actions */}
        <div className="nav-user-actions">
          <span className="nav-user-name">Guest</span>
          <Link to="/login" className="nav-auth-link nav-auth-button" onClick={closeMenu}>
            Sign In
          </Link>
          <button className="nav-logout-button" onClick={closeMenu}>
            Log Out
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Nav;
