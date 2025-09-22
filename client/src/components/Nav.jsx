import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../Nav.css';

function Nav() {
  const { user, logout, cartItemsCount } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="nav-header" role="banner">
      {/* Logo & Hamburger */}
      <div className="nav-branding">
        <Link to="/" className="nav-logo" aria-label="Home">
          Floral Shop
        </Link>
        <button 
          className="nav-hamburger" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className={`nav-main ${isMenuOpen ? 'nav-main-open' : ''}`} role="navigation">
        <form onSubmit={handleSearch} className="nav-search-form" role="search">
          <label htmlFor="search-input" className="sr-only">
            Search products
          </label>
          <input
            id="search-input"
            type="search"
            placeholder="Search flowers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="nav-search-input"
            aria-label="Search products"
          />
          <button 
            type="submit" 
            className="nav-search-button"
            aria-label="Search"
          >
            ⌕
          </button>
        </form>

        <ul className="nav-links" role="list">
          <li>
            <Link 
              to="/shop" 
              className="nav-link" 
              onClick={closeMenu}
            >
              Shop
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              className="nav-link" 
              onClick={closeMenu}
            >
              Contact
            </Link>
          </li>
          <li className="nav-cart-item">
            <Link 
              to="/cart" 
              className="nav-link nav-cart-link" 
              onClick={closeMenu}
              aria-label={`View cart, ${cartItemsCount} items`}
            >
              <span className="nav-cart-icon" aria-hidden="true">🛒</span>
              {cartItemsCount > 0 && (
                <span className="nav-cart-badge" aria-label={`${cartItemsCount} items in cart`}>
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </li>
        </ul>

        {/* User Actions */}
        <div className="nav-user-actions" role="group" aria-label="User actions">
          {user ? (
            <>
              <span className="nav-user-name" aria-label={`Logged in as ${user.name}`}>
                {user.name}
              </span>
              {user.isAdmin && (
                <Link 
                  to="/admin" 
                  className="nav-link nav-admin-link" 
                  onClick={closeMenu}
                  aria-label="Admin dashboard"
                >
                  Admin
                </Link>
              )}
              <button 
                onClick={handleLogout} 
                className="nav-logout-button"
                aria-label="Sign out"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="nav-link nav-auth-link" 
                onClick={closeMenu}
                aria-label="Sign in"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="nav-auth-button" 
                onClick={closeMenu}
                aria-label="Create account"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Nav;