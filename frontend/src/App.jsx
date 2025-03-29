import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './components/home/Home';
import Products from './components/products/Products';
import ProductDetail from './components/products/ProductDetail';
import Cart from './components/cart/Cart';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/user/Profile';
import Dashboard from './components/dashboard/Dashboard';
import ColdStorage from './components/coldStorage/ColdStorage';
import BulkBuy from './components/bulkBuy/BulkBuy';
import Orders from './components/orders/Orders';
import ChatbotDialog from './components/chatbot/ChatbotDialog';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cold-storage" element={<ColdStorage />} />
            <Route path="/bulk-buy" element={<BulkBuy />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </main>
        <Footer />
        <ChatbotDialog />
      </div>
    </Router>
  );
}

export default App;
