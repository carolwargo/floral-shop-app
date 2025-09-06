import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

function Shop() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(AuthContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (error) {
        console.error('Fetch products error:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Shop</h2>
      <div>
        {products.map((product) => (
          <div key={product._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            <p>{product.description}</p>
            <img src={product.image} alt={product.name} style={{ maxWidth: '100px' }} />
            <button onClick={() => addToCart(product._id, 1)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shop;