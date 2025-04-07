import React from 'react';
import { useCart } from '../../context/CartContext';
import { FaShoppingCart, FaLeaf, FaRupeeSign } from 'react-icons/fa';

const CartSummary = ({ isSubmitting, handleSubmit }) => {
  const { cart, getCartTotal } = useCart();
  const totalAmount = getCartTotal();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-green-700 text-white p-4 flex items-center">
        <FaShoppingCart className="mr-2" />
        <h2 className="text-xl font-semibold">Your Cart</h2>
      </div>
      
      <div className="p-4 max-h-[60vh] overflow-y-auto">
        {cart.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FaLeaf className="mx-auto text-4xl mb-2 text-green-500" />
            <p>Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item._id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-green-100">
                      <FaLeaf className="text-green-500 text-xl" />
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="font-medium text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  <p className="text-green-700 font-medium">
                    <FaRupeeSign className="inline" />
                    {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium text-gray-700">Total Amount:</span>
          <span className="text-xl font-bold text-green-700">
            <FaRupeeSign className="inline" />
            {totalAmount.toFixed(2)}
          </span>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || cart.length === 0}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white flex items-center justify-center ${
            isSubmitting || cart.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <FaLeaf className="mr-2" />
              Place Order
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CartSummary; 