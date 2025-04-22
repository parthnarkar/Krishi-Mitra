import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart, FaLeaf, FaStar, FaTruck, FaBox, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { getProductById } from '../utils/productApi';
import { useCart } from '../context/CartContext';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const { addToCart, isInCart, getItemQuantity } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
        
        if (isInCart(data._id)) {
          setQuantity(getItemQuantity(data._id));
        }
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isInCart, getItemQuantity]);

  const handleAddToCart = () => {
    if (!product.seller || !product.seller._id) {
      console.error('Missing seller information for product:', product.name);
      return;
    }
    
    addToCart(product, quantity);
    showToastMessage('Added to cart!');
  };

  const showToastMessage = (message) => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-green-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaBox className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <Link to="/products" className="mt-6 inline-flex items-center text-green-600 hover:text-green-700 transition-colors duration-300">
            <FaArrowLeft className="mr-2" /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-green-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaBox className="h-8 w-8 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <Link to="/products" className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors duration-300">
            <FaArrowLeft className="mr-2" /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-green-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/products"
          className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors duration-300 mb-8 group"
        >
          <FaArrowLeft className="mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" /> Back to Products
        </Link>

        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-t-4 border-green-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative h-96 rounded-xl overflow-hidden shadow-md group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              {product.isOrganic && (
                <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                  Organic
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-amber-100 px-3 py-1 rounded-full flex items-center">
                  <FaStar className="text-amber-600 mr-1" />
                  <span className="text-amber-800 font-medium">{product.rating} ({product.reviews} reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center mb-6">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <FaLeaf className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-gray-600">by {product.seller?.name || 'Unknown Seller'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaMapMarkerAlt className="mr-2 text-amber-600" />
                    <span className="text-sm">Location</span>
                  </div>
                  <p className="font-medium text-gray-800">{product.seller?.location || 'Unknown'}</p>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaCalendarAlt className="mr-2 text-amber-600" />
                    <span className="text-sm">Harvest Date</span>
                  </div>
                  <p className="font-medium text-gray-800">{product.harvestDate || 'Not specified'}</p>
                </div>
              </div>

              <div className="text-3xl font-bold text-green-600 mb-6 bg-green-50 p-4 rounded-xl border border-green-200">
                ₹{product.price}
                <span className="text-sm font-normal text-gray-600 ml-2">per {product.unit}</span>
              </div>

              <div className="flex items-center text-gray-600 mb-8 bg-blue-50 p-4 rounded-xl border border-blue-200">
                <FaTruck className="mr-3 text-blue-600" />
                <span>Available Stock: {product.quantity} {product.unit}</span>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-200">{product.description}</p>
              </div>

              <div className="flex items-center gap-4 mb-8 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <label className="text-gray-700 font-medium">Quantity:</label>
                <div className="flex items-center border border-amber-300 rounded-lg bg-white">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-4 py-2 text-amber-600 hover:bg-amber-50 transition-colors duration-300"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-amber-300 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))}
                    className="px-4 py-2 text-amber-600 hover:bg-amber-50 transition-colors duration-300"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full py-4 px-6 text-lg rounded-xl shadow-lg hover:shadow-xl bg-green-600 hover:bg-green-700 text-white flex items-center justify-center transition-all duration-300 transform hover:scale-[1.02]"
              >
                <FaShoppingCart className="mr-2" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in-up">
          Added to cart!
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage; 