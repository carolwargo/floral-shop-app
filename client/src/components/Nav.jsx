import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Nav() {
  const { user, logout, cartItemsCount } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        Floral Shop
      </Link>
      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input
          type="text"
          placeholder="Search flowers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
        <button type="submit" style={styles.searchButton}>
          Search
        </button>
      </form>
      <div style={styles.links}>
        <Link to="/shop" style={styles.link}>
          Shop
        </Link>
        <Link to="/contact" style={styles.link}>
          Contact
        </Link>
        <Link to="/cart" style={styles.link}>
          Cart {cartItemsCount > 0 && <span style={styles.cartBadge}>{cartItemsCount}</span>}
        </Link>
        {user ? (
          <>
            <span style={styles.userName}>{user.name}</span>
            {user.isAdmin && (
              <Link to="/admin" style={styles.link}>
                Admin
              </Link>
            )}
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>
              Login
            </Link>
            <Link to="/signup" style={styles.link}>
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: '#000000', // Black
    color: '#FFFFFF', // White
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#D4A017', // Gold
    textDecoration: 'none',
  },
  searchForm: {
    display: 'flex',
    gap: '10px',
    flex: 1,
    maxWidth: '400px',
    margin: '0 20px',
  },
  searchInput: {
    padding: '8px',
    border: '1px solid #4A4A4A', // Gray
    borderRadius: '5px',
    backgroundColor: '#FFFFFF', // White
    color: '#000000', // Black
    fontSize: '1rem',
    width: '100%',
  },
  searchButton: {
    padding: '8px 15px',
    backgroundColor: '#2E4A2E', // Dark Green
    color: '#FFFFFF', // White
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  links: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  link: {
    color: '#D3D3D3', // Light Gray
    textDecoration: 'none',
    fontSize: '1rem',
  },
  userName: {
    color: '#D4A017', // Gold
    fontSize: '1rem',
  },
  logoutButton: {
    padding: '8px 15px',
    backgroundColor: '#4A4A4A', // Gray
    color: '#FFFFFF', // White
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  cartBadge: {
    backgroundColor: '#D4A017', // Gold
    color: '#000000', // Black
    borderRadius: '50%',
    padding: '2px 8px',
    fontSize: '0.8rem',
    marginLeft: '5px',
  },
};

export default Nav;