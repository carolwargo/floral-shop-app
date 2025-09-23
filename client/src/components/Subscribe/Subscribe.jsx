// client/src/components/Subscribe/Subscribe.jsx
import { useState } from 'react';
import axios from 'axios';
import './Subscribe.css';

function Subscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage('Please enter a valid email address');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      await axios.post('http://localhost:5000/api/subscribe', { email });
      setStatus('success');
      setEmail('');
    } catch (err) {
      if (err.response?.status === 409) {
        setErrorMessage('You\'re already subscribed! 🌸');
      } else {
        setErrorMessage('Oops! Something went wrong. Please try again.');
      }
      setStatus('error');
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  return (
    <section className="subscribe-section">
      <div className="subscribe-container">


        <div className="subscribe-card">
          <div className="subscribe-content">
         

            <div className="subscribe-text">
              <h2 className="subscribe-title">
                Bloom with Us
              </h2>
              <p className="subscribe-subtitle">
                Get weekly floral inspiration, exclusive offers, and care tips 
                delivered to your inbox. Let's grow together! 🌱
              </p>
              
              <form onSubmit={handleSubmit} className="subscribe-form">
                <div className="subscribe-input-group">
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email address"
                    className={`subscribe-input ${status === 'error' ? 'error' : ''}`}
                    disabled={status === 'submitting' || status === 'success'}
                  />
                  <button 
                    type="submit" 
                    className={`subscribe-button ${status === 'submitting' ? 'loading' : ''}`}
                    disabled={status === 'submitting' || status === 'success'}
                  >
                    {status === 'submitting' ? (
                      <>
                        <span className="subscribe-spinner"></span>
                        <span>Signing you up...</span>
                      </>
                    ) : status === 'success' ? (
                      <>
                        <span className="subscribe-checkmark">✅</span>
                        <span>Welcome aboard!</span>
                      </>
                    ) : (
                      <>
                        <span className="subscribe-arrow">→</span>
                        <span>Subscribe</span>
                      </>
                    )}
                  </button>
                </div>

                {status === 'error' && (
                  <div className="subscribe-error">
                    <span className="error-icon">🌸</span>
                    <p className="error-message">{errorMessage}</p>
                  </div>
                )}

                {status === 'success' && (
                  <div className="subscribe-success">
                    <span className="success-icon">🌸</span>
                    <p className="success-message">
                      You're all set! Check your inbox for a welcome surprise.
                    </p>
                  </div>
                )}

                <div className="subscribe-benefits">
                  <p className="benefits-text">
                    ✨ Weekly floral tips & tricks | 💐 Exclusive offers | 
                    🌿 Care guides | 🎨 Seasonal inspiration
                  </p>
                </div>
              </form>
            </div>
          </div>
 
        </div>
                         {/* Decorative Elements=
        <div className="subscribe-decoration">
          <span className="subscribe-flower flower-1">🌸</span>
          <span className="subscribe-flower flower-2">🌺</span>
          <span className="subscribe-flower flower-3">🌼</span>
        </div>
         */}
      </div>
    </section>
  );
}

export default Subscribe;