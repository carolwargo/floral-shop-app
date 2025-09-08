import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', stock: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) navigate('/login');
    fetchProducts();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch products');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingId) {
        await axios.put(`http://localhost:5000/api/products/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/products', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setForm({ name: '', price: '', stock: '' });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setForm({ name: product.name, price: product.price, stock: product.stock });
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete product');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Admin - Manage Inventory</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="p-2 w-full border rounded"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="p-2 w-full border rounded"
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          className="p-2 w-full border rounded"
          required
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded w-full">
          {editingId ? 'Update Product' : 'Add Product'}
        </button>
      </form>
      <h3 className="text-xl font-semibold mb-2">Inventory</h3>
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded shadow flex justify-between">
            <p>{product.name} - ${product.price.toFixed(2)} - Stock: {product.stock}</p>
            <div>
              <button
                onClick={() => handleEdit(product)}
                className="mr-2 p-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="p-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;