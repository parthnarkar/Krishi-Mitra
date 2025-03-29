import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { negotiationService } from '../services/negotiationService';
import axios from 'axios';

const BulkBuyPage = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(100);
  const [negotiatedPrice, setNegotiatedPrice] = useState(90);
  const [originalPrice] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [negotiations, setNegotiations] = useState([]);
  const [products, setProducts] = useState([]);

  const quantityOptions = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
  const discountOptions = [
    { label: '5% Off', value: 95 },
    { label: '10% Off', value: 90 },
    { label: '15% Off', value: 85 },
    { label: '20% Off', value: 80 },
    { label: '25% Off', value: 75 },
    { label: '30% Off', value: 70 },
    { label: '40% Off', value: 60 },
    { label: '50% Off', value: 50 },
  ];

  const handleQuantitySelect = (value) => {
    setQuantity(value);
  };

  const handleDiscountSelect = (value) => {
    setNegotiatedPrice(value);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const negotiationData = {
        productId: 'PROD001',
        quantity,
        originalPrice,
        negotiatedPrice,
        paymentMethod: selectedPaymentMethod,
        deliveryDate,
        notes,
      };

      await negotiationService.submitNegotiation(negotiationData);
      alert('Negotiation submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit negotiation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const discountPercentage = ((originalPrice - negotiatedPrice) / originalPrice) * 100;

  useEffect(() => {
    // Fetch bulk buy negotiations and available products
    const fetchData = async () => {
      try {
        const [negotiationsRes, productsRes] = await Promise.all([
          axios.get('/api/bulk-buy/negotiations'),
          axios.get('/api/bulk-buy/products')
        ]);
        setNegotiations(negotiationsRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error('Error fetching bulk buy data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section with Navigation */}
          <div className="text-center mb-12">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-primary">Bulk Buy</h1>
              <button
                onClick={() => navigate('/cold-storage')}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                Cold Storage
              </button>
            </div>
            <p className="text-gray-600">Negotiate prices for bulk purchases</p>
          </div>

          {/* Main Card */}
          <div className="max-w-4xl mx-auto">
            {/* Product Info */}
            <div className="mb-8 bg-gray-50 rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-6 text-primary">Product Details</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-gray-500 mb-2">Product Name</p>
                  <p className="font-semibold text-lg">Premium Product</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-gray-500 mb-2">Category</p>
                  <p className="font-semibold text-lg">Electronics</p>
                </div>
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="mb-8 bg-gray-50 rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-6 text-primary">Select Quantity</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {quantityOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleQuantitySelect(option)}
                    className={`p-4 rounded-lg transition-all duration-200 ${
                      quantity === option
                        ? 'bg-primary text-white shadow-lg scale-105'
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    {option} units
                  </button>
                ))}
              </div>
              <div className="mt-4 text-center">
                <span className="text-xl font-bold text-primary">Selected: {quantity} units</span>
              </div>
            </div>

            {/* Price Negotiation */}
            <div className="mb-8 bg-gray-50 rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-6 text-primary">Price Negotiation</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-gray-500">Original Price</span>
                  <span className="text-xl font-bold text-gray-700">₹{originalPrice}/unit</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {discountOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleDiscountSelect(option.value)}
                      className={`p-4 rounded-lg transition-all duration-200 ${
                        negotiatedPrice === option.value
                          ? 'bg-secondary text-white shadow-lg scale-105'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-semibold">{option.label}</div>
                      <div className="text-sm">₹{option.value}/unit</div>
                    </button>
                  ))}
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-600 font-semibold">
                    You're getting {discountPercentage.toFixed(1)}% discount!
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div className="mb-8 bg-gray-50 rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-6 text-primary">Additional Options</h2>
              <div className="space-y-6">
                {/* Payment Method */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 gap-4">
                    {['UPI', 'Bank Transfer', 'Credit Card', 'Cash on Delivery'].map((method) => (
                      <button
                        key={method}
                        onClick={() => setSelectedPaymentMethod(method)}
                        className={`p-4 rounded-lg transition-all duration-200 ${
                          selectedPaymentMethod === method
                            ? 'bg-primary text-white shadow-lg scale-105'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delivery Date */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Preferred Delivery Date</label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Additional Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows="3"
                    placeholder="Any special requirements or notes..."
                  />
                </div>
              </div>
            </div>

            {/* Total Calculation */}
            <div className="mb-8 bg-gray-50 rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-6 text-primary">Total Calculation</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-gray-500">Original Total</span>
                  <span className="text-xl font-bold text-gray-700">₹{originalPrice * quantity}</span>
                </div>
                <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-gray-500">Negotiated Total</span>
                  <span className="text-xl font-bold text-secondary">₹{negotiatedPrice * quantity}</span>
                </div>
                <div className="flex justify-between items-center bg-green-50 p-4 rounded-lg">
                  <span className="text-gray-700 font-semibold">Total Savings</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₹{(originalPrice - negotiatedPrice) * quantity}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedPaymentMethod || !deliveryDate}
                className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-opacity-90 transition-all duration-200 font-semibold flex items-center shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
};

export default BulkBuyPage; 