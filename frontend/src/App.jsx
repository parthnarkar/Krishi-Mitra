import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';

// Import the components
import PaymentPage from './pages/PaymentPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="main-header">
          <div className="logo">KrishiMitra</div>
          <nav className="main-nav">
            <Link to="/marketplace">Marketplace</Link>
            <Link to="/services">Services</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            {/* Redirect root to marketplace */}
            <Route path="/" element={<Navigate to="/marketplace" replace />} />
            
            {/* Payment route now expects an orderId query parameter */}
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
            
            {/* Add other routes here */}
            <Route path="*" element={<Navigate to="/marketplace" />} />
          </Routes>
        </main>

        <footer className="main-footer">
          <p>&copy; {new Date().getFullYear()} KrishiMitra. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;