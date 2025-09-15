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
  const [formData, setFormData] = useState({ name: '', price: '', description: '', stock: '', image: '' });
  const [userForm, setUserForm] = useState({ email: '', name: '', isAdmin: false });
  const [orderForm, setOrderForm] = useState({ userId: '', items: [], status: 'pending' });
  const [messageForm, setMessageForm] = useState({ messageId: '', reply: '' });
  const [error, setError] = useState('');

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

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/products', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchProducts();
      setFormData({ name: '', price: '', description: '', stock: '', image: '' });
    } catch (err) {
      setError('Failed to add product');
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
      fetchMessages();
      setMessageForm({ messageId: '', reply: '' });
    } catch (err) {
      setError('Failed to send reply');
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
          <h3 style={styles.sectionTitle}>Manage Products</h3>
          <form onSubmit={handleProductSubmit} style={styles.form}>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={styles.input}
            />
            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={styles.input}
            />
            <input
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Image URL"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Add Product</button>
          </form>
          <div style={styles.list}>
            {products.map((product) => (
              <div key={product._id} style={styles.item}>
                <span>{product.name} - ${product.price}</span>
                <button onClick={() => handleDelete('products', product._id)} style={styles.deleteButton}>
                  Delete
                </button>
              </div>
            ))}
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
            />
            <input
              type="text"
              placeholder="Name"
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              style={styles.input}
            />
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={userForm.isAdmin}
                onChange={(e) => setUserForm({ ...userForm, isAdmin: e.target.checked })}
              />
              Admin
            </label>
            <button type="submit" style={styles.button}>Add User</button>
          </form>
          <div style={styles.list}>
            {users.map((user) => (
              <div key={user._id} style={styles.item}>
                <span>{user.email} - {user.name} {user.isAdmin && '(Admin)'}</span>
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
                <span>Order #{order._id} - {order.status}</span>
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
                <span>
                  {msg.name} ({msg.email}): {msg.message}
                </span>
                {msg.reply && <p style={styles.reply}>Reply: {msg.reply}</p>}
                <form
                  onSubmit={(e) => { e.preventDefault(); handleMessageReply(msg._id); }}
                  style={styles.form}
                >
                  <input
                    type="text"
                    placeholder="Reply"
                    value={messageForm.messageId === msg._id ? messageForm.reply : ''}
                    onChange={(e) => setMessageForm({ messageId: msg._id, reply: e.target.value })}
                    style={styles.input}
                  />
                  <button type="submit" style={styles.button}>Send Reply</button>
                </form>
                <button onClick={() => handleDelete('messages', msg._id)} style={styles.deleteButton}>
                  Delete
                </button>
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
    maxWidth: '1000px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#FFFFFF', // White
    color: '#000000', // Black
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  },
  title: {
    fontSize: '2rem',
    color: '#2E4A2E', // Dark Green
    textAlign: 'center',
    marginBottom: '20px',
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  tab: {
    padding: '10px 20px',
    backgroundColor: '#4A4A4A', // Gray
    color: '#FFFFFF', // White
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  activeTab: {
    padding: '10px 20px',
    backgroundColor: '#2E4A2E', // Dark Green
    color: '#FFFFFF', // White
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  section: {
    padding: '20px',
    backgroundColor: '#D3D3D3', // Light Gray
    borderRadius: '10px',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#2E4A2E', // Dark Green
    marginBottom: '15px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    border: '1px solid #4A4A4A', // Gray
    borderRadius: '5px',
    fontSize: '1rem',
    color: '#000000', // Black
  },
  button: {
    padding: '10px',
    backgroundColor: '#2E4A2E', // Dark Green
    color: '#FFFFFF', // White
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#D4A017', // Gold
    color: '#000000', // Black
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  item: {
    padding: '10px',
    backgroundColor: '#FFFFFF', // White
    borderRadius: '5px',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  error: {
    color: '#D4A017', // Gold
    textAlign: 'center',
    marginBottom: '10px',
  },
  reply: {
    color: '#4A4A4A', // Gray
    fontStyle: 'italic',
    marginTop: '5px',
  },
};

export default AdminDashboard;