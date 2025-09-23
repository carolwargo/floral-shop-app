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
import Nav from './components/Nav/Nav';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Test from './pages/Test/Test'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav />
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
          <Route path='/test' element={<Test/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;