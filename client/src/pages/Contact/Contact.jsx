// client/src/components/Contact/Contact.jsx
import { useState } from 'react';
import axios from 'axios';
import './Contact.css'; // Import the new CSS file

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post('http://localhost:5000/api/messages', formData);
      setSuccess('Message sent successfully! We\'ll get back to you soon. 🌸');
      setError('');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send message. Please try again.');
      setSuccess('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-card">
        <header className="contact-header">
          <h2 className="contact-title">Get In Touch</h2>
          <p className="contact-subtitle">
            We'd love to hear from you. Share your thoughts or ask us anything.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="contact-field-group">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="contact-input"
              required
              disabled={isSubmitting}
            />
        
          </div>

          <div className="contact-field-group">
            <input
              type="email"
              name="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              className="contact-input"
              required
              disabled={isSubmitting}
            />
           
          </div>

          <div className="contact-field-group">
            <textarea
              name="message"
              placeholder="Tell us about your floral dreams..."
              value={formData.message}
              onChange={handleChange}
              className="contact-textarea"
              rows="5"
              required
              disabled={isSubmitting}
            />
          </div>

          <button 
            type="submit" 
            className="contact-submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="contact-spinner"></span>
                Sending Message...
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </form>

        {success && (
          <div className="contact-success">
            <span className="contact-success-icon">✅</span>
            <p className="contact-success-message">{success}</p>
          </div>
        )}

        {error && (
          <div className="contact-error">
            <span className="contact-error-icon">⚠️</span>
            <p className="contact-error-message">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Contact;