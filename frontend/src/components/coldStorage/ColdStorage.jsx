import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaThermometerHalf, FaWarehouse, FaCheckCircle, FaTimesCircle, FaCalendarAlt } from 'react-icons/fa';
import './ColdStorage.css';

const ColdStorage = () => {
  const [facilities, setFacilities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    quantity: 1,
    startDate: '',
    endDate: '',
    transportType: 'self',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Mock data for development
  const mockFacilities = [
    {
      _id: '1',
      name: 'Coldex Storage Solutions',
      location: 'Mumbai, Maharashtra',
      coordinates: { latitude: 19.076, longitude: 72.877 },
      capacity: 5000,
      available: 3200,
      temperature: -5,
      price: 120,
      pricePerTonPerDay: 45,
      rating: 4.5,
      reviews: 128,
      features: ['Temperature Control', '24/7 Security', 'Pest Control', 'Backup Generator'],
      contact: {
        phone: '+91 9876543210',
        email: 'info@coldexstorage.com'
      },
      active: true
    },
    {
      _id: '2',
      name: 'FarmCool Storage',
      location: 'Pune, Maharashtra',
      coordinates: { latitude: 18.520, longitude: 73.856 },
      capacity: 3500,
      available: 1800,
      temperature: -2,
      price: 100,
      pricePerTonPerDay: 40,
      rating: 4.2,
      reviews: 95,
      features: ['Humidity Control', 'CCTV Surveillance', 'Fire Safety', 'Loading Docks'],
      contact: {
        phone: '+91 9876543211',
        email: 'contact@farmcool.com'
      },
      active: true
    },
    {
      _id: '3',
      name: 'Agri Cold Chain',
      location: 'Nashik, Maharashtra',
      coordinates: { latitude: 19.997, longitude: 73.789 },
      capacity: 2800,
      available: 800,
      temperature: -8,
      price: 140,
      pricePerTonPerDay: 50,
      rating: 4.7,
      reviews: 72,
      features: ['Advanced Refrigeration', 'Quality Assurance', '24/7 Monitoring', 'Smart Storage'],
      contact: {
        phone: '+91 9876543212',
        email: 'info@agricoldchain.com'
      },
      active: true
    }
  ];

  const mockBookings = [
    {
      _id: '101',
      facilityId: '1',
      facilityName: 'Coldex Storage Solutions',
      quantity: 500,
      startDate: '2025-04-10',
      endDate: '2025-05-10',
      transportType: 'provided',
      status: 'confirmed',
      paymentStatus: 'paid',
      totalAmount: 13500
    },
    {
      _id: '102',
      facilityId: '2',
      facilityName: 'FarmCool Storage',
      quantity: 300,
      startDate: '2025-04-15',
      endDate: '2025-04-30',
      transportType: 'self',
      status: 'pending',
      paymentStatus: 'awaiting',
      totalAmount: 6000
    }
  ];

  useEffect(() => {
    // In a real app, you would fetch data from your API
    // const fetchData = async () => {
    //   try {
    //     setLoading(true);
    //     const [facilitiesRes, bookingsRes] = await Promise.all([
    //       axios.get('/api/cold-storage/facilities'),
    //       axios.get('/api/cold-storage/bookings')
    //     ]);
    //     setFacilities(facilitiesRes.data);
    //     setBookings(bookingsRes.data);
    //     setLoading(false);
    //   } catch (err) {
    //     setError('Failed to load data. Please try again later.');
    //     setLoading(false);
    //   }
    // };
    
    // fetchData();
    
    // For demo purposes, using mock data
    setTimeout(() => {
      setFacilities(mockFacilities);
      setBookings(mockBookings);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFacilitySelect = (facility) => {
    setSelectedFacility(facility);
    setBookingForm({
      quantity: 1,
      startDate: formatDate(new Date()),
      endDate: formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // Default: 1 week from now
      transportType: 'self',
      notes: ''
    });
    setBookingSuccess(false);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm({
      ...bookingForm,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const calculateTotalCost = () => {
    if (!selectedFacility || !bookingForm.startDate || !bookingForm.endDate) return 0;
    
    const start = new Date(bookingForm.startDate);
    const end = new Date(bookingForm.endDate);
    const daysCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    if (daysCount <= 0) return 0;
    
    // Base price calculation
    let total = selectedFacility.pricePerTonPerDay * bookingForm.quantity * daysCount;
    
    // Add transport fee if selected
    if (bookingForm.transportType === 'provided') {
      total += 1000; // Fixed transport fee
    }
    
    return total;
  };

  const validateForm = () => {
    const errors = {};
    
    if (!bookingForm.quantity || bookingForm.quantity <= 0) {
      errors.quantity = 'Quantity must be greater than 0';
    }
    
    if (bookingForm.quantity > selectedFacility.available) {
      errors.quantity = 'Quantity exceeds available capacity';
    }
    
    if (!bookingForm.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (!bookingForm.endDate) {
      errors.endDate = 'End date is required';
    }
    
    if (bookingForm.startDate && bookingForm.endDate) {
      const start = new Date(bookingForm.startDate);
      const end = new Date(bookingForm.endDate);
      
      if (start >= end) {
        errors.endDate = 'End date must be after start date';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // In a real app, you would submit to your API
    // const submitBooking = async () => {
    //   try {
    //     const response = await axios.post('/api/cold-storage/book', {
    //       facilityId: selectedFacility._id,
    //       ...bookingForm,
    //       totalAmount: calculateTotalCost()
    //     });
    //     
    //     // Handle successful booking
    //     setBookingSuccess(true);
    //   } catch (err) {
    //     setError('Failed to complete booking. Please try again.');
    //   }
    // };
    
    // submitBooking();
    
    // For demo purposes, simulate success
    setTimeout(() => {
      setBookingSuccess(true);
      // Update the available capacity (for demo)
      setFacilities(facilities.map(fac => 
        fac._id === selectedFacility._id 
          ? {...fac, available: fac.available - bookingForm.quantity} 
          : fac
      ));
      
      // Add the new booking to the list (for demo)
      const newBooking = {
        _id: Date.now().toString(),
        facilityId: selectedFacility._id,
        facilityName: selectedFacility.name,
        quantity: bookingForm.quantity,
        startDate: bookingForm.startDate,
        endDate: bookingForm.endDate,
        transportType: bookingForm.transportType,
        status: 'pending',
        paymentStatus: 'awaiting',
        totalAmount: calculateTotalCost()
      };
      
      setBookings([newBooking, ...bookings]);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="cold-storage-container loading">
        <div className="loader"></div>
        <p>Loading cold storage facilities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cold-storage-container error">
        <div className="error-message">
          <FaTimesCircle />
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cold-storage-container">
      <h1 className="page-title">Cold Storage Facilities</h1>
      
      <div className="cold-storage-content">
        <div className="facilities-list">
          <h2>Available Facilities</h2>
          {facilities.map(facility => (
            <div 
              key={facility._id} 
              className={`facility-card ${selectedFacility && selectedFacility._id === facility._id ? 'selected' : ''}`}
              onClick={() => handleFacilitySelect(facility)}
            >
              <div className="facility-header">
                <h3>{facility.name}</h3>
                <span className="rating">
                  ★ {facility.rating} ({facility.reviews})
                </span>
              </div>
              
              <div className="facility-details">
                <p className="location">
                  <FaMapMarkerAlt /> {facility.location}
                </p>
                <p className="temperature">
                  <FaThermometerHalf /> {facility.temperature}°C
                </p>
                <p className="capacity">
                  <FaWarehouse /> {facility.available}/{facility.capacity} tons available
                </p>
                <p className="price">
                  ₹{facility.pricePerTonPerDay} per ton/day
                </p>
              </div>
              
              <div className="facility-features">
                {facility.features.map((feature, index) => (
                  <span key={index} className="feature-tag">{feature}</span>
                ))}
              </div>
              
              <button 
                className="select-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFacilitySelect(facility);
                }}
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
        
        <div className="booking-section">
          {selectedFacility ? (
            <>
              {bookingSuccess ? (
                <div className="booking-success">
                  <FaCheckCircle />
                  <h3>Booking Request Submitted!</h3>
                  <p>Your booking request for {selectedFacility.name} has been submitted successfully.</p>
                  <p>Booking details:</p>
                  <ul>
                    <li>Quantity: {bookingForm.quantity} tons</li>
                    <li>Period: {bookingForm.startDate} to {bookingForm.endDate}</li>
                    <li>Total Cost: ₹{calculateTotalCost().toLocaleString()}</li>
                  </ul>
                  <p>You can track the status of your booking in the 'My Bookings' section.</p>
                  <button onClick={() => setSelectedFacility(null)}>Book Another Facility</button>
                </div>
              ) : (
                <div className="booking-form-container">
                  <h2>Book Storage at {selectedFacility.name}</h2>
                  
                  <form className="booking-form" onSubmit={handleBookingSubmit}>
                    <div className="form-group">
                      <label htmlFor="quantity">Quantity (tons)</label>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        min="1"
                        max={selectedFacility.available}
                        value={bookingForm.quantity}
                        onChange={handleInputChange}
                        className={formErrors.quantity ? 'error' : ''}
                      />
                      {formErrors.quantity && <p className="error-text">{formErrors.quantity}</p>}
                      <small>Available: {selectedFacility.available} tons</small>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="startDate">Start Date</label>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={bookingForm.startDate}
                        onChange={handleInputChange}
                        min={formatDate(new Date())}
                        className={formErrors.startDate ? 'error' : ''}
                      />
                      {formErrors.startDate && <p className="error-text">{formErrors.startDate}</p>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="endDate">End Date</label>
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={bookingForm.endDate}
                        onChange={handleInputChange}
                        min={bookingForm.startDate}
                        className={formErrors.endDate ? 'error' : ''}
                      />
                      {formErrors.endDate && <p className="error-text">{formErrors.endDate}</p>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="transportType">Transportation</label>
                      <select
                        id="transportType"
                        name="transportType"
                        value={bookingForm.transportType}
                        onChange={handleInputChange}
                      >
                        <option value="self">Self-arranged</option>
                        <option value="provided">Provided by storage facility (+₹1000)</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="notes">Additional Notes</label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={bookingForm.notes}
                        onChange={handleInputChange}
                        placeholder="Any special requirements or information..."
                      ></textarea>
                    </div>
                    
                    <div className="cost-summary">
                      <h3>Cost Summary</h3>
                      <div className="cost-details">
                        <div className="cost-item">
                          <span>Storage Rate:</span>
                          <span>₹{selectedFacility.pricePerTonPerDay}/ton/day</span>
                        </div>
                        <div className="cost-item">
                          <span>Quantity:</span>
                          <span>{bookingForm.quantity} tons</span>
                        </div>
                        <div className="cost-item">
                          <span>Duration:</span>
                          <span>
                            {bookingForm.startDate && bookingForm.endDate ? 
                              Math.max(1, Math.ceil((new Date(bookingForm.endDate) - new Date(bookingForm.startDate)) / (1000 * 60 * 60 * 24))) + ' days' : 
                              '- days'}
                          </span>
                        </div>
                        {bookingForm.transportType === 'provided' && (
                          <div className="cost-item">
                            <span>Transportation Fee:</span>
                            <span>₹1,000</span>
                          </div>
                        )}
                        <div className="cost-item total">
                          <span>Total Cost:</span>
                          <span>₹{calculateTotalCost().toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-actions">
                      <button type="button" className="cancel-btn" onClick={() => setSelectedFacility(null)}>
                        Cancel
                      </button>
                      <button type="submit" className="submit-btn">
                        Submit Booking
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          ) : (
            <div className="booking-placeholder">
              <FaWarehouse className="placeholder-icon" />
              <h3>Cold Storage Booking</h3>
              <p>Select a facility from the list to make a booking.</p>
              <p>Our cold storage facilities offer:</p>
              <ul>
                <li>Temperature-controlled environments</li>
                <li>24/7 security and monitoring</li>
                <li>Flexible storage duration</li>
                <li>Transportation options</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <div className="my-bookings">
        <h2>My Bookings</h2>
        {bookings.length > 0 ? (
          <div className="bookings-list">
            {bookings.map(booking => (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <h3>{booking.facilityName}</h3>
                  <span className={`status ${booking.status}`}>{booking.status}</span>
                </div>
                
                <div className="booking-details">
                  <p>
                    <FaWarehouse /> {booking.quantity} tons
                  </p>
                  <p>
                    <FaCalendarAlt /> {booking.startDate} to {booking.endDate}
                  </p>
                  <p>
                    <strong>Total:</strong> ₹{booking.totalAmount.toLocaleString()}
                  </p>
                  <p>
                    <strong>Payment:</strong> <span className={booking.paymentStatus}>{booking.paymentStatus}</span>
                  </p>
                </div>
                
                <div className="booking-actions">
                  {booking.status === 'pending' && (
                    <button className="cancel-booking">Cancel</button>
                  )}
                  {booking.paymentStatus === 'awaiting' && (
                    <button className="pay-now">Pay Now</button>
                  )}
                  <button className="details-btn">View Details</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-bookings">
            <p>You don't have any bookings yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColdStorage; 