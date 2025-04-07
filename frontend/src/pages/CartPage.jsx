import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaArrowLeft, FaMinus, FaPlus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      showToastMessage('Item removed from cart');
    } else {
      updateQuantity(productId, newQuantity);
      showToastMessage('Cart updated');
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    showToastMessage('Item removed from cart');
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaShoppingCart className="mx-auto h-16 w-16 text-gray-400" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="mt-2 text-gray-600">Add some products to your cart to see them here.</p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-color hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-color"
            >
              <FaArrowLeft className="mr-2" /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const cartTotal = getCartTotal();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <Link
            to="/products"
            className="inline-flex items-center text-primary-color hover:text-primary-dark"
          >
            <FaArrowLeft className="mr-2" /> Continue Shopping
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex flex-col md:flex-row items-center gap-6 py-6 border-b last:border-b-0"
              >
                {/* Product Image */}
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <FaShoppingCart className="text-gray-400 text-2xl" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-gray-600">
                    by {item.seller?.name || 'Unknown Seller'}
                  </p>
                  <div className="mt-2 text-gray-600">
                    ₹{Number(item.price).toFixed(2)}
                    <span className="text-sm">/{item.unit || 'unit'}</span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                      aria-label="Decrease quantity"
                    >
                      <FaMinus className="text-xs" />
                    </button>
                    <span className="px-4 py-2 border-x min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                      aria-label="Increase quantity"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50"
                    aria-label="Remove item"
                  >
                    <FaTrash />
                  </button>
                </div>

                {/* Item Total */}
                <div className="text-lg font-semibold text-gray-900 min-w-[100px] text-right">
                  ₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-gray-50 px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <p className="text-gray-600">
                  Total Items: <span className="font-semibold">{cart.reduce((total, item) => total + Number(item.quantity), 0)}</span>
                </p>
              </div>
              <div className="flex justify-between items-center w-full md:w-auto gap-4">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="btn btn-outline flex-1 py-3 text-center"
              >
                Continue Shopping
              </Link>
              <Link
                to="/checkout"
                className="btn btn-primary flex-1 py-3 text-center"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default CartPage; 