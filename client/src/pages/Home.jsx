import { useState, useEffect } from 'react';
import axios from 'axios';
import Search from '../components/Search';

function Home() {
  const [products, setProducts] = useState([]);

  const handleSearchResults = (results) => {
    setProducts(results);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Fetch products error:', err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <Search onResults={handleSearchResults} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded shadow">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-2" />
            <p className="text-lg font-semibold">{product.name}</p>
            <p>${product.price.toFixed(2)}</p>
            <p>{product.description}</p>
            <p>Stock: {product.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
    