import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaTruck, FaShieldAlt, FaLeaf, FaStar, FaShoppingCart, FaMinus, FaPlus, FaHeart } from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Simulate API call to fetch product details
    setLoading(true);
    setTimeout(() => {
      // Sample product data
      const productData = {
        id: parseInt(id),
        name: 'Organic Alphonso Mangoes',
        price: 300,
        discountPrice: 250,
        rating: 4.8,
        reviewCount: 124,
        images: [
          'https://images.unsplash.com/photo-1553279768-865429fa0078?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bWFuZ298ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
          'https://images.unsplash.com/photo-1591073113125-e46713c829ed?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8bWFuZ298ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
          'https://images.unsplash.com/photo-1580912458557-36cf637ab645?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fG1hbmdvfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60'
        ],
        availableQuantity: 50,
        unit: 'kg',
        category: 'Fruits',
        seller: {
          name: 'Konkan Fruit Exports',
          location: 'Ratnagiri, Maharashtra',
          rating: 4.9,
          since: 2015
        },
        description: `Straight from the farms of Ratnagiri, our premium Alphonso mangoes are known for their exceptional sweetness, rich flavor, and smooth texture. These mangoes are organically grown without the use of harmful pesticides or chemicals.

Alphonso mangoes, also known as the "King of Mangoes," have a vibrant golden-yellow flesh that's fiber-free and incredibly juicy. Each mango is carefully handpicked at the perfect ripeness to ensure the best taste and quality.

Our mangoes are directly sourced from farmers, ensuring they receive fair prices for their produce while you get the freshest mangoes at a reasonable cost.`,
        specifications: [
          { name: 'Origin', value: 'Ratnagiri, Maharashtra' },
          { name: 'Cultivation Type', value: 'Organic' },
          { name: 'Certification', value: 'Organic India Certified' },
          { name: 'Shelf Life', value: '7-10 days at room temperature' },
          { name: 'Storage', value: 'Store in a cool, dry place or refrigerate' },
          { name: 'Weight Per Piece', value: 'Approximately 250-300g' }
        ],
        features: [
          'Sweet and aromatic flavor profile',
          'Fiber-free golden-yellow flesh',
          'No artificial ripening agents used',
          'Handpicked at peak ripeness',
          'Directly sourced from farmers',
          'Premium export quality'
        ],
        delivery: {
          expected: '2-3 days',
          free: true,
          minOrder: 5
        },
        relatedProducts: [
          {
            id: 6,
            name: 'Green Apples',
            price: 120,
            image: 'https://images.unsplash.com/photo-1569870499705-504209102861?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Z3JlZW4lMjBhcHBsZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            rating: 4.6
          },
          {
            id: 7,
            name: 'Fresh Strawberries',
            price: 180,
            image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3RyYXdiZXJyaWVzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
            rating: 4.7
          },
          {
            id: 8,
            name: 'Organic Kiwi',
            price: 140,
            image: 'https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8a2l3aXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
            rating: 4.5
          }
        ]
      };
      
      setProduct(productData);
      setLoading(false);
    }, 800);
  }, [id]);

  const incrementQuantity = () => {
    if (product && quantity < product.availableQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-neutral-200 rounded mb-4"></div>
          <div className="h-4 w-48 bg-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 flex justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Product Not Found</h2>
          <p className="text-neutral-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/products" className="btn btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-32 pb-20">
      <div className="container px-6">
        {/* Breadcrumb */}
        <div className="flex items-center mb-8 text-sm text-neutral-600">
          <Link to="/" className="hover:text-primary-color">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-primary-color">Products</Link>
          <span className="mx-2">/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-primary-color">{product.category}</Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-500">{product.name}</span>
        </div>

        {/* Back Button */}
        <Link to="/products" className="inline-flex items-center text-neutral-600 hover:text-primary-color mb-8 group">
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </Link>

        {/* Product Details */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Product Images */}
            <div className="p-8 flex flex-col">
              <div className="h-96 mb-4 overflow-hidden rounded-lg">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-4 mt-4">
                {product.images.map((image, index) => (
                  <div 
                    key={index} 
                    className="w-24 h-24 rounded-md overflow-hidden border-2 border-neutral-200 cursor-pointer hover:border-primary-color transition-colors"
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-8 border-l border-neutral-100">
              <span className="badge badge-primary mb-3 animate-fade-in">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold text-neutral-800 mb-4 animate-fade-in">
                {product.name}
              </h1>
              
              <div className="flex items-center mb-6 animate-fade-in">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={`${i < Math.floor(product.rating) ? 'text-secondary-color' : 'text-neutral-300'} ${i === Math.floor(product.rating) && product.rating % 1 > 0 ? 'text-secondary-color' : ''}`} 
                    />
                  ))}
                  <span className="ml-2 text-neutral-600">{product.rating} ({product.reviewCount} reviews)</span>
                </div>
              </div>
              
              <div className="mb-6 animate-fade-in">
                <div className="flex items-baseline">
                  <p className="text-3xl font-bold text-neutral-800">
                    ₹{product.discountPrice}
                    <span className="text-sm font-normal text-neutral-600 ml-1">/{product.unit}</span>
                  </p>
                  <p className="ml-3 text-xl text-neutral-500 line-through">₹{product.price}</p>
                  <span className="ml-3 badge badge-secondary">
                    {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                  </span>
                </div>
                <p className="text-success mt-2">In Stock ({product.availableQuantity} {product.unit} available)</p>
              </div>
              
              <div className="mb-8 animate-fade-in">
                <p className="text-neutral-600 mb-4">From {product.seller.name} in {product.seller.location}</p>
                <div className="flex items-center text-sm text-neutral-600">
                  <FaLeaf className="mr-2 text-primary-color" />
                  <span>Organically grown</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in">
                <div className="flex items-center border border-neutral-200 rounded-lg">
                  <button 
                    onClick={decrementQuantity} 
                    className="px-4 py-2 text-neutral-600 hover:text-primary-color"
                    disabled={quantity <= 1}
                  >
                    <FaMinus />
                  </button>
                  <span className="px-4 py-2 border-x border-neutral-200">
                    {quantity}
                  </span>
                  <button 
                    onClick={incrementQuantity} 
                    className="px-4 py-2 text-neutral-600 hover:text-primary-color"
                    disabled={quantity >= product.availableQuantity}
                  >
                    <FaPlus />
                  </button>
                </div>
                
                <button className="btn btn-primary px-8 py-3 rounded-lg shadow-sm">
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </button>
                
                <button className="btn btn-outline">
                  <FaHeart className="mr-2" />
                  Save
                </button>
              </div>
              
              <div className="border-t border-neutral-100 pt-6 animate-fade-in">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start">
                    <FaTruck className="text-primary-color mt-1 mr-3" />
                    <div>
                      <p className="font-medium text-neutral-800">Fast Delivery</p>
                      <p className="text-sm text-neutral-600">Estimated delivery in {product.delivery.expected}</p>
                      {product.delivery.free && (
                        <p className="text-sm text-success mt-1">Free shipping on orders above {product.delivery.minOrder} {product.unit}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaShieldAlt className="text-primary-color mt-1 mr-3" />
                    <div>
                      <p className="font-medium text-neutral-800">Quality Guarantee</p>
                      <p className="text-sm text-neutral-600">If you're not satisfied with the quality, we offer a full refund or replacement</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-12">
          {/* Tab Headers */}
          <div className="border-b border-neutral-100">
            <div className="flex overflow-x-auto">
              <button 
                onClick={() => handleTabChange('description')} 
                className={`px-8 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'description' 
                    ? 'text-primary-color border-b-2 border-primary-color' 
                    : 'text-neutral-600 hover:text-neutral-800'
                }`}
              >
                Description
              </button>
              <button 
                onClick={() => handleTabChange('specifications')} 
                className={`px-8 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'specifications' 
                    ? 'text-primary-color border-b-2 border-primary-color' 
                    : 'text-neutral-600 hover:text-neutral-800'
                }`}
              >
                Specifications
              </button>
              <button 
                onClick={() => handleTabChange('seller')} 
                className={`px-8 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'seller' 
                    ? 'text-primary-color border-b-2 border-primary-color' 
                    : 'text-neutral-600 hover:text-neutral-800'
                }`}
              >
                Seller Info
              </button>
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'description' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold text-neutral-800 mb-4">Product Description</h3>
                <div className="text-neutral-600 space-y-4">
                  {product.description.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
                
                <h4 className="text-lg font-semibold text-neutral-800 mt-8 mb-4">Key Features</h4>
                <ul className="list-disc pl-5 text-neutral-600 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {activeTab === 'specifications' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold text-neutral-800 mb-6">Product Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specifications.map((spec, idx) => (
                    <div key={idx} className="border-b border-neutral-100 pb-4">
                      <p className="text-neutral-500 text-sm">{spec.name}</p>
                      <p className="text-neutral-800 font-medium">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'seller' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold text-neutral-800 mb-6">About the Seller</h3>
                <div className="bg-neutral-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-neutral-800 mb-2">{product.seller.name}</h4>
                  <p className="text-neutral-600 mb-4">Located in {product.seller.location}</p>
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < Math.floor(product.seller.rating) ? 'text-secondary-color' : 'text-neutral-300'} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-neutral-600">{product.seller.rating} Seller Rating</span>
                  </div>
                  <p className="text-neutral-600">Selling on KrishiConnect since {product.seller.since}</p>
                  <button className="btn btn-primary mt-6">
                    View All Products from this Seller
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Related Products */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-neutral-800 mb-8">You May Also Like</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {product.relatedProducts.map((related) => (
              <div 
                key={related.id} 
                className="card bg-white rounded-xl overflow-hidden border border-neutral-100 hover:translate-y-1 transition-all"
              >
                <Link to={`/product/${related.id}`} className="block h-48">
                  <img 
                    src={related.image} 
                    alt={related.name} 
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="p-6">
                  <div className="flex items-center gap-1 mb-2">
                    <FaStar className="text-secondary-color" />
                    <span className="text-neutral-600 text-sm">{related.rating}</span>
                  </div>
                  <Link 
                    to={`/product/${related.id}`} 
                    className="text-lg font-semibold text-neutral-800 hover:text-primary-color transition-colors"
                  >
                    {related.name}
                  </Link>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xl font-bold text-neutral-800">
                      ₹{related.price}
                      <span className="text-sm font-normal text-neutral-600">/kg</span>
                    </span>
                    <button className="btn btn-primary px-4 py-2 rounded-lg text-white shadow-sm hover:shadow-md">
                      <FaShoppingCart />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 