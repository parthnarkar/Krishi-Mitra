import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHandshake, FaBoxOpen, FaTruckMoving, FaCalendarAlt, FaRupeeSign, FaComments, FaLongArrowAltRight, FaTimesCircle, FaCheckCircle } from 'react-icons/fa';
import './BulkBuy.css';

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
      image: 'https://unsplash.com/photos/red-tomatoes-on-brown-wooden-table-eb26eV-ys_k',
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
    if (!selectedProduct || !negotiationForm.quantity || !negotiationForm.proposedPrice) return 0;
    const originalTotal = negotiationForm.quantity * selectedProduct.price;
    const discountedTotal = calculateTotalAmount();
    return ((originalTotal - discountedTotal) / originalTotal * 100).toFixed(2);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!negotiationForm.quantity || negotiationForm.quantity < selectedProduct.minQuantity) {
      errors.quantity = `Minimum quantity required is ${selectedProduct.minQuantity} ${selectedProduct.unit}`;
    }
    
    if (negotiationForm.quantity > selectedProduct.availableQuantity) {
      errors.quantity = `Maximum available quantity is ${selectedProduct.availableQuantity} ${selectedProduct.unit}`;
    }
    
    if (!negotiationForm.proposedPrice || negotiationForm.proposedPrice <= 0) {
      errors.proposedPrice = 'Proposed price must be greater than 0';
    }
    
    // Ensure proposed price isn't unreasonably low (e.g., less than 50% of original)
    if (negotiationForm.proposedPrice < selectedProduct.price * 0.5) {
      errors.proposedPrice = 'Proposed price is too low for negotiation';
    }
    
    if (!negotiationForm.deliveryDate) {
      errors.deliveryDate = 'Delivery date is required';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(negotiationForm.deliveryDate);
      
      if (selectedDate < today) {
        errors.deliveryDate = 'Delivery date cannot be in the past';
      }
      
      // Delivery should be at least 3 days from now for logistics
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + 3);
      minDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < minDate) {
        errors.deliveryDate = 'Delivery date should be at least 3 days from now';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNegotiationSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // In a real app, you would submit to your API
    // const submitNegotiation = async () => {
    //   try {
    //     const response = await axios.post('/api/bulk-buy/negotiations', {
    //       productId: selectedProduct._id,
    //       ...negotiationForm,
    //       totalAmount: calculateTotalAmount()
    //     });
    //     
    //     // Handle successful submission
    //     setNegotiationSubmitted(true);
    //   } catch (err) {
    //     setError('Failed to submit negotiation. Please try again.');
    //   }
    // };
    
    // submitNegotiation();
    
    // For demo purposes, simulate success
    setTimeout(() => {
      setNegotiationSubmitted(true);
      
      // Add the new negotiation to the list (for demo)
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
    }, 1000);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'countered': return 'status-countered';
      case 'accepted': return 'status-accepted';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  };

  const handleCounterOffer = (negotiation, response) => {
    // In a real app, this would call your API
    // axios.put(`/api/bulk-buy/negotiations/${negotiation._id}/respond`, { response });
    
    // For demo, update the negotiation status locally
    if (response === 'accept') {
      setNegotiations(negotiations.map(n => 
        n._id === negotiation._id 
          ? {...n, status: 'accepted', updatedAt: new Date().toISOString()} 
          : n
      ));
    } else if (response === 'reject') {
      setNegotiations(negotiations.map(n => 
        n._id === negotiation._id 
          ? {...n, status: 'rejected', updatedAt: new Date().toISOString()} 
          : n
      ));
    }
  };

  if (loading) {
    return (
      <div className="bulk-buy-container loading">
        <div className="loader"></div>
        <p>Loading bulk buy products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bulk-buy-container error">
        <div className="error-message">
          <FaTimesCircle />
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bulk-buy-container">
      <h1 className="page-title pt-10">Bulk Buy Negotiation</h1>
      
      <div className="bulk-buy-content">
        <div className="products-list">
          <h2 className='text-4xl font-bold '>Products Available for Bulk Purchase</h2>
          {products.map(product => (
            <div 
              key={product._id} 
              className={`border-2 border-gray-300 rounded-lg p-5 gap-4 pt-10 product-card ${selectedProduct && selectedProduct._id === product._id ? 'selected' : ''}`}
              onClick={() => handleProductSelect(product)}
            >
              <div className="product-image">
                <img className='rounded-lg ' src={product.image} alt={product.name} />
              </div>
              
              <div className="product-details">
                <div className="product-header">
                  <h3>{product.name}</h3>
                  <span className="quality-badge">{product.qualityGrade}</span>
                </div>
                
                <p className="seller">
                  By {product.seller.name} ({product.seller.location})
                  <span className="seller-rating">★ {product.seller.rating}</span>
                </p>
                
                <p className="description">{product.description}</p>
                
                <div className="product-pricing">
                  <div className="price-item">
                    <span>Market Price:</span>
                    <span>₹{product.price}/{product.unit}</span>
                  </div>
                  <div className="price-item highlight">
                    <span>Bulk Price:</span>
                    <span>₹{product.bulkPrice}/{product.unit}</span>
                  </div>
                  <div className="price-item">
                    <span>Min Quantity:</span>
                    <span>{product.minQuantity} {product.unit}</span>
                  </div>
                  <div className="price-item">
                    <span>Available:</span>
                    <span>{product.availableQuantity} {product.unit}</span>
                  </div>
                </div>
                
                <button 
                  className="negotiate-btn bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProductSelect(product);
                  }}
                >
                  Start Negotiation
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="negotiation-section">
          {selectedProduct ? (
            <>
              {negotiationSubmitted ? (
                <div className="negotiation-success">
                  <FaCheckCircle />
                  <h3>Negotiation Request Submitted!</h3>
                  <p>Your negotiation request for {selectedProduct.name} has been sent to the seller.</p>
                  <p>Negotiation details:</p>
                  <ul>
                    <li>Quantity: {negotiationForm.quantity} {selectedProduct.unit}</li>
                    <li>Proposed Price: ₹{negotiationForm.proposedPrice}/{selectedProduct.unit}</li>
                    <li>Total Value: ₹{calculateTotalAmount().toLocaleString()}</li>
                    <li>Discount: {calculateDiscount()}% off market price</li>
                  </ul>
                  <p>The seller will review your offer and respond shortly. You can track the status in the 'My Negotiations' section.</p>
                  <button onClick={() => setSelectedProduct(null)}>Negotiate Another Product</button>
                </div>
              ) : (
                <div className="negotiation-form-container">
                  <h2>Negotiate for {selectedProduct.name}</h2>
                  
                  <form className="negotiation-form" onSubmit={handleNegotiationSubmit}>
                    <div className="form-group">
                      <label htmlFor="quantity">Quantity ({selectedProduct.unit})</label>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        min={selectedProduct.minQuantity}
                        max={selectedProduct.availableQuantity}
                        value={negotiationForm.quantity}
                        onChange={handleInputChange}
                        className={formErrors.quantity ? 'error' : ''}
                      />
                      {formErrors.quantity && <p className="error-text">{formErrors.quantity}</p>}
                      <small>Min: {selectedProduct.minQuantity} {selectedProduct.unit}, Max: {selectedProduct.availableQuantity} {selectedProduct.unit}</small>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="proposedPrice">Your Proposed Price (₹/{selectedProduct.unit})</label>
                      <input
                        type="number"
                        id="proposedPrice"
                        name="proposedPrice"
                        min={1}
                        value={negotiationForm.proposedPrice}
                        onChange={handleInputChange}
                        className={formErrors.proposedPrice ? 'error' : ''}
                      />
                      {formErrors.proposedPrice && <p className="error-text">{formErrors.proposedPrice}</p>}
                      <small>Market Price: ₹{selectedProduct.price}/{selectedProduct.unit}, Bulk Price: ₹{selectedProduct.bulkPrice}/{selectedProduct.unit}</small>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="deliveryDate">Requested Delivery Date</label>
                      <input
                        type="date"
                        id="deliveryDate"
                        name="deliveryDate"
                        value={negotiationForm.deliveryDate}
                        onChange={handleInputChange}
                        min={formatDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000))} // Min 3 days from now
                        className={formErrors.deliveryDate ? 'error' : ''}
                      />
                      {formErrors.deliveryDate && <p className="error-text">{formErrors.deliveryDate}</p>}
                      <small>Allow at least 3 days for logistics arrangement</small>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="transportType">Transportation Arrangement</label>
                      <select
                        id="transportType"
                        name="transportType"
                        value={negotiationForm.transportType}
                        onChange={handleInputChange}
                      >
                        <option value="seller">Provided by Seller</option>
                        <option value="buyer">Arranged by Me</option>
                        <option value="thirdparty">Third-party Logistics</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="notes">Additional Notes</label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={negotiationForm.notes}
                        onChange={handleInputChange}
                        placeholder="Additional requirements, quality specifications, or special arrangements..."
                      ></textarea>
                    </div>
                    
                    <div className="calculation-summary">
                      <h3>Offer Summary</h3>
                      <div className="calculation-details">
                        <div className="calc-item">
                          <span>Market Value:</span>
                          <span>₹{(selectedProduct.price * negotiationForm.quantity).toLocaleString()}</span>
                        </div>
                        <div className="calc-item">
                          <span>Bulk Value:</span>
                          <span>₹{(selectedProduct.bulkPrice * negotiationForm.quantity).toLocaleString()}</span>
                        </div>
                        <div className="calc-item highlight">
                          <span>Your Offer:</span>
                          <span>₹{calculateTotalAmount().toLocaleString()}</span>
                        </div>
                        <div className="calc-item discount">
                          <span>Discount:</span>
                          <span>{calculateDiscount()}% off market price</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-actions">
                      <button type="button" className="cancel-btn" onClick={() => setSelectedProduct(null)}>
                        Cancel
                      </button>
                      <button type="submit" className="submit-btn">
                        Submit Offer
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          ) : (
            <div className="negotiation-placeholder">
              <FaHandshake className="placeholder-icon" />
              <h3>Bulk Purchase Negotiation</h3>
              <p>Select a product from the list to start a negotiation.</p>
              <p>Benefits of bulk buying:</p>
              <ul>
                <li>Get wholesale prices directly from farmers</li>
                <li>Negotiate better rates for larger quantities</li>
                <li>Secure premium quality products</li>
                <li>Choose from flexible delivery options</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <div className="my-negotiations">
        <h2>My Negotiations</h2>
        {negotiations.length > 0 ? (
          <div className="negotiations-list">
            {negotiations.map(negotiation => (
              <div key={negotiation._id} className="negotiation-card">
                <div className="negotiation-image">
                  <img src={negotiation.image} alt={negotiation.productName} />
                </div>
                
                <div className="negotiation-details">
                  <div className="negotiation-header">
                    <h3>{negotiation.productName}</h3>
                    <span className={`status-badge ${getStatusBadgeClass(negotiation.status)}`}>
                      {negotiation.status}
                    </span>
                  </div>
                  
                  <p className="seller-name">Seller: {negotiation.sellerName}</p>
                  
                  <div className="negotiation-stats">
                    <div className="stat-item">
                      <FaBoxOpen />
                      <span>{negotiation.quantity} units</span>
                    </div>
                    <div className="stat-item">
                      <FaRupeeSign />
                      <span>₹{negotiation.originalPrice} → ₹{negotiation.proposedPrice}</span>
                    </div>
                    {negotiation.counterOffer && (
                      <div className="stat-item counter">
                        <FaLongArrowAltRight />
                        <span>Counter: ₹{negotiation.counterOffer}</span>
                      </div>
                    )}
                  </div>
                  
                  {negotiation.notes && (
                    <div className="negotiation-notes">
                      <FaComments />
                      <p>{negotiation.notes}</p>
                    </div>
                  )}
                  
                  <div className="negotiation-timestamps">
                    <span>Created: {formatDateTime(negotiation.createdAt)}</span>
                    {negotiation.createdAt !== negotiation.updatedAt && (
                      <span>Updated: {formatDateTime(negotiation.updatedAt)}</span>
                    )}
                  </div>
                  
                  {negotiation.status === 'countered' && (
                    <div className="counter-actions">
                      <p className="counter-message">Seller has counter-offered ₹{negotiation.counterOffer} per unit</p>
                      <div className="counter-buttons">
                        <button 
                          className="accept-btn"
                          onClick={() => handleCounterOffer(negotiation, 'accept')}
                        >
                          Accept
                        </button>
                        <button 
                          className="reject-btn"
                          onClick={() => handleCounterOffer(negotiation, 'reject')}
                        >
                          Reject
                        </button>
                        <button className="counter-btn">
                          Counter Again
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-negotiations">
            <p>You don't have any negotiations yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkBuy; 