import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaThermometerHalf, FaWarehouse, FaTruck, FaCalendarAlt, FaMapMarkerAlt, FaStar, FaCheckCircle, FaFilter, FaSearch, FaListAlt, FaTimesCircle } from 'react-icons/fa';
import MumbaiMap from '../components/MumbaiMap';
import { toast } from 'react-hot-toast';
import BookingManagement from '../coldStorage/BookingManagement';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ColdStoragePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('search');
  const [facilities, setFacilities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTemp, setFilterTemp] = useState('all');
  const [bookingDetails, setBookingDetails] = useState({
    quantity: '',
    duration: '',
    transportType: 'road',
    date: '',
    notes: ''
  });

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(`${API_URL}/cold-storage`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFacilities(response.data);
      
      // Simulate map loading for demo
      setTimeout(() => {
        setIsMapLoading(false);
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to load cold storage facilities';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFacilitySelect = (facility) => {
    setSelectedFacility(facility);
    setBookingDetails(prev => ({
      ...prev,
      quantity: '',
      duration: '',
      date: new Date().toISOString().split('T')[0]
    }));
  };

  const validateBooking = () => {
    const errors = [];
    if (!bookingDetails.quantity || bookingDetails.quantity <= 0) {
      errors.push('Please enter a valid quantity');
    }
    if (!bookingDetails.duration || bookingDetails.duration <= 0) {
      errors.push('Please enter a valid duration');
    }
    if (!bookingDetails.date) {
      errors.push('Please select a start date');
    }
    if (new Date(bookingDetails.date) < new Date()) {
      errors.push('Start date cannot be in the past');
    }
    
    const availableQuantity = parseInt(selectedFacility.available);
    if (parseInt(bookingDetails.quantity) > availableQuantity) {
      errors.push(`Maximum available capacity is ${availableQuantity} tons`);
    }

    return errors;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFacility) return;

    const validationErrors = validateBooking();
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }

    try {
      setShowConfirmModal(true);
    } catch (err) {
      console.error('Booking failed:', err);
      toast.error('Failed to create booking');
    }
  };

  const confirmBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const endDate = new Date(bookingDetails.date);
      endDate.setDate(endDate.getDate() + parseInt(bookingDetails.duration));

      const bookingData = {
        storageName: selectedFacility.name,
        quantity: parseInt(bookingDetails.quantity),
        startDate: bookingDetails.date,
        endDate: endDate.toISOString().split('T')[0],
        totalPrice: calculateTotalCost(),
        provider: {
          name: selectedFacility.name,
          contact: selectedFacility.contact,
          email: selectedFacility.email || 'contact@example.com'
        },
        ratePerTon: selectedFacility.pricePerTonPerDay,
        duration: parseInt(bookingDetails.duration),
        location: selectedFacility.location
      };

      await axios.post(`${API_URL}/cold-storage-bookings`, bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update available capacity locally
      const updatedFacilities = facilities.map(f => {
        if (f._id === selectedFacility._id) {
          return {
            ...f,
            available: f.available - parseInt(bookingDetails.quantity)
          };
        }
        return f;
      });
      
      setFacilities(updatedFacilities);
      setSelectedFacility(null);
      setShowConfirmModal(false);
      toast.success('Storage space booked successfully!');
      
      // Switch to bookings tab
      setActiveTab('bookings');
    } catch (err) {
      console.error('Confirmation failed:', err);
      toast.error(err.response?.data?.message || 'Failed to confirm booking');
    }
  };

  const calculateTotalCost = () => {
    if (!selectedFacility || !bookingDetails.quantity || !bookingDetails.duration) return 0;
    
    const quantity = parseFloat(bookingDetails.quantity);
    const duration = parseFloat(bookingDetails.duration);
    const pricePerTonPerDay = selectedFacility.pricePerTonPerDay;
    
    return quantity * duration * pricePerTonPerDay;
  };

  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facility.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesTemp = true;
    if (filterTemp !== 'all') {
      const temp = parseFloat(facility.temperature);
      if (filterTemp === 'frozen') {
        matchesTemp = temp <= 0;
      } else if (filterTemp === 'cold') {
        matchesTemp = temp > 0 && temp <= 5;
      } else if (filterTemp === 'cool') {
        matchesTemp = temp > 5;
      }
    }
    
    return matchesSearch && matchesTemp;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading cold storage facilities...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Cold Storage Management</h1>
            <p className="text-gray-600">Find, book and manage your cold storage facilities</p>
          </div>
          <button
            onClick={() => navigate('/bulk-buy')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md flex items-center gap-2"
          >
            <FaTruck className="text-lg" />
            Back to Bulk Buy
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors duration-200 relative ${
              activeTab === 'search'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('search')}
          >
            <span className="flex items-center gap-2">
              <FaSearch />
              Find Storage
            </span>
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors duration-200 relative ${
              activeTab === 'bookings'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('bookings')}
          >
            <span className="flex items-center gap-2">
              <FaListAlt />
              My Bookings
            </span>
          </button>
        </div>

        {activeTab === 'search' ? (
          <>
            {/* Search and Filter Section */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaFilter className="text-gray-400" />
                  <select
                    value={filterTemp}
                    onChange={(e) => setFilterTemp(e.target.value)}
                    className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  >
                    <option value="all">All Temperatures</option>
                    <option value="frozen">Frozen (≤ 0°C)</option>
                    <option value="cold">Cold (0-5°C)</option>
                    <option value="cool">Cool (> 5°C)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Map Section */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-200 hover:shadow-xl">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-green-600" />
                    Location Map
                  </h2>
                  <div className="h-[500px] bg-gray-100 rounded-lg overflow-hidden">
                    {isMapLoading ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-gray-600">Loading map...</div>
                      </div>
                    ) : (
                      <MumbaiMap />
                    )}
                  </div>
                </div>
              </div>

              {/* Facilities List */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-200 hover:shadow-xl">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <FaWarehouse className="text-green-600" />
                    Available Facilities
                  </h2>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredFacilities.map(facility => (
                      <div
                        key={facility.id}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                          selectedFacility?.id === facility.id
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200 hover:border-green-400'
                        }`}
                        onClick={() => handleFacilitySelect(facility)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg text-gray-800">{facility.name}</h3>
                          <div className="flex items-center text-yellow-500">
                            <FaStar />
                            <span className="ml-1 text-gray-700">{facility.rating}</span>
                            <span className="ml-2 text-sm text-gray-500">({facility.reviews})</span>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p className="flex items-center gap-2 text-gray-600">
                            <FaMapMarkerAlt className="text-green-600" />
                            {facility.location}
                          </p>
                          <p className="flex items-center gap-2 text-gray-600">
                            <FaThermometerHalf className="text-green-600" />
                            Temperature: {facility.temperature}
                          </p>
                          <p className="flex items-center gap-2 text-gray-600">
                            <FaWarehouse className="text-green-600" />
                            Available: {facility.available}
                          </p>
                          <p className="font-medium text-green-700 mt-2">
                            {facility.price}
                          </p>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {facility.features.map((feature, index) => (
                            <span 
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                            >
                              <FaCheckCircle className="mr-1" />
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            {selectedFacility && (
              <div className="mt-8 bg-white rounded-xl shadow-lg p-6 transition-all duration-200 hover:shadow-xl">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
                  <FaCalendarAlt className="text-green-600" />
                  Book Storage Space
                </h2>
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (tons)</label>
                      <input
                        type="number"
                        value={bookingDetails.quantity}
                        onChange={(e) => setBookingDetails(prev => ({ ...prev, quantity: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
                      <input
                        type="number"
                        value={bookingDetails.duration}
                        onChange={(e) => setBookingDetails(prev => ({ ...prev, duration: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Transport Type</label>
                      <select
                        value={bookingDetails.transportType}
                        onChange={(e) => setBookingDetails(prev => ({ ...prev, transportType: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors duration-200"
                      >
                        <option value="road">Road Transport</option>
                        <option value="rail">Rail Transport</option>
                        <option value="self">Self Arranged</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={bookingDetails.date}
                        onChange={(e) => setBookingDetails(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                    <textarea
                      value={bookingDetails.notes}
                      onChange={(e) => setBookingDetails(prev => ({ ...prev, notes: e.target.value }))}
                      rows="3"
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors duration-200"
                      placeholder="Any special requirements or instructions..."
                    ></textarea>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg border-2 border-green-100">
                    <h3 className="font-semibold text-lg text-gray-800 mb-4">Booking Summary</h3>
                    <div className="space-y-2 text-gray-600">
                      <p className="flex justify-between">
                        <span>Facility:</span>
                        <span className="font-medium text-gray-800">{selectedFacility.name}</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Price per ton per day:</span>
                        <span className="font-medium text-gray-800">{selectedFacility.price}</span>
                      </p>
                      <div className="border-t border-green-200 my-4"></div>
                      <p className="flex justify-between text-lg">
                        <span className="font-semibold">Total Cost:</span>
                        <span className="font-bold text-green-700">₹{calculateTotalCost().toLocaleString()}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedFacility(null)}
                      className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 shadow-md"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmModal && selectedFacility && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                  <h3 className="text-xl font-semibold mb-4">Confirm Booking</h3>
                  <div className="space-y-2 mb-6">
                    <p><span className="font-medium">Facility:</span> {selectedFacility.name}</p>
                    <p><span className="font-medium">Quantity:</span> {bookingDetails.quantity} tons</p>
                    <p><span className="font-medium">Duration:</span> {bookingDetails.duration} days</p>
                    <p><span className="font-medium">Start Date:</span> {bookingDetails.date}</p>
                    <p><span className="font-medium">Total Cost:</span> ₹{calculateTotalCost().toLocaleString()}</p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowConfirmModal(false)}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmBooking}
                      className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <BookingManagement />
        )}
      </div>
    </div>
  );
};

export default ColdStoragePage; 