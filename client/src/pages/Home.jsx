import { useState, useEffect } from 'react';
import axios from 'axios';
import Search from '../components/Search'; // Confirm this path

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
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded shadow">
            <p className="text-lg">{product.name} - ${product.price.toFixed(2)} - Stock: {product.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;