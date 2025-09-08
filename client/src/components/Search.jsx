import { useState, useEffect } from 'react';
import axios from 'axios';

function Search({ onResults }) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products?search=${searchTerm}`);
        onResults(res.data);
      } catch (err) {
        console.error('Search error:', err);
      }
    };
    const timeout = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm, onResults]);

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 w-full border rounded"
      />
    </div>
  );
}

export default Search;