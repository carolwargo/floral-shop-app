//pages/Shop.jsx
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import ProductCard from '../components/ProductCard/ProductCard.jsx'; // ← ADD THIS IMPORT
import '../Shop.css';

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart, user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (error) {
        console.error('Fetch products error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId, quantity) => {
    if (!addToCart || !user) {
      alert('Please log in to add items to cart');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    
    try {
      await addToCart(productId, quantity);
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="shop-loading-container">
        <div className="shop-loading-spinner"></div>
        <p className="shop-loading-text">Loading our collection...</p>
      </div>
    );
  }

  return (
    <main className="shop-container">
      {/* Header with Search */}
      <header className="shop-header">
        <h1 className="shop-title">Our Collection</h1>
        <form className="shop-search-form" role="search" onSubmit={(e) => {
          e.preventDefault();
          // Handle search - could navigate to search page
        }}>
          <label htmlFor="shop-search" className="sr-only">Search products</label>
          <div className="shop-search-container">
            <input
              id="shop-search"
              type="search"
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="shop-search-input"
            />
            <button type="submit" className="shop-search-button" aria-label="Search">
              ⌕
            </button>
          </div>
        </form>
      </header>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="shop-empty-state">
          <div className="shop-empty-icon">🌸</div>
          <h2 className="shop-empty-title">
            {searchQuery ? `No results for "${searchQuery}"` : 'No products available'}
          </h2>
          <p className="shop-empty-subtitle">
            {searchQuery ? 'Try a different search term' : 'Check back soon for new arrivals'}
          </p>
          <Link to="/shop" className="shop-empty-button">
            Browse All Products
          </Link>
        </div>
      ) : (
        <section className="shop-products-section">
          <div className="shop-products-grid">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                onAddToCart={handleAddToCart} 
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default Shop;