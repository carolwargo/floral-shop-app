import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

function Cart() {
  const { cart } = useContext(AuthContext);

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cart.items.map((item) => (
            <div key={item._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
              <h3>{item.productId.name}</h3>
              <p>Price: ${item.productId.price}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Total: ${(item.productId.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <p>Grand Total: ${cart.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0).toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

export default Cart;