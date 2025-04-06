import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaThermometerHalf, FaWarehouse, FaTruck, FaCalendarAlt, FaMapMarkerAlt, FaStar, FaCheckCircle } from 'react-icons/fa';
import MumbaiMap from '../components/MumbaiMap';

const ColdStoragePage = () => {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    quantity: '',
    duration: '',
    transportType: 'road',
    date: '',
    notes: ''
  });

  // Sample cold storage facilities data
  const sampleFacilities = [
    {
      id: 1,
      name: 'Agro Cold Storage',
      location: 'Mumbai Central',
      capacity: '1000 tons',
      available: '500 tons',
      temperature: '4°C',
      price: '₹100/ton/day',
      rating: 4.5,
      reviews: 120,
      features: ['Temperature Control', '24/7 Monitoring', 'Security'],
      contact: '+91 98765 43210'
    },
    {
      id: 2,
      name: 'Farm Fresh Storage',
      location: 'Andheri East',
      capacity: '800 tons',
      available: '300 tons',
      temperature: '2°C',
      price: '₹120/ton/day',
      rating: 4.2,
      reviews: 85,
      features: ['Humidity Control', 'Forklift Service', 'Insurance'],
      contact: '+91 98765 43211'
    },
    {
      id: 3,
      name: 'Rural Cold Chain',
      location: 'Thane West',
      capacity: '500 tons',
      available: '200 tons',
      temperature: '0°C',
      price: '₹90/ton/day',
      rating: 4.0,
      reviews: 65,
      features: ['Cold Chain Monitoring', 'Loading Dock', 'Security'],
      contact: '+91 98765 43212'
    }
  ];

  useEffect(() => {
    // Simulate API call with sample data
    const fetchFacilities = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setFacilities(sampleFacilities);
        setLoading(false);
      } catch (err) {
        setError('Failed to load cold storage facilities. Please try again later.');
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  const handleFacilitySelect = (facility) => {
    setSelectedFacility(facility);
    setBookingDetails(prev => ({
      ...prev,
      quantity: '',
      duration: '',
      date: ''
    }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFacility) return;

    try {
      // Here you would typically make an API call to create the booking
      console.log('Booking submitted:', {
        facility: selectedFacility,
        ...bookingDetails
      });
      // Show success message or redirect
    } catch (err) {
      console.error('Booking failed:', err);
    }
  };

  const calculateTotalCost = () => {
    if (!selectedFacility || !bookingDetails.quantity || !bookingDetails.duration) return 0;
    
    const quantity = parseFloat(bookingDetails.quantity);
    const duration = parseFloat(bookingDetails.duration);
    const pricePerTonPerDay = parseFloat(selectedFacility.price.replace(/[^0-9]/g, ''));
    
    return quantity * duration * pricePerTonPerDay;
  };

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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Cold Storage Facilities</h1>
            <p className="text-gray-600">Find and book temperature-controlled storage for your produce</p>
          </div>
          <button
            onClick={() => navigate('/bulk-buy')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md flex items-center gap-2"
          >
            <FaTruck className="text-lg" />
            Back to Bulk Buy
          </button>
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
                {facilities.map(facility => (
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
      </div>
    </div>
  );
};

export default ColdStoragePage; 