import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaLeaf, FaStar, FaUpload } from 'react-icons/fa';
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
          <button
            onClick={handleUploadToDatabase}
            disabled={isUploading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-color hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-color disabled:opacity-50"
          >
            <FaUpload className="mr-2" />
            {isUploading ? 'Uploading...' : 'Upload to Database'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <Link to={`/products/${product._id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4">
                <Link
                  to={`/products/${product._id}`}
                  className="text-lg font-semibold text-gray-900 hover:text-primary-color"
                >
                  {product.name}
                </Link>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xl font-bold text-primary-color">
                    ₹{product.price}
                  </span>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <FaLeaf className="mr-1" />
                  <span>{product.seller.name}</span>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
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