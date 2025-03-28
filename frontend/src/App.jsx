import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  // State variables
  const [city, setCity] = useState('');
  const [month, setMonth] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [demandTrend, setDemandTrend] = useState(null);
  const [region, setRegion] = useState('');
  const [regionDetails, setRegionDetails] = useState(null);
  const [allRegions, setAllRegions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Predefined data
  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  // Fetch all regions on component mount
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get('http://localhost:5001/regions');
        setAllRegions(response.data);
      } catch (err) {
        console.error('Error fetching regions:', err);
      }
    };
    fetchRegions();
  }, []);

  // Combined prediction function
  const predictCrop = async () => {
    if (!city || !month) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Fetch weather data
      const weatherRes = await axios.post('http://localhost:5001/weather', { city });
      if (weatherRes.data.error) {
        throw new Error(weatherRes.data.error);
      }
      setWeatherData(weatherRes.data);

      // Fetch crop predictions
      const predictRes = await axios.post('http://localhost:5001/predict', {
        city,
        month: parseInt(month),
      });
      
      if (predictRes.data.error) {
        throw new Error(predictRes.data.error);
      }
      
      setRecommendations(predictRes.data.crops);
      setDemandTrend(predictRes.data.demand_trend);
      setRegion(predictRes.data.region);
      setRegionDetails(predictRes.data.regionDetails);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.error || err.message || 'Error fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center p-5">
      <h1 className="text-4xl font-bold mb-6 text-green-700 text-center">
        Krishi-Mitra Dashboard 🌾
        <p className="text-lg text-gray-600 mt-2">Your Smart Agriculture Assistant</p>
      </h1>

      {/* Input Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mb-4">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600">City:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter city name (e.g., Mumbai, Delhi, Bangalore)"
          />
          {allRegions.length > 0 && (
            <div className="mt-2">
              <details className="text-xs text-gray-500">
                <summary className="cursor-pointer">View supported regions and cities</summary>
                <div className="mt-2 p-2 bg-gray-50 rounded text-xs max-h-40 overflow-y-auto">
                  {allRegions.map((region, idx) => (
                    <div key={idx} className="mb-2">
                      <p className="font-medium">{region.name}:</p>
                      <p>Cities: {region.major_cities.join(', ')}</p>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600">Month:</label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select Month</option>
            {months.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Single Action Button */}
        <button
          onClick={predictCrop}
          disabled={loading}
          className={`w-full bg-green-500 text-white px-4 py-3 rounded-lg transition-colors font-semibold ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
          }`}
        >
          {loading ? 'Analyzing...' : 'Get Crop Recommendations'}
        </button>
      </div>

      {/* Results Section */}
      <div className="w-full max-w-3xl space-y-6">
        {loading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="text-blue-600 font-semibold mt-2">Analyzing data...</p>
          </div>
        )}

        {/* Region Information */}
        {region && regionDetails && !error && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="text-2xl mr-2">📍</span> Region Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Detected Region</p>
                <p className="text-xl font-bold text-blue-700">{region}</p>
                <p className="text-sm text-gray-600 mt-2">Climate</p>
                <p className="text-md text-blue-700">{regionDetails.climate}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Common Crops in this Region</p>
                <div className="mt-1">
                  {regionDetails.typicalCrops.map((crop, index) => (
                    <span key={index} className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2 mb-2 text-sm">
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Weather Data */}
        {weatherData && !error && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="text-2xl mr-2">🌦️</span> Weather Data
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Temperature</p>
                <p className="text-xl font-bold text-blue-700">{weatherData.temperature}°C</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Humidity</p>
                <p className="text-xl font-bold text-green-700">{weatherData.humidity}%</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Rainfall</p>
                <p className="text-xl font-bold text-purple-700">{weatherData.rainfall} mm</p>
              </div>
            </div>
          </div>
        )}

        {/* Crop Recommendations */}
        {recommendations.length > 0 && !error && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="text-2xl mr-2">🌱</span> Recommended Crops
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((crop, index) => (
                <div key={index} className="bg-green-50 p-4 rounded-lg">
                  <p className="font-medium text-green-800">{crop}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Demand Trends */}
        {demandTrend !== null && !error && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="text-2xl mr-2">📊</span> Market Analysis
            </h2>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Demand Trend Index</p>
              <p className="text-2xl font-bold text-purple-700">
                {demandTrend >= 0.7 ? 'High' : demandTrend >= 0.4 ? 'Moderate' : 'Low'}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full" 
                  style={{ width: `${Math.round(demandTrend * 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-right mt-1 text-gray-500">{Math.round(demandTrend * 100)}%</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
