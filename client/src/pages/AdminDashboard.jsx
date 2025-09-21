//client/src/pages/AdminDashboard.jsx
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../AdminDashboard.css'; // Import the CSS file

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
    // Clear the file input
    document.getElementById('image-upload') && (document.getElementById('image-upload').value = '');
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
    setImageFile(null);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', description: '', stock: '' });
    setImageFile(null);
    setImagePreview(null);
    // Clear the file input
    document.getElementById('image-upload') && (document.getElementById('image-upload').value = '');
  };

  // Updated product submit handler with FormData for file upload
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
      document.getElementById('image-upload') && (document.getElementById('image-upload').value = '');
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
      setSuccess('User added successfully');
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
      setSuccess('Order added successfully');
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
    if (!confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:5000/api/${type}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (type === 'products') fetchProducts();
      if (type === 'users') fetchUsers();
      if (type === 'orders') fetchOrders();
      if (type === 'messages') fetchMessages();
      setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
    } catch (err) {
      setError(`Failed to delete ${type}`);
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin Dashboard</h2>
      {error && <p className="admin-error">{error}</p>}
      {success && <p className="admin-success">{success}</p>}
      
      <div className="admin-tabs">
        <button 
          onClick={() => setTab('products')} 
          className={tab === 'products' ? 'admin-tab admin-tab-active' : 'admin-tab'}
        >
          Products
        </button>
        <button 
          onClick={() => setTab('users')} 
          className={tab === 'users' ? 'admin-tab admin-tab-active' : 'admin-tab'}
        >
          Users
        </button>
        <button 
          onClick={() => setTab('orders')} 
          className={tab === 'orders' ? 'admin-tab admin-tab-active' : 'admin-tab'}
        >
          Orders
        </button>
        <button 
          onClick={() => setTab('messages')} 
          className={tab === 'messages' ? 'admin-tab admin-tab-active' : 'admin-tab'}
        >
          Messages
        </button>
      </div>

      {tab === 'products' && (
        <div className="admin-section">
          <h3 className="admin-section-title">
            {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Manage Products'}
          </h3>
          
          <form onSubmit={handleProductSubmit} className="admin-form">
            <input
              type="text"
              placeholder="Product Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="admin-input"
              required
            />
            <input
              type="number"
              placeholder="Price *"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="admin-input"
              required
              step="0.01"
              min="0"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="admin-textarea"
              rows="3"
              maxLength="500"
            />
            <input
              type="number"
              placeholder="Stock Quantity *"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="admin-input"
              required
              min="0"
            />
            
            {/* Image Upload Section */}
            <div className="admin-image-section">
              <label className="admin-label">Product Image:</label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="admin-file-input"
              />
              
              {imagePreview && (
                <div className="admin-preview-container">
                  <img src={imagePreview} alt="Preview" className="admin-preview-image" />
                  <button 
                    type="button" 
                    onClick={removeImagePreview}
                    className="admin-remove-preview"
                  >
                    Remove Image
                  </button>
                </div>
              )}
              
              {editingProduct && !imageFile && editingProduct.image && (
                <div className="admin-existing-image">
                  <p className="admin-existing-label">Current Image:</p>
                  <img 
                    src={editingProduct.image} 
                    alt={editingProduct.name} 
                    className="admin-existing-image-preview" 
                    onError={(e) => {
                      e.target.src = 'https://placekitten.com/100/100';
                    }}
                  />
                  <p className="admin-image-note">
                    Upload a new image to replace this one
                  </p>
                </div>
              )}
              
              {!editingProduct && (
                <p className="admin-image-note">Upload an image for your product (JPG, PNG, WebP - max 5MB)</p>
              )}
            </div>

            <div className="admin-button-group">
              <button type="submit" className="admin-button">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              {editingProduct && (
                <button type="button" onClick={cancelEdit} className="admin-cancel-button">
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
          
          <div className="admin-list">
            {products.length === 0 ? (
              <p className="admin-empty-list">No products found. Add your first product above!</p>
            ) : (
              products.map((product) => (
                <div key={product._id} className="admin-item">
                  <div className="admin-product-info">
                    <img 
                      src={product.image || 'https://placekitten.com/60/60'} 
                      alt={product.name} 
                      className="admin-product-image" 
                      onError={(e) => {
                        e.target.src = 'https://placekitten.com/60/60';
                      }}
                    />
                    <div className="admin-product-details">
                      <div className="admin-product-header">
                        <span className="admin-product-name">{product.name}</span>
                        <span className="admin-product-price">${parseFloat(product.price).toFixed(2)}</span>
                      </div>
                      <p className="admin-product-description">
                        {product.description?.substring(0, 80) || 'No description'}...
                      </p>
                      <span className="admin-product-stock">
                        📦 Stock: {product.stock} | 
                        🕐 {new Date(product.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="admin-action-buttons">
                    <button 
                      onClick={() => handleEditProduct(product)} 
                      className="admin-edit-button"
                      title="Edit Product"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDelete('products', product._id)} 
                      className="admin-delete-button"
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
        <div className="admin-section">
          <h3 className="admin-section-title">Manage Users</h3>
          <form onSubmit={handleUserSubmit} className="admin-form">
            <input
              type="email"
              placeholder="Email"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              className="admin-input"
              required
            />
            <input
              type="text"
              placeholder="Name"
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              className="admin-input"
              required
            />
            <label className="admin-label">
              <input
                type="checkbox"
                checked={userForm.isAdmin}
                onChange={(e) => setUserForm({ ...userForm, isAdmin: e.target.checked })}
              />
              Admin Access
            </label>
            <button type="submit" className="admin-button">Add User</button>
          </form>
          
          <div className="admin-list">
            {users.map((user) => (
              <div key={user._id} className="admin-item">
                <span className="admin-user-info">
                  {user.email} - {user.name} 
                  {user.isAdmin && <span className="admin-admin-badge"> (Admin)</span>}
                </span>
                <button onClick={() => handleDelete('users', user._id)} className="admin-delete-button">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="admin-section">
          <h3 className="admin-section-title">Manage Orders</h3>
          <form onSubmit={handleOrderSubmit} className="admin-form">
            <input
              type="text"
              placeholder="User ID"
              value={orderForm.userId}
              onChange={(e) => setOrderForm({ ...orderForm, userId: e.target.value })}
              className="admin-input"
            />
            <input
              type="text"
              placeholder="Items (JSON)"
              value={JSON.stringify(orderForm.items)}
              onChange={(e) => setOrderForm({ ...orderForm, items: JSON.parse(e.target.value || '[]') })}
              className="admin-input"
            />
            <select
              value={orderForm.status}
              onChange={(e) => setOrderForm({ ...orderForm, status: e.target.value })}
              className="admin-input"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
            <button type="submit" className="admin-button">Add Order</button>
          </form>
          
          <div className="admin-list">
            {orders.map((order) => (
              <div key={order._id} className="admin-item">
                <span className="admin-order-info">
                  Order #{order._id?.substring(0, 8)}... - 
                  <span className={`admin-status admin-status-${order.status || 'pending'}`}>
                    {order.status}
                  </span>
                </span>
                <button onClick={() => handleDelete('orders', order._id)} className="admin-delete-button">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'messages' && (
        <div className="admin-section">
          <h3 className="admin-section-title">Manage Messages</h3>
          <div className="admin-list">
            {messages.map((msg) => (
              <div key={msg._id} className="admin-item">
                <div className="admin-message-info">
                  <span className="admin-message-header">
                    <strong>{msg.name}</strong> ({msg.email})
                  </span>
                  <p className="admin-message-text">{msg.message}</p>
                  {msg.reply && (
                    <p className="admin-reply">Reply: {msg.reply}</p>
                  )}
                </div>
                <div className="admin-message-actions">
                  <form
                    onSubmit={(e) => { e.preventDefault(); handleMessageReply(msg._id); }}
                    className="admin-inline-form"
                  >
                    <input
                      type="text"
                      placeholder="Reply (sent via email)"
                      value={messageForm.messageId === msg._id ? messageForm.reply : ''}
                      onChange={(e) => setMessageForm({ messageId: msg._id, reply: e.target.value })}
                      className="admin-inline-input"
                    />
                    <button type="submit" className="admin-small-button">Send</button>
                  </form>
                  <button onClick={() => handleDelete('messages', msg._id)} className="admin-delete-button">
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

export default AdminDashboard;