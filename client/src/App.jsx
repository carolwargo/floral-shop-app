import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Shop from './pages/Shop/Shop';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import ProductDetail from './pages/ProductDetails/ProductDetail';
import Contact from './pages/Contact/Contact';
import Search from './components/Search/Search';
import HomeHeader from './components/HomeHeader/HomeHeader';  
import { AuthProvider } from './context/AuthContext';
import Nav from './components/Nav/Nav';



function App() {
  return (

    <AuthProvider>
      <BrowserRouter>
        <Nav />
        <HomeHeader />
        <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/cart" element={<Cart />} />
           <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/search" element={<Search />} />
        </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;