import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading cold storage facilities...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-600">{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Cold Storage Facilities</h1>
          <button
            onClick={() => navigate('/bulk-buy')}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
          >
            Back to Bulk Buy
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Location Map</h2>
              <div className="h-[500px] bg-gray-100 rounded-lg mb-6">
                {isMapLoading && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-gray-600">Loading map...</div>
                  </div>
                )}
                <MumbaiMap />
              </div>
            </div>
          </div>

          {/* Facilities List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Available Facilities</h2>
              <div className="space-y-4">
                {facilities.map(facility => (
                  <div
                    key={facility.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedFacility?.id === facility.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                    onClick={() => handleFacilitySelect(facility)}
                  >
                    <h3 className="font-semibold text-lg">{facility.name}</h3>
                    <p className="text-gray-600">{facility.location}</p>
                    <div className="mt-2 flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1">{facility.rating}</span>
                      <span className="ml-2 text-gray-500">({facility.reviews} reviews)</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Capacity: {facility.capacity}</p>
                      <p>Available: {facility.available}</p>
                      <p>Temperature: {facility.temperature}</p>
                      <p>Price: {facility.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        {selectedFacility && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Book Storage Space</h2>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity (tons)</label>
                  <input
                    type="number"
                    value={bookingDetails.quantity}
                    onChange={(e) => setBookingDetails(prev => ({ ...prev, quantity: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration (days)</label>
                  <input
                    type="number"
                    value={bookingDetails.duration}
                    onChange={(e) => setBookingDetails(prev => ({ ...prev, duration: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Transport Type</label>
                  <select
                    value={bookingDetails.transportType}
                    onChange={(e) => setBookingDetails(prev => ({ ...prev, transportType: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  >
                    <option value="road">Road Transport</option>
                    <option value="rail">Rail Transport</option>
                    <option value="air">Air Transport</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delivery Date</label>
                  <input
                    type="date"
                    value={bookingDetails.date}
                    onChange={(e) => setBookingDetails(prev => ({ ...prev, date: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
                <textarea
                  value={bookingDetails.notes}
                  onChange={(e) => setBookingDetails(prev => ({ ...prev, notes: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  rows="3"
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Booking Summary</h3>
                <div className="space-y-2">
                  <p>Facility: {selectedFacility.name}</p>
                  <p>Price per ton per day: {selectedFacility.price}</p>
                  <p className="text-lg font-semibold text-primary">
                    Total Cost: ₹{calculateTotalCost().toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColdStoragePage; 