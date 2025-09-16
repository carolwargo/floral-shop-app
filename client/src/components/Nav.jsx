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

  return (
    <nav className="nav">
      <Link to="/" className="logo">
        Floral Shop
      </Link>
      <button className="hamburger" onClick={toggleMenu}>
        {isMenuOpen ? '✕' : '☰'}
      </button>
      <div className={`links-container ${isMenuOpen ? 'open' : ''}`}>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search flowers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
        <div className="links">
          <Link to="/shop" className="link" onClick={() => setIsMenuOpen(false)}>
            Shop
          </Link>
          <Link to="/contact" className="link" onClick={() => setIsMenuOpen(false)}>
            Contact
          </Link>
          <Link to="/cart" className="link" onClick={() => setIsMenuOpen(false)}>
            Cart {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
          </Link>
          {user ? (
            <>
              <span className="user-name">{user.name}</span>
              {user.isAdmin && (
                <Link to="/admin" className="link" onClick={() => setIsMenuOpen(false)}>
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="link" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
              <Link to="/signup" className="link" onClick={() => setIsMenuOpen(false)}>
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Nav;