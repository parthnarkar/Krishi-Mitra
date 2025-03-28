import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";

function App() {
  const isAuthenticated = !!localStorage.getItem("token"); 

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<AuthPage isLogin={true} />} />
        <Route path="/register" element={<AuthPage isLogin={false} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
