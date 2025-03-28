import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BulkBuyPage = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(100);
  const [negotiatedPrice, setNegotiatedPrice] = useState(90);
  const [originalPrice] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  const handlePriceChange = (e) => {
    setNegotiatedPrice(Number(e.target.value));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:3001/api/negotiations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: 'PROD001',
          quantity,
          originalPrice,
          negotiatedPrice,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit negotiation');
      
      alert('Negotiation submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit negotiation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-primary mb-8">Bulk Purchase</h1>
          
          {/* Product Info */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Product Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Product Name</p>
                <p className="font-semibold">Premium Product</p>
              </div>
              <div>
                <p className="text-gray-500">Category</p>
                <p className="font-semibold">Electronics</p>
              </div>
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Select Quantity</h2>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="100"
                max="1000"
                step="100"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-lg font-semibold text-primary min-w-[80px]">{quantity} units</span>
            </div>
          </div>

          {/* Price Negotiation */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Price Negotiation</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Original Price</span>
                <span className="text-lg font-semibold text-gray-700">₹{originalPrice}/unit</span>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="50"
                  max={originalPrice}
                  step="5"
                  value={negotiatedPrice}
                  onChange={handlePriceChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-lg font-semibold text-secondary min-w-[80px]">₹{negotiatedPrice}/unit</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>50% off</span>
                <span>Original Price</span>
              </div>
            </div>
          </div>

          {/* Total Calculation */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Total Calculation</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Original Total</span>
                <span className="font-semibold">₹{originalPrice * quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Negotiated Total</span>
                <span className="font-semibold text-secondary">₹{negotiatedPrice * quantity}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-500">Total Savings</span>
                <span className="font-bold text-green-600">
                  ₹{(originalPrice - negotiatedPrice) * quantity}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Negotiation'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkBuyPage; 