import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

function Nav() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ padding: '10px', background: '#f0f0f0' }}>
      <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
      <Link to="/shop" style={{ marginRight: '10px' }}>Shop</Link>
      <Link to="/cart" style={{ marginRight: '10px' }}>Cart</Link>
      {user && user.isAdmin && (
        <Link to="/admin" style={{ marginRight: '10px' }}>Admin Dashboard</Link>
      )}
      {user ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <>
          <Link to="/signup" style={{ marginRight: '10px' }}>Signup</Link>
          <Link to="/login">Login</Link>
        </>
      )}
    </nav>
  );
}

export default Nav;