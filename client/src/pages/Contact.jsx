import { useState } from 'react';
import axios from 'axios';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/messages', formData);
      setSuccess('Message sent successfully!');
      setError('');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send message');
      setSuccess('');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Contact Us</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          style={styles.textarea}
          required
        />
        <button type="submit" style={styles.button}>Send Message</button>
      </form>
      {success && <p style={styles.success}>{success}</p>}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#FFFFFF', // White
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  },
  title: {
    fontSize: '2rem',
    color: '#005c00ff', // Dark Green
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '10px',
    border: '1px solid #4A4A4A', // Gray
    borderRadius: '5px',
    fontSize: '1rem',
    color: '#000000', // Black
  },
  textarea: {
    padding: '10px',
    border: '1px solid #4A4A4A', // Gray
    borderRadius: '5px',
    fontSize: '1rem',
    color: '#000000', // Black
    minHeight: '100px',
  },
  button: {
    padding: '12px',
    backgroundColor: '#005c00ff', // Dark Green
    color: '#FFFFFF', // White
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  success: {
    color: '#005c00ff', // Dark Green
    textAlign: 'center',
    marginTop: '15px',
  },
  error: {
    color: '#D4A017', // Gold
    textAlign: 'center',
    marginTop: '15px',
  },
};

export default Contact;