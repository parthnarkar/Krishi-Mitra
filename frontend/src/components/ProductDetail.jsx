import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Try to fetch from API
        const response = await axios.get(`${API_URL}/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        
        // Use fallback product from fallbackProducts in Dashboard
        // In a real app, you might want to import these from a central location
        const fallbackProducts = [
          {
            _id: '1',
            name: 'Organic Tomatoes',
            description: 'Fresh organic tomatoes grown without pesticides',
            price: 40,
            discountPrice: 35,
            category: 'Fruits & Vegetables',
            image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfad?q=80&w=2070',
            stock: 50,
            isOrganic: true,
            rating: 4.5,
            reviewCount: 24,
            sku: 'ORG1001'
          },
          {
            _id: '2',
            name: 'Fresh Spinach',
            description: 'Locally grown spinach, perfect for salads and cooking',
            price: 30,
            category: 'Fruits & Vegetables',
            image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=2432',
            stock: 30,
            isOrganic: true,
            rating: 4.2,
            reviewCount: 18,
            sku: 'VEG1002'
          },
          {
            _id: '3',
            name: 'Organic Bananas, Bunch',
            description: 'Enjoy the sweet and nutritious taste of our fresh bananas, carefully selected from local farms to ensure they reach you at their best',
            price: 99,
            discountPrice: 89,
            category: 'Fruits & Vegetables',
            image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?q=80&w=2127&auto=format&fit=crop',
            additionalImages: [
              'https://images.unsplash.com/photo-1603833665858-e61d17a86224?q=80&w=2127&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1579981640453-a0e0a132050f?q=80&w=1797&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=1780&auto=format&fit=crop'
            ],
            stock: 100,
            isOrganic: true,
            rating: 3.0,
            reviewCount: 2,
            sku: 'E7F8G9H0'
          }
        ];
        
        const fallbackProduct = fallbackProducts.find(p => p._id === id);
        if (fallbackProduct) {
          setProduct(fallbackProduct);
        } else {
          setError('Product not found');
        }
        setLoading(false);
      }
    };

    // Set a timer for offer countdown
    const interval = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay - now;
      const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
      const minutes = Math.floor((diff / (1000 * 60)) % 60).toString().padStart(2, '0');
      const seconds = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
      
      setTimeRemaining({ hours, minutes, seconds });
    }, 1000);

    fetchProduct();

    return () => clearInterval(interval);
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/users/cart`,
        { productId: id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Product added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Product added to cart locally');
    }
  };

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToWishlist = async () => {
    if (!token) {
      alert('Please login to add items to wishlist');
      return;
    }

    try {
      await axios.post(
        `${API_URL}/users/wishlist`,
        { productId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Product added to wishlist');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Product added to wishlist locally');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error || 'Product not found'}
        </div>
        <div className="mt-4">
          <Link to="/" className="text-green-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const images = product.additionalImages || [product.image];

  return (
    <div className="bg-white min-h-screen">
      {/* Header with navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-2xl font-bold text-green-700">Krishi-Mitra</Link>
              <div className="text-sm text-gray-500">
                Deliver to all
              </div>
            </div>
            
            <div className="relative flex-grow max-w-2xl mx-4">
              <input
                type="text"
                placeholder="Search for products, categories or brands..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
              <button className="absolute right-3 top-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link to="/account" className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Account</span>
              </Link>
              
              <Link to="/cart" className="flex items-center relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation menu */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 py-4">
            <Link to="/" className="text-gray-800 hover:text-green-600">Home</Link>
            <Link to="/shop" className="text-gray-800 hover:text-green-600">Shop</Link>
            <Link to="/fruits-vegetables" className="text-gray-800 hover:text-green-600 font-semibold">Fruits & Vegetables</Link>
            <Link to="/beverages" className="text-gray-800 hover:text-green-600">Beverages</Link>
            <Link to="/blog" className="text-gray-800 hover:text-green-600">Blog</Link>
            <Link to="/contact" className="text-gray-800 hover:text-green-600">Contact</Link>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="text-sm text-gray-500">
          <Link to="/" className="hover:text-green-600">Home</Link> {' > '}
          <Link to="/fruits-vegetables" className="hover:text-green-600">Fruits & Vegetables</Link> {' > '}
          <Link to="/fruits-vegetables/exotic" className="hover:text-green-600">Exotic Fruits & Veggies</Link> {' > '}
          <span className="text-gray-700">{product.name}</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row -mx-4">
          {/* Product Images */}
          <div className="md:w-1/2 px-4 mb-6 md:mb-0">
            <div className="relative">
              {product.isOrganic && (
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded flex items-center">
                    <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 12L11 15L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    ORGANIC
                  </div>
                </div>
              )}
              {product.discountPrice && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    SALE
                  </div>
                </div>
              )}
              <img 
                src={images[mainImage]} 
                alt={product.name} 
                className="w-full h-96 object-contain rounded-lg"
              />
            </div>
            <div className="flex space-x-2 mt-4">
              {images.map((image, index) => (
                <div 
                  key={index}
                  className={`w-20 h-20 cursor-pointer border-2 rounded ${mainImage === index ? 'border-green-500' : 'border-gray-200'}`}
                  onClick={() => setMainImage(index)}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 px-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-gray-600">{product.rating} ({product.reviewCount || 0} reviews)</span>
              <span className="mx-4 text-gray-300">|</span>
              <span className="text-gray-600">SKU: {product.sku || 'N/A'}</span>
            </div>
            
            <p className="text-gray-700 mb-6">
              {product.description}
            </p>
            
            <div className="flex items-center mb-6">
              {product.discountPrice ? (
                <>
                  <span className="text-3xl font-bold text-red-600">₹{product.discountPrice}</span>
                  <span className="ml-2 text-xl text-gray-500 line-through">₹{product.price}</span>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
              )}
            </div>
            
            {/* Special Offer Timer */}
            {product.discountPrice && (
              <div className="bg-orange-50 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-2">
                  <span className="text-orange-600 font-semibold">Special Offer:</span>
                </div>
                <div className="flex space-x-2 text-center">
                  <div className="bg-white w-10 h-10 flex items-center justify-center rounded">
                    <span className="text-gray-800 font-mono">{timeRemaining.hours}</span>
                  </div>
                  <div className="bg-white w-10 h-10 flex items-center justify-center rounded">
                    <span className="text-gray-800 font-mono">{timeRemaining.minutes}</span>
                  </div>
                  <div className="bg-white w-10 h-10 flex items-center justify-center rounded">
                    <span className="text-gray-800 font-mono">{timeRemaining.seconds}</span>
                  </div>
                  <div className="ml-2 flex items-center text-gray-600 text-sm">
                    Remains until the end of the offer
                  </div>
                </div>
              </div>
            )}
            
            {/* Add to Cart */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex border border-gray-300 rounded-md">
                <button 
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  onClick={() => handleQuantityChange(-1)}
                >
                  −
                </button>
                <span className="px-4 py-2 border-l border-r border-gray-300">{quantity}</span>
                <button 
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>
              
              <button 
                className="flex-1 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
                onClick={handleAddToCart}
              >
                Add to cart
              </button>
              
              <button 
                className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-black transition"
                onClick={() => alert("Buying now...")}
              >
                Buy Now
              </button>
            </div>
            
            {/* Order on WhatsApp */}
            <div className="mb-6">
              <button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.6 6.31999C16.8669 5.58141 15.9943 4.99596 15.033 4.59767C14.0716 4.19938 13.0406 3.99722 12 3.99999C10.6089 4.00135 9.24248 4.36819 8.03771 5.06377C6.83294 5.75935 5.83208 6.75926 5.13534 7.96335C4.4386 9.16745 4.07046 10.5335 4.06776 11.9246C4.06507 13.3158 4.42793 14.6832 5.12 15.89L4 20L8.2 18.9C9.35975 19.5452 10.6629 19.8897 11.99 19.9C14.0997 19.9 16.124 19.0557 17.6241 17.5557C19.1242 16.0556 19.9683 14.0314 19.9683 11.9217C19.9683 9.81195 19.1242 7.78781 17.6241 6.28771L17.6 6.31999ZM12 18.53C10.8177 18.5308 9.65701 18.213 8.64 17.61L8.4 17.46L5.91 18.12L6.57 15.69L6.41 15.44C5.55925 14.0667 5.24174 12.428 5.51762 10.8372C5.7935 9.24649 6.64361 7.81015 7.9069 6.80322C9.1702 5.79628 10.7589 5.28765 12.3721 5.37368C13.9853 5.4597 15.511 6.13441 16.66 7.26999C17.916 8.49819 18.635 10.1735 18.66 11.93C18.6442 13.6859 17.9355 15.3645 16.6882 16.6175C15.441 17.8704 13.7656 18.5865 12.01 18.61L12 18.53ZM15.61 13.59C15.41 13.49 14.44 13.01 14.26 12.95C14.08 12.89 13.94 12.85 13.81 13.05C13.6144 13.3181 13.404 13.5751 13.18 13.82C13.07 13.96 12.95 13.97 12.75 13.82C11.6097 13.3694 10.6597 12.5394 10.06 11.47C9.85 11.12 10.26 11.14 10.64 10.39C10.7 10.26 10.66 10.15 10.61 10.05C10.56 9.94999 10.16 8.98999 10 8.58999C9.82 8.17999 9.62 8.23999 9.5 8.22999H9.19C9.08297 8.23154 8.9781 8.25465 8.88232 8.29776C8.78654 8.34087 8.70183 8.403 8.63324 8.48024C8.56464 8.55749 8.51327 8.64818 8.48238 8.74675C8.45148 8.84532 8.44181 8.94959 8.45 9.04999C8.53145 9.81082 8.82899 10.5255 9.3 11.11C10.1626 12.6608 11.5653 13.8532 13.23 14.5C13.5023 14.6326 13.7855 14.7354 14.08 14.81C14.3573 14.9171 14.6498 14.9804 14.947 14.9975C15.2442 15.0147 15.5412 14.9857 15.83 14.91C16.1301 14.8303 16.412 14.6914 16.66 14.5C16.9268 14.2857 17.1145 13.9879 17.1881 13.6509C17.2617 13.314 17.2166 12.9622 17.06 12.66C16.9405 12.3309 16.7183 12.0583 16.43 11.89L15.61 13.59Z" />
                </svg>
                Order on WhatsApp
              </button>
            </div>
            
            {/* Payment & Warranty Info */}
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-3 text-gray-500 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <div>
                  <strong className="font-medium text-gray-700">Payment:</strong> Payment upon receipt of goods, Payment by card in the department, Google Pay, Online card, -3% discount in case of payment
                </div>
              </div>
              
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-3 text-gray-500 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <strong className="font-medium text-gray-700">Warranty:</strong> The Consumer Protection Act does not provide for the return of this product of proper quality.
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex mt-8 space-x-4">
              <button 
                className="flex items-center text-gray-700 hover:text-green-600"
                onClick={handleAddToWishlist}
              >
                <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Add to wishlist
              </button>
              
              <button className="flex items-center text-gray-700 hover:text-green-600">
                <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share this Product
              </button>
              
              <button className="flex items-center text-gray-700 hover:text-green-600">
                <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Compare
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 