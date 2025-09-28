import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faSearch, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";
import "./Nav.css";

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, cartItemsCount } = useContext(AuthContext);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
  }, [isMenuOpen]);

  return (
    <header className="nav-header" role="banner">
      {/* Branding */}
      <div className="nav-branding">
        <Link to="/" className="nav-logo" aria-label="Floral Shop Home" onClick={closeMenu}>
          Floral Shop
        </Link>
      </div>

      {/* Hamburger */}
      <button
        className="nav-hamburger"
        onClick={toggleMenu}
        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isMenuOpen}
        type="button"
      >
        <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} aria-hidden="true" />
      </button>

      {/* Navigation */}
      <nav className={`nav-main ${isMenuOpen ? "open" : ""}`} role="navigation" aria-label="Main navigation">
        {/* Close button (mobile only) */}
        <button className="nav-close-btn" onClick={closeMenu} aria-label="Close navigation menu">
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {/* Search */}
        <form className="nav-search-form" onSubmit={e => e.preventDefault()}>
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
          <li><Link to="/" className="nav-brand-link" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/shop" className="nav-link" onClick={closeMenu}>Shop</Link></li>
          <li><Link to="/about" className="nav-link" onClick={closeMenu}>About</Link></li>
          <li><Link to="/contact" className="nav-link" onClick={closeMenu}>Contact</Link></li>

          {/* ✅ Only show Admin Dashboard if user is admin */}
          {user?.isAdmin && (
            <li><Link to="/admin" className="nav-admin-link" onClick={closeMenu}>Admin</Link></li>
          )}

          {/* Cart visible only if logged in */}
          {user && (
            <li>
              <Link to="/cart" className="nav-link nav-cart-link" onClick={closeMenu}>
                <FontAwesomeIcon icon={faShoppingCart} className="nav-cart-icon" />
                <span className="nav-cart-badge">{cartItemsCount || 0}</span>
              </Link>
            </li>
          )}
        </ul>

        {/* User actions */}
        <div className="nav-user-actions">
          <span className="nav-user-name">{user ? user.name : ""}</span>

          {!user ? (
            <Link to="/login" className="nav-auth-link nav-auth-button" onClick={closeMenu}>
              Sign In
            </Link>
          ) : (
            <button
              className="nav-logout-button"
              onClick={() => {
                logout();
                closeMenu();
              }}
            >
              Log Out
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Nav;



