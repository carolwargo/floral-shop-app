import { useState, useEffect } from 'react';
import axios from 'axios';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/orders/history', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setOrders(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load orders');
      }
    };
    fetchOrders();
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Order History</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
            <p>Order ID: {order._id}</p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p>Total: ${order.total.toFixed(2)}</p>
            <h3>Items:</h3>
            {order.items.map((item) => (
              <p key={item._id}>{item.name} x {item.quantity}: ${(item.price * item.quantity).toFixed(2)}</p>
            ))}
            <p>Status: {order.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default OrderHistory;