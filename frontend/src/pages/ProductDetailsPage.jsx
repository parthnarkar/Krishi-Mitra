import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart, FaLeaf, FaStar, FaTruck } from 'react-icons/fa';
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
        
        // Set initial quantity if product is already in cart
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
    console.log('Product being added to cart:', product);
    
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <Link to="/products" className="mt-4 inline-flex items-center text-primary-color hover:text-primary-dark">
            <FaArrowLeft className="mr-2" /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <Link to="/products" className="inline-flex items-center text-primary-color hover:text-primary-dark">
            <FaArrowLeft className="mr-2" /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/products"
          className="inline-flex items-center text-primary-color hover:text-primary-dark mb-8"
        >
          <FaArrowLeft className="mr-2" /> Back to Products
        </Link>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative h-96 rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 badge badge-primary px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                Fresh
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1 mb-4">
                <FaStar className="text-yellow-400" />
                <span className="text-gray-600">{product.rating}</span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <p className="text-gray-600 mb-6">by {product.seller?.name || 'Unknown Seller'}</p>

              <div className="flex items-center text-gray-600 mb-6">
                <FaLeaf className="mr-2 text-primary-color" />
                {product.category}
              </div>

              <div className="text-3xl font-bold text-gray-900 mb-6">
                ₹{product.price}
                <span className="text-sm font-normal text-gray-600">/{product.unit}</span>
              </div>

              <div className="flex items-center text-gray-600 mb-8">
                <FaTruck className="mr-2" />
                <span>Available: {product.quantity} {product.unit}</span>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <label className="text-gray-700">Quantity:</label>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn btn-primary w-full py-4 text-lg rounded-lg shadow-lg hover:shadow-xl flex items-center justify-center"
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
        <div className="fixed top-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up">
          Added to cart!
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage; 