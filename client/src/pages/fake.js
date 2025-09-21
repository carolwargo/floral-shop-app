//client/src/pages/AdminDashboard.jsx
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', description: '', stock: '' });
  const [userForm, setUserForm] = useState({ email: '', name: '', isAdmin: false });
  const [orderForm, setOrderForm] = useState({ userId: '', items: [], status: 'pending' });
  const [messageForm, setMessageForm] = useState({ messageId: '', reply: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Image upload states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
      return;
    }
    fetchProducts();
    fetchUsers();
    fetchOrders();
    fetchMessages();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      setError('Failed to fetch products');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(res.data);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setOrders(res.data);
    } catch (err) {
      setError('Failed to fetch orders');
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/messages', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMessages(res.data);
    } catch (err) {
      setError('Failed to fetch messages');
    }
  };

  // Image handling functions
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const removeImagePreview = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // Product editing functions
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description || '',
      stock: product.stock
    });
    // Don't set imageFile for existing images - we'll show the current one
    setImagePreview(null);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', description: '', stock: '' });
    setImageFile(null);
    setImagePreview(null);
  };

  // Updated product submit handler
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('stock', formData.stock);
      
      // Only append image if a new file is selected
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      // If editing and no new image, the backend will keep the existing image

      if (editingProduct) {
        // Update existing product
        await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, formDataToSend, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          },
        });
        setSuccess('Product updated successfully');
      } else {
        // Create new product
        await axios.post('http://localhost:5000/api/products', formDataToSend, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          },
        });
        setSuccess('Product added successfully');
      }
      
      fetchProducts();
      setFormData({ name: '', price: '', description: '', stock: '' });
      setEditingProduct(null);
      setImageFile(null);
      setImagePreview(null);
      
      // Clear the file input
      document.getElementById('image-upload').value = '';
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save product');
      console.error('Product submit error:', err);
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users', userForm, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchUsers();
      setUserForm({ email: '', name: '', isAdmin: false });
    } catch (err) {
      setError('Failed to add user');
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/orders', orderForm, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchOrders();
      setOrderForm({ userId: '', items: [], status: 'pending' });
    } catch (err) {
      setError('Failed to add order');
    }
  };

  const handleMessageReply = async (messageId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/messages/${messageId}/reply`,
        { reply: messageForm.reply },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSuccess('Reply sent successfully');
      setError('');
      fetchMessages();
      setMessageForm({ messageId: '', reply: '' });
    } catch (err) {
      setError('Failed to send reply');
      setSuccess('');
    }
  };

  const handleDelete = async (type, id) => {
    try {
      await axios.delete(`http://localhost:5000/api/${type}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (type === 'products') fetchProducts();
      if (type === 'users') fetchUsers();
      if (type === 'orders') fetchOrders();
      if (type === 'messages') fetchMessages();
    } catch (err) {
      setError(`Failed to delete ${type}`);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Admin Dashboard</h2>
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}
      <div style={styles.tabs}>
        <button onClick={() => setTab('products')} style={tab === 'products' ? styles.activeTab : styles.tab}>
          Products
        </button>
        <button onClick={() => setTab('users')} style={tab === 'users' ? styles.activeTab : styles.tab}>
          Users
        </button>
        <button onClick={() => setTab('orders')} style={tab === 'orders' ? styles.activeTab : styles.tab}>
          Orders
        </button>
        <button onClick={() => setTab('messages')} style={tab === 'messages' ? styles.activeTab : styles.tab}>
          Messages
        </button>
      </div>

      {tab === 'products' && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>
            {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Manage Products'}
          </h3>
          <form onSubmit={handleProductSubmit} style={styles.form}>
            <input
              type="text"
              placeholder="Product Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={styles.input}
              required
            />
            <input
              type="number"
              placeholder="Price *"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              style={styles.input}
              required
              step="0.01"
              min="0"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={styles.textarea}
              rows="3"
              maxLength="500"
            />
            <input
              type="number"
              placeholder="Stock Quantity *"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              style={styles.input}
              required
              min="0"
            />
            
            {/* Image Upload Section */}
            <div style={styles.imageSection}>
              <label style={styles.label}>Product Image:</label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={styles.fileInput}
              />
              {imagePreview && (
                <div style={styles.previewContainer}>
                  <img src={imagePreview} alt="Preview" style={styles.previewImage} />
                  <button 
                    type="button" 
                    onClick={removeImagePreview}
                    style={styles.removePreview}
                  >
                    Remove Image
                  </button>
                </div>
              )}
              {editingProduct && !imageFile && editingProduct.image && (
                <div style={styles.existingImage}>
                  <p style={styles.existingLabel}>Current Image:</p>
                  <img 
                    src={editingProduct.image} 
                    alt={editingProduct.name} 
                    style={styles.existingImagePreview} 
                  />
                  <p style={styles.imageNote}>
                    Upload a new image to replace this one
                  </p>
                </div>
              )}
              {!editingProduct && (
                <p style={styles.imageNote}>Upload an image for your product (JPG, PNG, WebP - max 5MB)</p>
              )}
            </div>

            <div style={styles.buttonGroup}>
              <button type="submit" style={styles.button}>
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              {editingProduct && (
                <button type="button" onClick={cancelEdit} style={styles.cancelButton}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
          
          <div style={styles.list}>
            {products.length === 0 ? (
              <p style={styles.emptyList}>No products found. Add your first product above!</p>
            ) : (
              products.map((product) => (
                <div key={product._id} style={styles.item}>
                  <div style={styles.productInfo}>
                    <img 
                      src={product.image || 'https://via.placeholder.com/60x60?text=No+Image'} 
                      alt={product.name} 
                      style={styles.productImage} 
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/60x60?text=No+Image';
                      }}
                    />
                    <div style={styles.productDetails}>
                      <div style={styles.productHeader}>
                        <span style={styles.productName}>{product.name}</span>
                        <span style={styles.productPrice}>${parseFloat(product.price).toFixed(2)}</span>
                      </div>
                      <p style={styles.productDescription}>
                        {product.description?.substring(0, 80) || 'No description'}...
                      </p>
                      <span style={styles.productStock}>
                        📦 Stock: {product.stock} | 
                        🕐 {new Date(product.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div style={styles.actionButtons}>
                    <button 
                      onClick={() => handleEditProduct(product)} 
                      style={styles.editButton}
                      title="Edit Product"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDelete('products', product._id)} 
                      style={styles.deleteButton}
                      title="Delete Product"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Manage Users</h3>
          <form onSubmit={handleUserSubmit} style={styles.form}>
            <input
              type="email"
              placeholder="Email"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              style={styles.input}
              required
            />
            <input
              type="text"
              placeholder="Name"
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              style={styles.input}
              required
            />
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={userForm.isAdmin}
                onChange={(e) => setUserForm({ ...userForm, isAdmin: e.target.checked })}
              />
              Admin Access
            </label>
            <button type="submit" style={styles.button}>Add User</button>
          </form>
          <div style={styles.list}>
            {users.map((user) => (
              <div key={user._id} style={styles.item}>
                <span style={styles.userInfo}>
                  {user.email} - {user.name} 
                  {user.isAdmin && <span style={styles.adminBadge}> (Admin)</span>}
                </span>
                <button onClick={() => handleDelete('users', user._id)} style={styles.deleteButton}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Manage Orders</h3>
          <form onSubmit={handleOrderSubmit} style={styles.form}>
            <input
              type="text"
              placeholder="User ID"
              value={orderForm.userId}
              onChange={(e) => setOrderForm({ ...orderForm, userId: e.target.value })}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Items (JSON)"
              value={JSON.stringify(orderForm.items)}
              onChange={(e) => setOrderForm({ ...orderForm, items: JSON.parse(e.target.value || '[]') })}
              style={styles.input}
            />
            <select
              value={orderForm.status}
              onChange={(e) => setOrderForm({ ...orderForm, status: e.target.value })}
              style={styles.input}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
            <button type="submit" style={styles.button}>Add Order</button>
          </form>
          <div style={styles.list}>
            {orders.map((order) => (
              <div key={order._id} style={styles.item}>
                <span style={styles.orderInfo}>
                  Order #{order._id?.substring(0, 8)}... - 
                  <span style={styles.status[order.status || 'pending']}>
                    {order.status}
                  </span>
                </span>
                <button onClick={() => handleDelete('orders', order._id)} style={styles.deleteButton}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'messages' && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Manage Messages</h3>
          <div style={styles.list}>
            {messages.map((msg) => (
              <div key={msg._id} style={styles.item}>
                <div style={styles.messageInfo}>
                  <span style={styles.messageHeader}>
                    <strong>{msg.name}</strong> ({msg.email})
                  </span>
                  <p style={styles.messageText}>{msg.message}</p>
                  {msg.reply && (
                    <p style={styles.reply}>Reply: {msg.reply}</p>
                  )}
                </div>
                <div style={styles.messageActions}>
                  <form
                    onSubmit={(e) => { e.preventDefault(); handleMessageReply(msg._id); }}
                    style={styles.inlineForm}
                  >
                    <input
                      type="text"
                      placeholder="Reply (sent via email)"
                      value={messageForm.messageId === msg._id ? messageForm.reply : ''}
                      onChange={(e) => setMessageForm({ messageId: msg._id, reply: e.target.value })}
                      style={styles.inlineInput}
                    />
                    <button type="submit" style={styles.smallButton}>Send</button>
                  </form>
                  <button onClick={() => handleDelete('messages', msg._id)} style={styles.deleteButton}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#FFFFFF', // White
    color: '#000000', // Black
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  },
  title: {
    fontSize: '2rem',
    color: '#005c00ff', // Dark Green
    textAlign: 'center',
    marginBottom: '20px',
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  tab: {
    padding: '12px 24px',
    backgroundColor: '#4A4A4A', // Gray
    color: '#FFFFFF', // White
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    fontWeight: '500',
  },
  activeTab: {
    padding: '12px 24px',
    backgroundColor: '#005c00ff', // Dark Green
    color: '#FFFFFF', // White
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(0, 92, 0, 0.3)',
  },
  section: {
    padding: '25px',
    backgroundColor: '#F8F9FA', // Light Gray
    borderRadius: '12px',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    color: '#005c00ff', // Dark Green
    marginBottom: '20px',
    borderBottom: '2px solid #E9ECEF',
    paddingBottom: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '25px',
    backgroundColor: '#FFFFFF',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  input: {
    padding: '12px 15px',
    border: '2px solid #E9ECEF',
    borderRadius: '8px',
    fontSize: '1rem',
    color: '#000000', // Black
    transition: 'border-color 0.3s ease',
    backgroundColor: '#FFFFFF',
  },
  textarea: {
    padding: '12px 15px',
    border: '2px solid #E9ECEF',
    borderRadius: '8px',
    fontSize: '1rem',
    color: '#000000', // Black
    transition: 'border-color 0.3s ease',
    backgroundColor: '#FFFFFF',
    resize: 'vertical',
    minHeight: '80px',
    fontFamily: 'inherit',
  },
  fileInput: {
    padding: '10px',
    border: '2px dashed #005c00ff',
    borderRadius: '8px',
    backgroundColor: '#F0FFF4',
    color: '#005c00ff',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  imageSection: {
    margin: '20px 0',
    padding: '15px',
    backgroundColor: '#F0FFF4',
    borderRadius: '8px',
    border: '1px solid #D4EDDA',
  },
  label: {
    fontWeight: '600',
    marginBottom: '8px',
    color: '#005c00ff',
    display: 'block',
    fontSize: '1rem',
  },
  previewContainer: {
    marginTop: '15px',
    textAlign: 'center',
    padding: '10px',
    backgroundColor: '#FFFFFF',
    borderRadius: '6px',
  },
  previewImage: {
    width: '120px',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '10px',
    border: '2px solid #E9ECEF',
  },
  removePreview: {
    padding: '8px 16px',
    backgroundColor: '#D4A017', // Gold
    color: '#000000', // Black
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.3s ease',
  },
  existingImage: {
    marginTop: '15px',
    textAlign: 'center',
    padding: '10px',
    backgroundColor: '#E3F2FD',
    borderRadius: '6px',
    border: '1px solid #BBDEFB',
  },
  existingLabel: {
    fontWeight: '500',
    color: '#1976D2',
    marginBottom: '8px',
    fontSize: '0.9rem',
  },
  existingImagePreview: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid #BBDEFB',
  },
  imageNote: {
    fontSize: '0.85rem',
    color: '#6C757D',
    marginTop: '8px',
    fontStyle: 'italic',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginTop: '10px',
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#005c00ff', // Dark Green
    color: '#FFFFFF', // White
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    minWidth: '150px',
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: '#6C757D', // Gray
    color: '#FFFFFF', // White
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    minWidth: '150px',
  },
  deleteButton: {
    padding: '8px 16px',
    backgroundColor: '#DC3545', // Red
    color: '#FFFFFF', // White
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  editButton: {
    padding: '8px 16px',
    backgroundColor: '#005c00ff', // Dark Green
    color: '#FFFFFF', // White
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    marginRight: '8px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  item: {
    padding: '15px',
    backgroundColor: '#FFFFFF', // White
    borderRadius: '8px',
    display: 'flex',
    gap: '15px',
    alignItems: 'flex-start',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    borderLeft: '4px solid #005c00ff',
  },
  productInfo: {
    display: 'flex',
    gap: '15px',
    alignItems: 'flex-start',
    flex: 1,
  },
  productImage: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '6px',
    flexShrink: 0,
    border: '1px solid #E9ECEF',
  },
  productDetails: {
    flex: 1,
    minWidth: 0, // Prevents overflow
  },
  productHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  productName: {
    fontWeight: '600',
    color: '#000000',
    fontSize: '1.1rem',
    flex: 1,
  },
  productPrice: {
    color: '#005c00ff',
    fontSize: '1.2rem',
    fontWeight: '700',
    whiteSpace: 'nowrap',
  },
  productDescription: {
    color: '#6C757D',
    fontSize: '0.95rem',
    marginBottom: '8px',
    lineHeight: '1.4',
  },
  productStock: {
    color: '#6C757D',
    fontSize: '0.9rem',
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
  },
  emptyList: {
    textAlign: 'center',
    color: '#6C757D',
    fontStyle: 'italic',
    padding: '40px 20px',
    backgroundColor: '#F8F9FA',
    borderRadius: '8px',
    border: '2px dashed #DEE2E6',
  },
  // User specific styles
  userInfo: {
    flex: 1,
    fontWeight: '500',
  },
  adminBadge: {
    backgroundColor: '#005c00ff',
    color: '#FFFFFF',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '600',
    marginLeft: '8px',
  },
  // Order specific styles
  orderInfo: {
    flex: 1,
  },
  status: {
    pending: { color: '#856404', fontWeight: '600' },
    processing: { color: '#0c5460', fontWeight: '600' },
    shipped: { color: '#155724', fontWeight: '600' },
    delivered: { color: '#004085', fontWeight: '600' },
  },
  // Message specific styles
  messageInfo: {
    flex: 1,
  },
  messageHeader: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '0.95rem',
  },
  messageText: {
    color: '#495057',
    marginBottom: '12px',
    lineHeight: '1.5',
    padding: '10px',
    backgroundColor: '#F8F9FA',
    borderRadius: '6px',
    borderLeft: '3px solid #005c00ff',
  },
  messageActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'flex-end',
  },
  inlineForm: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  inlineInput: {
    ...styles.input,
    flex: 1,
    minWidth: '200px',
    padding: '8px 12px',
    fontSize: '0.9rem',
  },






  smallButton: {
    padding: '8px 16px',
    backgroundColor: '#005c00ff',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  reply: {
    color: '#005c00ff',
    fontStyle: 'italic',
    marginTop: '8px',
    padding: '8px 12px',
    backgroundColor: '#E8F5E8',
    borderRadius: '6px',
    borderLeft: '3px solid #005c00ff',
  },
  error: {
    color: '#DC3545', // Red
    textAlign: 'center',
    marginBottom: '15px',
    fontWeight: '500',
    padding: '10px',
    backgroundColor: '#F8D7DA',
    border: '1px solid #F5C6CB',
    borderRadius: '6px',
  },
  success: {
    color: '#155724', // Dark Green
    textAlign: 'center',
    marginBottom: '15px',
    fontWeight: '500',
    padding: '10px',
    backgroundColor: '#D4EDDA',
    border: '1px solid #C3E6CB',
    borderRadius: '6px',
  },
};

export default AdminDashboard;