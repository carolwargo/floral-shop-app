import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const { login, error } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/'); // Redirect to Home
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="login-container">
      <h2>Login to get started!</h2>
      {error && <p className="login-error">{error}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        
        {/* Email field */}

        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          required
          autoComplete="username"
        />

        {/* Password field */}

        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
          autoComplete="current-password"
        />

        <div>
     
                  <div className='login-forgot-password'>
      <Link to="/forgot-password">Forgot password?</Link>
    </div>
        </div>


        <button type="submit" className="login-button">
          Login
        </button>
      </form>

      <div className="login-signup-link">
        <p>Not a member? <Link to="/signup">Signup</Link></p>
      </div>
    </div>
  );
}

export default Login;
