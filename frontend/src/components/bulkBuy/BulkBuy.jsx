import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHandshake, 
  FaBoxOpen, 
  FaTruckMoving, 
  FaCalendarAlt, 
  FaRupeeSign, 
  FaComments, 
  FaLongArrowAltRight, 
  FaTimesCircle, 
  FaCheckCircle,
  FaFilter,
  FaSort,
  FaSearch,
  FaMapMarkerAlt,
  FaStar,
  FaLeaf,
  FaWarehouse,
  FaShoppingCart,
  FaUserTie,
  FaIndustry,
  FaChartLine,
  FaUsers,
  FaGlobeAsia,
  FaBoxes
} from 'react-icons/fa';
import './BulkBuy.css';

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-xl p-6 space-y-4">
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const BulkBuy = () => {
  const [products, setProducts] = useState([]);
  const [negotiations, setNegotiations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [negotiationForm, setNegotiationForm] = useState({
    quantity: 0,
    proposedPrice: 0,
    deliveryDate: '',
    transportType: 'seller',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [negotiationSubmitted, setNegotiationSubmitted] = useState(false);
  
  // Add ref for negotiation section
  const negotiationRef = useRef(null);
  
  // Filter and sort states
  const [filters, setFilters] = useState({
    category: 'all',
    location: 'all',
    minPrice: '',
    maxPrice: '',
    qualityGrade: 'all'
  });
  const [sortBy, setSortBy] = useState('price-asc');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for development
  const mockProducts = [
    {
      _id: '1',
      name: 'Fresh Tomatoes',
      seller: {
        _id: 's1',
        name: 'Green Farms Ltd.',
        location: 'Nashik, Maharashtra',
        rating: 4.7
      },
      category: 'Vegetables',
      description: 'Premium quality farm-fresh tomatoes. Ideal for restaurants and food processing businesses.',
      image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      unit: 'kg',
      minQuantity: 500,
      price: 40,
      bulkPrice: 32,
      availableQuantity: 5000,
      qualityGrade: 'A'
    },
    {
      _id: '2',
      name: 'Organic Potatoes',
      seller: {
        _id: 's2',
        name: 'Organic Harvest Co.',
        location: 'Pune, Maharashtra',
        rating: 4.5
      },
      category: 'Vegetables',
      description: 'Organically grown potatoes without pesticides. Perfect for retail chains and organic markets.',
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cG90YXRvZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      unit: 'kg',
      minQuantity: 1000,
      price: 25,
      bulkPrice: 18,
      availableQuantity: 8000,
      qualityGrade: 'A+'
    },
    {
      _id: '3',
      name: 'Alphonso Mangoes',
      seller: {
        _id: 's3',
        name: 'Konkan Fruit Exports',
        location: 'Ratnagiri, Maharashtra',
        rating: 4.9
      },
      category: 'Fruits',
      description: 'Premium Alphonso mangoes directly from Ratnagiri orchards. Premium quality for export and high-end markets.',
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bWFuZ298ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      unit: 'box (5kg)',
      minQuantity: 100,
      price: 1500,
      bulkPrice: 1200,
      availableQuantity: 1000,
      qualityGrade: 'Export'
    },
    {
      _id: '4',
      name: 'Basmati Rice',
      seller: {
        _id: 's4',
        name: 'Punjab Rice Mills',
        location: 'Amritsar, Punjab',
        rating: 4.8
      },
      category: 'Grains',
      description: 'Premium quality Basmati rice with long grains and aromatic flavor. Ideal for export and high-end restaurants.',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmljZXxlbnwwfHwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      unit: 'kg',
      minQuantity: 2000,
      price: 120,
      bulkPrice: 95,
      availableQuantity: 10000,
      qualityGrade: 'Premium'
    },
    {
      _id: '5',
      name: 'Green Peas',
      seller: {
        _id: 's5',
        name: 'Maharashtra Agri Co-op',
        location: 'Kolhapur, Maharashtra',
        rating: 4.3
      },
      category: 'Vegetables',
      description: 'Fresh green peas harvested at peak ripeness. Perfect for frozen food manufacturers and canning industries.',
      image: 'https://images.unsplash.com/photo-1690023852149-0c69ac74734f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      unit: 'kg',
      minQuantity: 300,
      price: 35,
      bulkPrice: 28,
      availableQuantity: 3000,
      qualityGrade: 'A'
    }
  ];

  const mockNegotiations = [
    {
      _id: '101',
      productId: '1',
      productName: 'Fresh Tomatoes',
      sellerName: 'Green Farms Ltd.',
      quantity: 2000,
      originalPrice: 40,
      proposedPrice: 30,
      counterOffer: 35,
      status: 'countered',
      createdAt: '2025-03-24T10:30:00.000Z',
      updatedAt: '2025-03-25T14:45:00.000Z',
      notes: 'Requesting discount for bulk purchase for our restaurant chain',
      image: 'https://images.unsplash.com/photo-1592924357236-864f0aecab26?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dG9tYXRvZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      _id: '102',
      productId: '3',
      productName: 'Alphonso Mangoes',
      sellerName: 'Konkan Fruit Exports',
      quantity: 200,
      originalPrice: 1500,
      proposedPrice: 1100,
      counterOffer: null,
      status: 'pending',
      createdAt: '2025-03-26T09:15:00.000Z',
      updatedAt: '2025-03-26T09:15:00.000Z',
      notes: 'For export to UAE market, premium quality required',
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bWFuZ298ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }
  ];

  useEffect(() => {
    // In a real app, you would fetch data from your API
    // const fetchData = async () => {
    //   try {
    //     setLoading(true);
    //     const [productsRes, negotiationsRes] = await Promise.all([
    //       axios.get('/api/bulk-buy/products'),
    //       axios.get('/api/bulk-buy/negotiations')
    //     ]);
    //     setProducts(productsRes.data);
    //     setNegotiations(negotiationsRes.data);
    //     setLoading(false);
    //   } catch (err) {
    //     setError('Failed to load data. Please try again later.');
    //     setLoading(false);
    //   }
    // };
    
    // fetchData();
    
    // For demo purposes, using mock data
    setTimeout(() => {
      setProducts(mockProducts);
      setNegotiations(mockNegotiations);
      setLoading(false);
    }, 1000);
  }, []);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setNegotiationForm({
      quantity: product.minQuantity,
      proposedPrice: Math.round(product.bulkPrice * 0.9), // Initial proposed price (10% below bulk price)
      deliveryDate: formatDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)), // 2 weeks from now
      transportType: 'seller',
      notes: ''
    });
    setNegotiationSubmitted(false);
    
    // Scroll to negotiation section after a short delay to allow state to update
    setTimeout(() => {
      if (negotiationRef.current) {
        negotiationRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNegotiationForm({
      ...negotiationForm,
      [name]: name === 'quantity' || name === 'proposedPrice' ? parseInt(value) : value
    });
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const calculateTotalAmount = () => {
    if (!selectedProduct || !negotiationForm.quantity || !negotiationForm.proposedPrice) return 0;
    return negotiationForm.quantity * negotiationForm.proposedPrice;
  };

  const calculateDiscount = () => {
    if (!selectedProduct || !negotiationForm.proposedPrice) return 0;
    return Math.round(((selectedProduct.price - negotiationForm.proposedPrice) / selectedProduct.price) * 100);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!negotiationForm.quantity) {
      errors.quantity = 'Quantity is required';
    } else if (negotiationForm.quantity < selectedProduct.minQuantity) {
      errors.quantity = `Minimum order quantity is ${selectedProduct.minQuantity} ${selectedProduct.unit}`;
    } else if (negotiationForm.quantity > selectedProduct.availableQuantity) {
      errors.quantity = `Only ${selectedProduct.availableQuantity} ${selectedProduct.unit} available`;
    }
    
    if (!negotiationForm.proposedPrice) {
      errors.proposedPrice = 'Price is required';
    } else if (negotiationForm.proposedPrice <= 0) {
      errors.proposedPrice = 'Price must be greater than 0';
    }
    
    if (!negotiationForm.deliveryDate) {
      errors.deliveryDate = 'Delivery date is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNegotiationSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // In a real app, you would submit to your API
    // const submitNegotiation = async () => {
    //   try {
    //     const response = await axios.post('/api/bulk-buy/negotiations', {
    //       productId: selectedProduct._id,
    //       ...negotiationForm
    //     });
    //     setNegotiations([response.data, ...negotiations]);
    //     setNegotiationSubmitted(true);
    //   } catch (err) {
    //     setError('Failed to submit negotiation. Please try again.');
    //   }
    // };
    
    // submitNegotiation();
    
    // For demo purposes, creating a mock negotiation
      const newNegotiation = {
        _id: Date.now().toString(),
        productId: selectedProduct._id,
        productName: selectedProduct.name,
        sellerName: selectedProduct.seller.name,
        quantity: negotiationForm.quantity,
        originalPrice: selectedProduct.price,
        proposedPrice: negotiationForm.proposedPrice,
        counterOffer: null,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: negotiationForm.notes,
        image: selectedProduct.image
      };
      
      setNegotiations([newNegotiation, ...negotiations]);
    setNegotiationSubmitted(true);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'countered':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCounterOffer = (negotiation, response) => {
    // In a real app, you would update via API
    // const updateNegotiation = async () => {
    //   try {
    //     const response = await axios.patch(`/api/bulk-buy/negotiations/${negotiation._id}`, {
    //       status: response
    //     });
    //     setNegotiations(negotiations.map(n => n._id === negotiation._id ? response.data : n));
    //   } catch (err) {
    //     setError('Failed to update negotiation. Please try again.');
    //   }
    // };
    
    // updateNegotiation();
    
    // For demo purposes, updating the mock negotiation
      setNegotiations(negotiations.map(n => 
        n._id === negotiation._id 
        ? { ...n, status: response } 
          : n
      ));
  };

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    // Apply category filter
    if (filters.category !== 'all' && product.category !== filters.category) {
      return false;
    }
    
    // Apply location filter
    if (filters.location !== 'all' && !product.seller.location.includes(filters.location)) {
      return false;
    }
    
    // Apply price range filter
    if (filters.minPrice && product.price < parseInt(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && product.price > parseInt(filters.maxPrice)) {
      return false;
    }
    
    // Apply quality grade filter
    if (filters.qualityGrade !== 'all' && product.qualityGrade !== filters.qualityGrade) {
      return false;
    }
    
    // Apply search query
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'quantity-asc':
        return a.minQuantity - b.minQuantity;
      case 'quantity-desc':
        return b.minQuantity - a.minQuantity;
      case 'rating-desc':
        return b.seller.rating - a.seller.rating;
      default:
        return 0;
    }
  });

  // Get unique categories for filter
  const categories = ['all', ...new Set(products.map(p => p.category))];
  
  // Get unique locations for filter
  const locations = ['all', ...new Set(products.map(p => p.seller.location.split(',')[0]))];
  
  // Get unique quality grades for filter
  const qualityGrades = ['all', ...new Set(products.map(p => p.qualityGrade))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaTimesCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Data</h3>
                <p className="mt-2 text-sm text-red-700">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 animate-fade-in-up"
        >
          <div className="inline-block mb-4 p-2 bg-green-100 rounded-full">
            <FaHandshake className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-brown-800 font-poppins mb-4 tracking-tight">
            Bulk Agricultural Marketplace
          </h1>
          <p className="text-lg text-brown-600 max-w-3xl mx-auto leading-relaxed">
            Connect directly with farmers and suppliers for bulk purchases of high-quality agricultural products.
            Negotiate prices, arrange delivery, and secure the best deals for your business.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {[
            { icon: FaBoxes, label: "Total Products", value: products.length, color: "blue" },
            { icon: FaUsers, label: "Active Sellers", value: "150+", color: "green" },
            { icon: FaGlobeAsia, label: "Locations", value: "25+", color: "purple" },
            { icon: FaChartLine, label: "Success Rate", value: "95%", color: "indigo" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 transform hover:scale-[1.02] border-t-4 border-green-500"
            >
              <div className={`inline-flex items-center justify-center p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600 mb-4`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg hover:shadow-xl p-6 mb-8 border-t-4 border-green-500"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-brown-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="block w-full pl-10 pr-3 py-2 border border-amber-200 rounded-lg leading-5 bg-white placeholder-brown-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="h-5 w-5 text-brown-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-amber-200 rounded-lg leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition-all duration-300"
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="h-5 w-5 text-brown-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-amber-200 rounded-lg leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition-all duration-300"
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
              >
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location === 'all' ? 'All Locations' : location}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSort className="h-5 w-5 text-brown-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-amber-200 rounded-lg leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition-all duration-300"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="quantity-asc">Min Quantity: Low to High</option>
                <option value="quantity-desc">Min Quantity: High to Low</option>
                <option value="rating-desc">Highest Rated</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min Price"
                className="block w-full px-3 py-2 border border-amber-200 rounded-lg leading-5 bg-white placeholder-brown-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition-all duration-300"
                value={filters.minPrice}
                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
              />
              <input
                type="number"
                placeholder="Max Price"
                className="block w-full px-3 py-2 border border-amber-200 rounded-lg leading-5 bg-white placeholder-brown-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition-all duration-300"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLeaf className="h-5 w-5 text-brown-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-amber-200 rounded-lg leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition-all duration-300"
                value={filters.qualityGrade}
                onChange={(e) => setFilters({...filters, qualityGrade: e.target.value})}
              >
                {qualityGrades.map(grade => (
                  <option key={grade} value={grade}>
                    {grade === 'all' ? 'All Quality Grades' : `Grade ${grade}`}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105"
              onClick={() => setFilters({
                category: 'all',
                location: 'all',
                minPrice: '',
                maxPrice: '',
                qualityGrade: 'all'
              })}
            >
              Reset Filters
            </button>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          <AnimatePresence>
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl overflow-hidden hover:scale-[1.02] transition-all duration-300 border-t-4 border-green-500"
              >
                <div className="relative h-48">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full border border-green-200">
                    {product.qualityGrade}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-brown-800">{product.name}</h3>
                    <div className="flex items-center bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm border border-amber-200">
                      <FaStar className="h-4 w-4 mr-1" />
                      <span className="font-medium">{product.seller.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-brown-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center text-sm text-brown-600 mb-4">
                    <FaMapMarkerAlt className="h-4 w-4 mr-1" />
                    <span>{product.seller.location}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                      <p className="text-xs text-brown-600">Price per {product.unit}</p>
                      <p className="text-lg font-bold text-brown-800">
                        <FaRupeeSign className="inline-block h-3 w-3" />
                        {product.price}
                      </p>
                      <p className="text-sm text-green-600">
                        Bulk: <FaRupeeSign className="inline-block h-3 w-3" />
                        {product.bulkPrice}
                      </p>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                      <p className="text-xs text-brown-600">Min. Order</p>
                      <p className="text-lg font-bold text-brown-800">{product.minQuantity} {product.unit}</p>
                      <p className="text-sm text-brown-600">
                        Available: {product.availableQuantity} {product.unit}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                      onClick={() => handleProductSelect(product)}
                    >
                      <FaHandshake className="mr-2" />
                      Negotiate
                    </button>
                    <button
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                    >
                      <FaComments className="mr-2" />
                      Contact
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Negotiation Section */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              ref={negotiationRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl p-6 mb-8 border-t-4 border-green-500"
            >
              <div className="flex items-center mb-6">
                <FaHandshake className="h-6 w-6 text-green-600 mr-2" />
                <h2 className="text-2xl font-bold text-brown-800 font-poppins">Negotiate Bulk Purchase</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <div className="flex items-center mb-4">
                      <img 
                        src={selectedProduct.image} 
                        alt={selectedProduct.name} 
                        className="w-16 h-16 object-cover rounded-md mr-4"
                      />
                      <div>
                        <h3 className="font-semibold text-brown-800">{selectedProduct.name}</h3>
                        <p className="text-sm text-brown-600">{selectedProduct.seller.name}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-brown-600">Regular Price:</span>
                        <span className="text-sm font-medium text-brown-800">
                          <FaRupeeSign className="inline-block h-3 w-3" />
                          {selectedProduct.price} per {selectedProduct.unit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-brown-600">Bulk Price:</span>
                        <span className="text-sm font-medium text-green-600">
                          <FaRupeeSign className="inline-block h-3 w-3" />
                          {selectedProduct.bulkPrice} per {selectedProduct.unit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-brown-600">Min. Order:</span>
                        <span className="text-sm font-medium text-brown-800">{selectedProduct.minQuantity} {selectedProduct.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-brown-600">Available:</span>
                        <span className="text-sm font-medium text-brown-800">{selectedProduct.availableQuantity} {selectedProduct.unit}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-2">
                  {negotiationSubmitted ? (
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <FaCheckCircle className="h-5 w-5 text-green-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-green-700">
                            Your negotiation request has been submitted successfully. The seller will review and respond shortly.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleNegotiationSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-brown-700 mb-1">
                            Quantity ({selectedProduct.unit})
                          </label>
                          <input
                            type="number"
                            name="quantity"
                            value={negotiationForm.quantity}
                            onChange={handleInputChange}
                            className={`block w-full px-3 py-2 border ${formErrors.quantity ? 'border-red-300' : 'border-amber-200'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition-all duration-300`}
                          />
                          {formErrors.quantity && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.quantity}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-brown-700 mb-1">
                            Proposed Price (₹ per {selectedProduct.unit})
                          </label>
                          <input
                            type="number"
                            name="proposedPrice"
                            value={negotiationForm.proposedPrice}
                            onChange={handleInputChange}
                            className={`block w-full px-3 py-2 border ${formErrors.proposedPrice ? 'border-red-300' : 'border-amber-200'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition-all duration-300`}
                          />
                          {formErrors.proposedPrice && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.proposedPrice}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-brown-700 mb-1">
                            Delivery Date
                          </label>
                          <input
                            type="date"
                            name="deliveryDate"
                            value={negotiationForm.deliveryDate}
                            onChange={handleInputChange}
                            className={`block w-full px-3 py-2 border ${formErrors.deliveryDate ? 'border-red-300' : 'border-amber-200'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition-all duration-300`}
                          />
                          {formErrors.deliveryDate && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.deliveryDate}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-brown-700 mb-1">
                            Transport Type
                          </label>
                          <select
                            name="transportType"
                            value={negotiationForm.transportType}
                            onChange={handleInputChange}
                            className="block w-full px-3 py-2 border border-amber-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition-all duration-300"
                          >
                            <option value="seller">Seller Arranged</option>
                            <option value="buyer">Buyer Arranged</option>
                            <option value="thirdParty">Third Party</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-brown-700 mb-1">
                          Additional Notes
                        </label>
                        <textarea
                          name="notes"
                          value={negotiationForm.notes}
                          onChange={handleInputChange}
                          rows="3"
                          className="block w-full px-3 py-2 border border-amber-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition-all duration-300"
                          placeholder="Any special requirements or questions..."
                        ></textarea>
                      </div>
                      
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-brown-700">Total Amount:</span>
                          <span className="text-lg font-bold text-brown-800">
                            <FaRupeeSign className="inline-block h-4 w-4" />
                            {calculateTotalAmount().toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-brown-700">Discount:</span>
                          <span className="text-sm font-medium text-green-600">{calculateDiscount()}%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105"
                        >
                          Submit Negotiation
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Negotiations List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg hover:shadow-xl p-6 border-t-4 border-green-500"
        >
          <div className="flex items-center mb-6">
            <FaHandshake className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-2xl font-bold text-brown-800 font-poppins">Your Negotiations</h2>
          </div>
          
          {negotiations.length === 0 ? (
            <div className="text-center py-8">
              <FaHandshake className="h-12 w-12 text-amber-400 mx-auto mb-4" />
              <p className="text-brown-600">You haven't initiated any negotiations yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {negotiations.map(negotiation => (
                <div key={negotiation._id} className="border rounded-lg overflow-hidden border-amber-200">
                  <div className="bg-amber-50 px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <img 
                        src={negotiation.image} 
                        alt={negotiation.productName} 
                        className="w-10 h-10 object-cover rounded-md mr-3"
                      />
                      <div>
                        <h3 className="font-medium text-brown-800">{negotiation.productName}</h3>
                        <p className="text-sm text-brown-600">{negotiation.sellerName}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(negotiation.status)}`}>
                      {negotiation.status.charAt(0).toUpperCase() + negotiation.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                        <p className="text-xs text-brown-600">Quantity</p>
                        <p className="font-medium text-brown-800">{negotiation.quantity}</p>
                      </div>
                      <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                        <p className="text-xs text-brown-600">Original Price</p>
                        <p className="font-medium text-brown-800">
                          <FaRupeeSign className="inline-block h-3 w-3" />
                          {negotiation.originalPrice}
                        </p>
                      </div>
                      <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                        <p className="text-xs text-brown-600">Proposed Price</p>
                        <p className="font-medium text-green-600">
                          <FaRupeeSign className="inline-block h-3 w-3" />
                          {negotiation.proposedPrice}
                        </p>
                      </div>
                    </div>
                    
                    {negotiation.counterOffer && (
                      <div className="bg-blue-50 p-3 rounded-lg mb-4 border border-blue-200">
                        <p className="text-sm font-medium text-blue-800 mb-1">Counter Offer</p>
                        <p className="text-sm text-blue-700">
                          <FaRupeeSign className="inline-block h-3 w-3" />
                          {negotiation.counterOffer} per unit
                        </p>
                      </div>
                    )}
                    
                    {negotiation.notes && (
                      <div className="mb-4">
                        <p className="text-xs text-brown-600 mb-1">Notes</p>
                        <p className="text-sm text-brown-700">{negotiation.notes}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-brown-600">
                        Created: {formatDateTime(negotiation.createdAt)}
                      </p>
                      
                      {negotiation.status === 'countered' && (
                        <div className="flex space-x-2">
                          <button 
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
                            onClick={() => handleCounterOffer(negotiation, 'accepted')}
                          >
                            Accept
                          </button>
                          <button 
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
                            onClick={() => handleCounterOffer(negotiation, 'rejected')}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BulkBuy; 