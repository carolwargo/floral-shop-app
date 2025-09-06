import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

function Nav() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={{ padding: '10px', background: '#f0f0f0' }}>
      <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
      <Link to="/shop" style={{ marginRight: '10px' }}>Shop</Link>
      <Link to="/cart" style={{ marginRight: '10px' }}>Cart</Link>
      {user ? (
        <button onClick={logout}>Logout</button>
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