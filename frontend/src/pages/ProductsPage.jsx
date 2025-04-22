import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaLeaf, FaStar, FaUpload, FaStore, FaBoxOpen } from 'react-icons/fa';
import { getAllProducts, bulkUploadProducts } from '../utils/productApi';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success('Added to cart!');
  };

  const handleUploadToDatabase = async () => {
    try {
      setIsUploading(true);
      const formattedProducts = products.map(product => ({
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
        category: product.category,
        quantity: product.quantity,
        unit: product.unit,
        farmer: product.seller.name,
        location: product.seller.location,
        isOrganic: product.isOrganic,
        harvestDate: product.harvestDate,
        rating: product.rating,
        reviews: product.reviews
      }));

      const response = await bulkUploadProducts(formattedProducts);
      toast.success('Products uploaded successfully!');
      console.log('Upload response:', response);
    } catch (error) {
      console.error('Error uploading products:', error);
      toast.error('Failed to upload products');
    } finally {
      setIsUploading(false);
    }
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
            <FaBoxOpen className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-green-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-block mb-4 p-2 bg-green-100 rounded-full">
            <FaStore className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-poppins tracking-tight">
            Fresh Farm Products
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Direct from farmers to your doorstep. Fresh, organic, and sustainably grown produce.
          </p>
        </div>

      

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-t-4 border-green-500 overflow-hidden"
            >
              <Link to={`/products/${product._id}`}>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  {product.isOrganic && (
                    <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                      Organic
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-6">
                <Link
                  to={`/products/${product._id}`}
                  className="text-xl font-semibold text-gray-900 hover:text-green-600 transition-colors duration-300"
                >
                  {product.name}
                </Link>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">
                    ₹{product.price}
                  </span>
                  <div className="flex items-center bg-amber-100 px-3 py-1 rounded-full">
                    <FaStar className="text-amber-600 mr-1" />
                    <span className="text-amber-800 font-medium">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-gray-600">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <FaLeaf className="h-4 w-4 text-green-600" />
                  </div>
                  <span>{product.seller.name}</span>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-6 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage; 