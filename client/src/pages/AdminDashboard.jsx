import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tab, setTab] = useState('inventory');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [productForm, setProductForm] = useState({ id: '', name: '', description: '', price: '', stock: '', image: '' });
  const [userForm, setUserForm] = useState({ id: '', email: '', name: '', password: '', isAdmin: false });
  const [orderForm, setOrderForm] = useState({ id: '', userId: '', items: [{ productId: '', quantity: 1 }], status: 'Pending' });
  const [error, setError] = useState(null);

  if (!user || !user.isAdmin) {
    navigate('/login');
    return null;
  }

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch products');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch users');
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOrders(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch orders');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchUsers();
    fetchOrders();
  }, []);

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: productForm.name,
        description: productForm.description,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        image: productForm.image
      };
      if (productForm.id) {
        await axios.put(`http://localhost:5000/api/products/${productForm.id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/products', data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      fetchProducts();
      setProductForm({ id: '', name: '', description: '', price: '', stock: '', image: '' });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save product');
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        email: userForm.email,
        name: userForm.name,
        isAdmin: userForm.isAdmin
      };
      if (userForm.password) data.password = userForm.password;
      if (userForm.id) {
        await axios.put(`http://localhost:5000/api/users/${userForm.id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/users', data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      fetchUsers();
      setUserForm({ id: '', email: '', name: '', password: '', isAdmin: false });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save user');
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        userId: orderForm.userId,
        items: orderForm.items.filter(item => item.productId && item.quantity > 0),
        status: orderForm.status
      };
      if (!data.items.length) {
        setError('At least one item is required');
        return;
      }
      if (orderForm.id) {
        await axios.put(`http://localhost:5000/api/orders/${orderForm.id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/orders', data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      fetchOrders();
      setOrderForm({ id: '', userId: '', items: [{ productId: '', quantity: 1 }], status: 'Pending' });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save order');
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchProducts();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete product');
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchUsers();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const deleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchOrders();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete order');
    }
  };

  const editProduct = (product) => {
    setProductForm({
      id: product._id,
      name: product.name,
      description: product.description || '',
      price: product.price || '',
      stock: product.stock || '',
      image: product.image || ''
    });
    setTab('inventory');
  };

  const editUser = (user) => {
    setUserForm({
      id: user._id,
      email: user.email,
      name: user.name,
      password: '',
      isAdmin: user.isAdmin
    });
    setTab('users');
  };

  const editOrder = (order) => {
    setOrderForm({
      id: order._id,
      userId: order.user._id,
      items: order.items.map(item => ({
        productId: item.product._id,
        quantity: item.quantity
      })),
      status: order.status
    });
    setTab('orders');
  };

  const addOrderItem = () => {
    setOrderForm({
      ...orderForm,
      items: [...orderForm.items, { productId: '', quantity: 1 }]
    });
  };

  const updateOrderItem = (index, field, value) => {
    const newItems = [...orderForm.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setOrderForm({ ...orderForm, items: newItems });
  };

  const removeOrderItem = (index) => {
    setOrderForm({
      ...orderForm,
      items: orderForm.items.filter((_, i) => i !== index)
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Admin Dashboard</h2>
      <p style={styles.subHeader}>Welcome, {user.email}</p>
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.tabContainer}>
        <button
          style={tab === 'inventory' ? styles.activeTab : styles.tab}
          onClick={() => setTab('inventory')}
        >
          Inventory
        </button>
        <button
          style={tab === 'users' ? styles.activeTab : styles.tab}
          onClick={() => setTab('users')}
        >
          Users
        </button>
        <button
          style={tab === 'orders' ? styles.activeTab : styles.tab}
          onClick={() => setTab('orders')}
        >
          Orders
        </button>
      </div>

      {tab === 'inventory' && (
        <div style={styles.section}>
          <h3 style={styles.sectionHeader}>Manage Inventory</h3>
          <form onSubmit={handleProductSubmit} style={styles.form}>
            <input
              type="text"
              placeholder="Product Name"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              style={styles.input}
              required
            />
            <textarea
              placeholder="Description"
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              style={styles.textarea}
            />
            <input
              type="number"
              placeholder="Price"
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              style={styles.input}
              required
            />
            <input
              type="number"
              placeholder="Stock"
              value={productForm.stock}
              onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
              style={styles.input}
              required
            />
            <input
              type="text"
              placeholder="Image URL"
              value={productForm.image}
              onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              {productForm.id ? 'Update Product' : 'Add Product'}
            </button>
            {productForm.id && (
              <button
                type="button"
                onClick={() => setProductForm({ id: '', name: '', description: '', price: '', stock: '', image: '' })}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            )}
          </form>

          <h4 style={styles.listHeader}>Products</h4>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Stock</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td style={styles.td}>{product.name}</td>
                  <td style={styles.td}>${product.price}</td>
                  <td style={styles.td}>{product.stock}</td>
                  <td style={styles.td}>
                    <button onClick={() => editProduct(product)} style={styles.actionButton}>
                      Edit
                    </button>
                    <button onClick={() => deleteProduct(product._id)} style={styles.deleteButton}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'users' && (
        <div style={styles.section}>
          <h3 style={styles.sectionHeader}>Manage Users</h3>
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
            <input
              type="password"
              placeholder="Password (leave blank to keep unchanged)"
              value={userForm.password}
              onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
              style={styles.input}
              required={!userForm.id}
            />
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={userForm.isAdmin}
                onChange={(e) => setUserForm({ ...userForm, isAdmin: e.target.checked })}
              />
              Is Admin
            </label>
            <button type="submit" style={styles.button}>
              {userForm.id ? 'Update User' : 'Add User'}
            </button>
            {userForm.id && (
              <button
                type="button"
                onClick={() => setUserForm({ id: '', email: '', name: '', password: '', isAdmin: false })}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            )}
          </form>

          <h4 style={styles.listHeader}>Users</h4>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Admin</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>{u.name}</td>
                  <td style={styles.td}>{u.isAdmin ? 'Yes' : 'No'}</td>
                  <td style={styles.td}>
                    <button onClick={() => editUser(u)} style={styles.actionButton}>
                      Edit
                    </button>
                    <button onClick={() => deleteUser(u._id)} style={styles.deleteButton}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'orders' && (
        <div style={styles.section}>
          <h3 style={styles.sectionHeader}>Manage Orders</h3>
          <form onSubmit={handleOrderSubmit} style={styles.form}>
            <select
              value={orderForm.userId}
              onChange={(e) => setOrderForm({ ...orderForm, userId: e.target.value })}
              style={styles.input}
              required
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.email}
                </option>
              ))}
            </select>
            {orderForm.items.map((item, index) => (
              <div key={index} style={styles.itemRow}>
                <select
                  value={item.productId}
                  onChange={(e) => updateOrderItem(index, 'productId', e.target.value)}
                  style={styles.input}
                  required
                >
                  <option value="">Select Product</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} (${p.price})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => updateOrderItem(index, 'quantity', Number(e.target.value))}
                  style={styles.input}
                  min="1"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeOrderItem(index)}
                  style={styles.deleteButton}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addOrderItem} style={styles.button}>
              Add Item
            </button>
            <select
              value={orderForm.status}
              onChange={(e) => setOrderForm({ ...orderForm, status: e.target.value })}
              style={styles.input}
              required
            >
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button type="submit" style={styles.button}>
              {orderForm.id ? 'Update Order' : 'Add Order'}
            </button>
            {orderForm.id && (
              <button
                type="button"
                onClick={() => setOrderForm({ id: '', userId: '', items: [{ productId: '', quantity: 1 }], status: 'Pending' })}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            )}
          </form>

          <h4 style={styles.listHeader}>Orders</h4>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Items</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td style={styles.td}>{order.user?.email || 'Unknown User'}</td>
                  <td style={styles.td}>
                    {order.items.map((item, index) => (
                      <div key={index}>
                        {item.product.name} x {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td style={styles.td}>${order.total.toFixed(2)}</td>
                  <td style={styles.td}>{order.status}</td>
                  <td style={styles.td}>
                    <button onClick={() => editOrder(order)} style={styles.actionButton}>
                      Edit
                    </button>
                    <button onClick={() => deleteOrder(order._id)} style={styles.deleteButton}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    fontSize: '2rem',
    color: '#333',
    textAlign: 'center'
  },
  subHeader: {
    fontSize: '1.2rem',
    color: '#666',
    textAlign: 'center',
    marginBottom: '20px'
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '15px'
  },
  tabContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  tab: {
    padding: '10px 20px',
    background: '#f0f0f0',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  activeTab: {
    padding: '10px 20px',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  section: {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  sectionHeader: {
    fontSize: '1.5rem',
    color: '#333',
    marginBottom: '15px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '20px'
  },
  input: {
    padding: '10px',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '5px'
  },
  textarea: {
    padding: '10px',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    minHeight: '100px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  button: {
    padding: '10px',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  cancelButton: {
    padding: '10px',
    background: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  listHeader: {
    fontSize: '1.2rem',
    color: '#333',
    margin: '15px 0'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    padding: '10px',
    background: '#f0f0f0',
    border: '1px solid #ddd',
    textAlign: 'left'
  },
  td: {
    padding: '10px',
    border: '1px solid #ddd'
  },
  actionButton: {
    padding: '5px 10px',
    background: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '5px'
  },
  deleteButton: {
    padding: '5px 10px',
    background: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  itemRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  }
};

export default AdminDashboard;