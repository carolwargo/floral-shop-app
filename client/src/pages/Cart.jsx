import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import axios from 'axios';

function Cart() {
  const { cart, fetchCart } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState({}); // Track which item is being updated

  // Delete item from cart
  const handleDeleteItem = async (itemId) => {
    if (!confirm('Are you sure you want to remove this item from your cart?')) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/cart/${itemId}`, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
      });
      
      // Refresh cart after deletion
      await fetchCart();
      
      // Optional: Show success message
      // You could add a toast notification here
    } catch (error) {
      console.error('Error deleting cart item:', error);
      alert('Failed to remove item from cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity in cart
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    // Prevent negative or zero quantity
    if (newQuantity < 1) {
      handleDeleteItem(itemId);
      return;
    }

    setUpdating(prev => ({ ...prev, [itemId]: true }));
    
    try {
      await axios.put(
        `http://localhost:5000/api/cart/${itemId}`, 
        { quantity: newQuantity },
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
        }
      );
      
      // Refresh cart after update
      await fetchCart();
      
    } catch (error) {
      console.error('Error updating cart item:', error);
      alert('Failed to update cart item. Please try again.');
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  // Calculate grand total
  const grandTotal = cart.items.reduce((sum, item) => {
    return sum + (item.productId?.price * item.quantity || 0);
  }, 0);

  // Check if user is logged in
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Your Cart</h2>
        <div style={styles.emptyCart}>
          <p style={styles.emptyMessage}>Please <button 
            onClick={() => navigate('/login')} 
            style={styles.loginButton}
          >
            log in
          </button> to view your cart</p>
          <button 
            onClick={() => navigate('/shop')} 
            style={styles.continueShopping}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Your Cart</h2>
      
      {cart.items.length === 0 ? (
        <div style={styles.emptyCart}>
          <p style={styles.emptyMessage}>Your cart is empty</p>
          <div style={styles.emptyActions}>
            <button 
              onClick={() => navigate('/shop')} 
              style={styles.continueShopping}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.cartContent}>
          {/* Cart Items */}
          <div style={styles.itemsContainer}>
            {cart.items.map((item) => {
              const itemTotal = item.productId?.price * item.quantity || 0;
              const isUpdating = updating[item._id];

              return (
                <div key={item._id} style={styles.cartItem}>
                  <div style={styles.itemImageContainer}>
                    <img 
                      src={item.productId?.image || 'https://placekitten.com/80/80'} 
                      alt={item.productId?.name} 
                      style={styles.itemImage}
                      onError={(e) => {
                        e.target.src = 'https://placekitten.com/80/80';
                      }}
                    />
                  </div>
                  
                  <div style={styles.itemDetails}>
                    <div style={styles.itemHeader}>
                      <h3 style={styles.itemName}>{item.productId?.name}</h3>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        disabled={loading || isUpdating}
                        style={{
                          ...styles.deleteButton,
                          opacity: loading || isUpdating ? 0.6 : 1,
                          cursor: loading || isUpdating ? 'not-allowed' : 'pointer'
                        }}
                        title="Remove from cart"
                      >
                        {loading ? '⏳' : '🗑️'}
                      </button>
                    </div>
                    
                    <p style={styles.itemPrice}>${item.productId?.price?.toFixed(2) || '0.00'}</p>
                    
                    <div style={styles.quantityContainer}>
                      <label style={styles.quantityLabel}>Quantity:</label>
                      <div style={styles.quantityControls}>
                        <button
                          onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                          disabled={isUpdating || item.quantity <= 1 || loading}
                          style={{
                            ...styles.quantityButton,
                            opacity: (isUpdating || item.quantity <= 1 || loading) ? 0.6 : 1,
                            cursor: (isUpdating || item.quantity <= 1 || loading) ? 'not-allowed' : 'pointer'
                          }}
                        >
                          −
                        </button>
                        
                        <span style={styles.quantityDisplay}>
                          {isUpdating ? '...' : item.quantity}
                        </span>
                        
                        <button
                          onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                          disabled={isUpdating || loading}
                          style={{
                            ...styles.quantityButton,
                            opacity: (isUpdating || loading) ? 0.6 : 1,
                            cursor: (isUpdating || loading) ? 'not-allowed' : 'pointer'
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <p style={styles.itemTotal}>
                      Subtotal: ${itemTotal.toFixed(2)}
                    </p>
                  </div>
                  
                  {isUpdating && (
                    <div style={styles.updatingOverlay}>
                      <span style={styles.updatingText}>Updating...</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div style={styles.summaryContainer}>
            <div style={styles.summarySection}>
              <h3 style={styles.summaryTitle}>Order Summary</h3>
              <div style={styles.summaryDetails}>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Subtotal ({cart.items.length} items):</span>
                  <span style={styles.summaryValue}>${grandTotal.toFixed(2)}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Shipping:</span>
                  <span style={styles.summaryValue}>FREE</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Tax:</span>
                  <span style={styles.summaryValue}>${(grandTotal * 0.08).toFixed(2)}</span>
                </div>
                <div style={styles.summaryDivider}></div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabelTotal}>Total:</span>
                  <span style={styles.summaryValueTotal}>${(grandTotal * 1.08).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              disabled={loading || cart.items.length === 0}
              style={{
                ...styles.checkoutButton,
                opacity: (loading || cart.items.length === 0) ? 0.6 : 1,
                cursor: (loading || cart.items.length === 0) ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Processing...' : `Proceed to Checkout - $${(grandTotal * 1.08).toFixed(2)}`}
            </button>

            <button 
              onClick={() => navigate('/shop')}
              style={styles.continueShopping}
              disabled={loading}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#F8F9FA',
    minHeight: 'calc(100vh - 80px)',
  },
  title: {
    fontSize: '2.5rem',
    color: '#005c00ff',
    textAlign: 'center',
    marginBottom: '30px',
    fontWeight: '600',
  },
  emptyCart: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  emptyMessage: {
    fontSize: '1.2rem',
    color: '#6C757D',
    marginBottom: '20px',
    fontStyle: 'italic',
  },
  emptyActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    flexWrap: 'wrap',
  },
  loginButton: {
    background: 'none',
    border: 'none',
    color: '#005c00ff',
    fontSize: '1.2rem',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: '0',
    margin: '0 5px',
  },
  continueShopping: {
    padding: '12px 30px',
    backgroundColor: '#6C757D',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    display: 'inline-block',
  },
  cartContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  itemsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  cartItem: {
    display: 'flex',
    gap: '15px',
    padding: '20px',
    marginBottom: '15px',
    backgroundColor: '#F8F9FA',
    borderRadius: '8px',
    border: '1px solid #E9ECEF',
    position: 'relative',
    transition: 'all 0.3s ease',
  },
  itemImageContainer: {
    flexShrink: 0,
  },
  itemImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '1px solid #E9ECEF',
  },
  itemDetails: {
    flex: 1,
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
  },
  itemName: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#000000',
    margin: '0',
    flex: 1,
  },
  itemPrice: {
    fontSize: '1.1rem',
    color: '#005c00ff',
    fontWeight: '700',
    margin: '5px 0 15px 0',
  },
  quantityContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '15px',
  },
  quantityLabel: {
    fontWeight: '500',
    color: '#495057',
    minWidth: '70px',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    border: '2px solid #E9ECEF',
    borderRadius: '25px',
    padding: '5px',
    backgroundColor: '#FFFFFF',
  },
  quantityButton: {
    width: '32px',
    height: '32px',
    border: 'none',
    borderRadius: '50%',
    backgroundColor: '#005c00ff',
    color: '#FFFFFF',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  // Removed invalid pseudo-selector quantityButton:hover
  quantityDisplay: {
    fontWeight: '600',
    color: '#005c00ff',
    minWidth: '25px',
    textAlign: 'center',
  },
  itemTotal: {
    fontSize: '1.1rem',
    color: '#005c00ff',
    fontWeight: '700',
    margin: '0',
  },
  deleteButton: {
    backgroundColor: '#DC3545',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    flexShrink: 0,
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Removed invalid pseudo-selector deleteButton:hover
  updatingText: {
    backgroundColor: '#005c00ff',
    color: '#FFFFFF',
    padding: '8px 16px',
    borderRadius: '20px',
    fontWeight: '600',
  },
  summaryContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  summarySection: {
    backgroundColor: '#FFFFFF',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  summaryTitle: {
    fontSize: '1.5rem',
    color: '#005c00ff',
    marginBottom: '20px',
    fontWeight: '600',
  },
  summaryDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
  },
  summaryLabel: {
    fontSize: '1rem',
    color: '#495057',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: '1rem',
    color: '#000000',
    fontWeight: '500',
  },
  summaryLabelTotal: {
    fontSize: '1.1rem',
    color: '#005c00ff',
    fontWeight: '700',
  },
  summaryValueTotal: {
    fontSize: '1.3rem',
    color: '#005c00ff',
    fontWeight: '700',
  },
  summaryDivider: {
    height: '1px',
    backgroundColor: '#E9ECEF',
    margin: '8px 0',
  },
  checkoutButton: {
    padding: '18px 30px',
    backgroundColor: '#005c00ff',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    width: '100%',
  },
};

export default Cart;  