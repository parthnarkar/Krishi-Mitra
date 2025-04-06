import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaMapMarkerAlt, 
  FaThermometerHalf, 
  FaWarehouse, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaCalendarAlt,
  FaShieldAlt,
  FaLeaf,
  FaBolt,
  FaTruck,
  FaSnowflake,
  FaChartLine,
  FaStar
} from 'react-icons/fa';
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

  // Loading skeleton animation
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-2/3"></div>
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
        <div className="bg-white rounded-xl p-6">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
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
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cold Storage Facilities</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Secure temperature-controlled storage solutions for your agricultural produce. 
            Book space, track inventory, and ensure product freshness.
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
            { icon: FaWarehouse, label: "Total Facilities", value: facilities.length, color: "blue" },
            { icon: FaSnowflake, label: "Temperature Range", value: "-10°C to 4°C", color: "cyan" },
            { icon: FaLeaf, label: "Active Storage", value: "12,000 Tons", color: "green" },
            { icon: FaChartLine, label: "Utilization", value: "85%", color: "indigo" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
            >
              <div className={`inline-flex items-center justify-center p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600 mb-4`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Facilities List */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Facilities</h2>
            <AnimatePresence>
              {facilities.map((facility, index) => (
                <motion.div
                  key={facility._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-xl shadow-sm p-6 cursor-pointer transform transition-all duration-300 hover:shadow-md hover:scale-[1.02] ${
                    selectedFacility && selectedFacility._id === facility._id ? 'ring-2 ring-green-500' : ''
                  }`}
                  onClick={() => handleFacilitySelect(facility)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{facility.name}</h3>
                      <div className="flex items-center text-gray-500 mb-2">
                        <FaMapMarkerAlt className="h-4 w-4 mr-2" />
                        <span>{facility.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      <FaStar className="h-4 w-4 mr-1" />
                      {facility.rating} ({facility.reviews})
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <FaThermometerHalf className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Temperature</p>
                        <p className="font-medium">{facility.temperature}°C</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg mr-3">
                        <FaWarehouse className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Available</p>
                        <p className="font-medium">{facility.available}/{facility.capacity} tons</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {facility.features.map((feature, i) => (
                      <span 
                        key={i}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Price per ton/day</p>
                      <p className="text-xl font-bold text-gray-900">₹{facility.pricePerTonPerDay}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFacilitySelect(facility);
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Book Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Booking Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:sticky lg:top-6"
          >
            {selectedFacility ? (
              <AnimatePresence mode="wait">
                {bookingSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-xl shadow-sm p-8"
                  >
                    <div className="text-center">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                        <FaCheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="mt-4 text-xl font-medium text-gray-900">Booking Confirmed!</h3>
                      <p className="mt-2 text-gray-500">
                        Your storage space has been reserved at {selectedFacility.name}
                      </p>
                      <div className="mt-6 bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Quantity</p>
                            <p className="font-medium">{bookingForm.quantity} tons</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Duration</p>
                            <p className="font-medium">{bookingForm.startDate} to {bookingForm.endDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Transport</p>
                            <p className="font-medium capitalize">{bookingForm.transportType}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total Cost</p>
                            <p className="font-medium">₹{calculateTotalCost().toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedFacility(null)}
                        className="mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700"
                      >
                        Book Another Facility
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-xl shadow-sm p-8"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Book Storage Space</h3>
                    <form onSubmit={handleBookingSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity (tons)
                        </label>
                        <input
                          type="number"
                          name="quantity"
                          value={bookingForm.quantity}
                          onChange={handleInputChange}
                          min="1"
                          max={selectedFacility.available}
                          className={`block w-full px-3 py-2 border ${formErrors.quantity ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-primary-color focus:border-primary-color sm:text-sm transition-colors duration-200`}
                        />
                        {formErrors.quantity && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.quantity}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                          Available: {selectedFacility.available} tons
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                          </label>
                          <input
                            type="date"
                            name="startDate"
                            value={bookingForm.startDate}
                            onChange={handleInputChange}
                            min={formatDate(new Date())}
                            className={`block w-full px-3 py-2 border ${formErrors.startDate ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-primary-color focus:border-primary-color sm:text-sm transition-colors duration-200`}
                          />
                          {formErrors.startDate && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.startDate}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            name="endDate"
                            value={bookingForm.endDate}
                            onChange={handleInputChange}
                            min={bookingForm.startDate}
                            className={`block w-full px-3 py-2 border ${formErrors.endDate ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-primary-color focus:border-primary-color sm:text-sm transition-colors duration-200`}
                          />
                          {formErrors.endDate && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.endDate}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Transportation
                        </label>
                        <select
                          name="transportType"
                          value={bookingForm.transportType}
                          onChange={handleInputChange}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-color focus:border-primary-color sm:text-sm transition-colors duration-200"
                        >
                          <option value="self">Self-arranged</option>
                          <option value="provided">Provided by storage facility (+₹1000)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Additional Notes
                        </label>
                        <textarea
                          name="notes"
                          value={bookingForm.notes}
                          onChange={handleInputChange}
                          rows="3"
                          className={`block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-color focus:border-primary-color sm:text-sm transition-colors duration-200`}
                          placeholder="Any special requirements or information..."
                        ></textarea>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Cost Summary</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Storage Rate</span>
                            <span className="font-medium">₹{selectedFacility.pricePerTonPerDay}/ton/day</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Duration</span>
                            <span className="font-medium">
                              {bookingForm.startDate && bookingForm.endDate
                                ? Math.ceil((new Date(bookingForm.endDate) - new Date(bookingForm.startDate)) / (1000 * 60 * 60 * 24))
                                : 0} days
                            </span>
                          </div>
                          {bookingForm.transportType === 'provided' && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Transport Fee</span>
                              <span className="font-medium">₹1,000</span>
                            </div>
                          )}
                          <div className="pt-2 border-t border-gray-200">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-900">Total Cost</span>
                              <span className="font-bold text-green-600">₹{calculateTotalCost().toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setSelectedFacility(null)}
                          className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                        >
                          Confirm Booking
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-sm p-8 text-center"
              >
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaWarehouse className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Select a Facility</h3>
                <p className="text-gray-500 mb-6">
                  Choose a cold storage facility from the list to start your booking.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  {[
                    { icon: FaShieldAlt, text: "24/7 Security" },
                    { icon: FaLeaf, text: "Quality Control" },
                    { icon: FaBolt, text: "Power Backup" },
                    { icon: FaTruck, text: "Loading Docks" }
                  ].map((feature, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <feature.icon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">{feature.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* My Bookings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{booking.facilityName}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status === 'confirmed' ? (
                          <><FaCheckCircle className="mr-1" /> Confirmed</>
                        ) : (
                          <><FaCalendarAlt className="mr-1" /> Pending</>
                        )}
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      booking.paymentStatus === 'paid'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {booking.paymentStatus}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaWarehouse className="h-4 w-4 mr-2" />
                      {booking.quantity} tons
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaCalendarAlt className="h-4 w-4 mr-2" />
                      {booking.startDate} to {booking.endDate}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-900">
                      Total: ₹{booking.totalAmount.toLocaleString()}
                    </span>
                    <div className="space-x-2">
                      {booking.status === 'pending' && (
                        <button className="px-3 py-1 text-sm text-red-600 hover:text-red-700">
                          Cancel
                        </button>
                      )}
                      {booking.paymentStatus === 'awaiting' && (
                        <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
                          Pay Now
                        </button>
                      )}
                      <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800">
                        Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {bookings.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm"
              >
                <FaWarehouse className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Bookings Yet</h3>
                <p className="text-gray-500">Start by selecting a facility to make your first booking.</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ColdStorage; 