import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './components/home/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import Profile from './components/user/Profile';
import ColdStorage from './components/coldStorage/ColdStorage';
import BulkBuy from './components/bulkBuy/BulkBuy';
import Orders from './components/orders/Orders';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ArticleDetail from './components/about/ArticleDetail';
import ScrollToTop from './components/utils/ScrollToTop';
import articles from './data/articles';
import { CartProvider } from './context/CartContext';
import ChatbotButton from './components/chatbot/ChatbotButton';
import './App.css';

const App = () => {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <div className="app min-h-screen flex flex-col bg-neutral-50">
          <Navbar />
          <main className="main-content flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/cold-storage" element={<ColdStorage />} />
              <Route path="/bulk-buy" element={<BulkBuy />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/about/article/:id" element={<ArticleDetail articles={articles} />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </main>
          <Footer />
          <ChatbotButton />
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;
