import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import './Signup.css';  


function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, name);
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
      
                <input
          type="name"
          placeholder="Name"
          className="signup-input"
          id='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete='name'
        />
        <input
          type="email"
          placeholder="Email"
          className="signup-input"
          id='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete='email'
        />
        <input
          type="password"
          placeholder="Password"
          className="signup-input"
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete='password'
        />
        <button 
        className='signup-button'
        type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;