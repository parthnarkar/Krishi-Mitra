import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaRupeeSign } from 'react-icons/fa';
import { getAllProducts } from '../utils/productApi';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/products/${product._id}`}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className="aspect-w-1 aspect-h-1">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-48"
                  />
                ) : (
                  <div className="bg-gray-200 w-full h-48 flex items-center justify-center">
                    <FaBox className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h2>
                <p className="text-gray-500 text-sm mb-2">{product.category}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaRupeeSign className="text-gray-600" />
                    <span className="text-xl font-bold text-gray-900 ml-1">
                      {product.price}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.quantity} in stock
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage; 