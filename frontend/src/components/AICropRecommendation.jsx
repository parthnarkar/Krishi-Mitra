import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import '../styles/AICropRecommendation.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AICropRecommendation = () => {
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
  const [isAnimating, setIsAnimating] = useState(false);

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
        const response = await axios.get('http://localhost:5000/regions');
        setAllRegions(response.data);
      } catch (err) {
        console.error('Error fetching regions:', err);
        // Use fallback data if API fails
        setAllRegions([
          {
            name: 'North India',
            major_cities: ['Delhi', 'Chandigarh', 'Lucknow', 'Jaipur'],
            climate: 'Temperate with hot summers and cold winters',
            typical_crops: ['Wheat', 'Rice', 'Sugarcane', 'Cotton']
          },
          {
            name: 'South India',
            major_cities: ['Bangalore', 'Chennai', 'Hyderabad', 'Kochi'],
            climate: 'Tropical with moderate temperatures',
            typical_crops: ['Rice', 'Coconut', 'Spices', 'Coffee']
          },
          {
            name: 'East India',
            major_cities: ['Kolkata', 'Bhubaneswar', 'Guwahati', 'Patna'],
            climate: 'Humid with heavy monsoon rains',
            typical_crops: ['Rice', 'Jute', 'Tea', 'Spices']
          },
          {
            name: 'West India',
            major_cities: ['Mumbai', 'Pune', 'Ahmedabad', 'Nagpur'],
            climate: 'Hot and dry with coastal influence',
            typical_crops: ['Sugarcane', 'Groundnut', 'Cotton', 'Fruits']
          }
        ]);
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
    setIsAnimating(true);
    
    try {
      const response = await axios.post('http://localhost:5000/predict', {
        city,
        month: parseInt(month)
      });
      
      setWeatherData(response.data.weatherData);
      setRecommendations(response.data.allCrops || []);
      setDemandTrend(response.data.demand_trend);
      setRegion(response.data.region);
      setRegionDetails(response.data.regionDetails);
    } catch (err) {
      console.error('Error predicting crops:', err);
      setError('Failed to get crop recommendations. Please try again.');
    } finally {
      setLoading(false);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  // Get trend label based on value
  const getTrendLabel = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return 'N/A';
    }
    
    const numValue = parseFloat(value);
    if (numValue >= 0.7) return 'High';
    if (numValue >= 0.4) return 'Moderate';
    return 'Low';
  };

  // Get trend color based on value
  const getTrendColor = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return 'text-gray-500';
    }
    
    const numValue = parseFloat(value);
    if (numValue >= 0.7) return 'text-green-600';
    if (numValue >= 0.4) return 'text-amber-600';
    return 'text-red-600';
  };

  // Format percentage
  const formatPercentage = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return 'N/A';
    }
    
    const numValue = parseFloat(value);
    return `${Math.round(numValue * 100)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-block mb-4 p-2 bg-green-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-brown-800 font-poppins mb-4 tracking-tight">
            AI Crop Recommendation
          </h1>
          <p className="text-lg text-brown-600 max-w-3xl mx-auto leading-relaxed">
            Get personalized crop recommendations based on your location, weather conditions, and market trends.
            Our AI analyzes multiple factors to suggest the most profitable crops for your region.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 mb-8 transform hover:scale-[1.01] border-t-4 border-green-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label htmlFor="city" className="block text-sm font-medium text-brown-700 mb-2 group-hover:text-green-600 transition-colors duration-300">
                City
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brown-400 group-hover:text-green-500 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your city"
                />
              </div>
            </div>
            <div className="group">
              <label htmlFor="month" className="block text-sm font-medium text-brown-700 mb-2 group-hover:text-green-600 transition-colors duration-300">
                Month
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brown-400 group-hover:text-green-500 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <select
                  id="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 appearance-none bg-white"
                >
                  <option value="">Select a month</option>
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brown-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center animate-shake">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
          
          <div className="mt-6 text-center">
            <button
              onClick={predictCrop}
              disabled={loading || !city || !month}
              className={`px-8 py-3 rounded-lg font-medium text-white transition-all duration-300 transform hover:scale-105 ${
                loading ? 'bg-gray-400 cursor-not-allowed' :
                !city || !month ? 'bg-gray-400 cursor-not-allowed' :
                'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Get Recommendations
                </span>
              )}
            </button>
          </div>
        </div>

        {weatherData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in-up">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 transform hover:scale-[1.02] hover:rotate-1 border-t-4 border-amber-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-brown-800">Temperature</h3>
              </div>
              <p className="text-3xl font-bold text-amber-600">{weatherData.temperature}°C</p>
              <p className="text-sm text-brown-500 mt-2">Current temperature in {city}</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 transform hover:scale-[1.02] border-t-4 border-blue-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-brown-800">Humidity</h3>
              </div>
              <p className="text-3xl font-bold text-blue-600">{weatherData.humidity}%</p>
              <p className="text-sm text-brown-500 mt-2">Current humidity level</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 transform hover:scale-[1.02] hover:-rotate-1 border-t-4 border-green-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-brown-800">Rainfall</h3>
              </div>
              <p className="text-3xl font-bold text-green-600">{weatherData.rainfall} mm</p>
              <p className="text-sm text-brown-500 mt-2">Expected rainfall</p>
            </div>
          </div>
        )}

        {region && regionDetails && (
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 mb-8 animate-fade-in-up border-t-4 border-brown-500">
            <h2 className="text-2xl font-bold text-brown-800 mb-4 font-poppins flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-brown-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Region Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <h3 className="text-lg font-semibold text-brown-700 mb-2">Region</h3>
                <p className="text-brown-600">{region}</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <h3 className="text-lg font-semibold text-brown-700 mb-2">Climate</h3>
                <p className="text-brown-600">{regionDetails.climate}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-brown-700 mb-2">Typical Crops</h3>
                <div className="flex flex-wrap gap-2">
                  {regionDetails.typicalCrops?.map((crop, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors duration-300"
                    >
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {recommendations.map((crop, index) => (
    <div 
      key={index} 
      className={`w-full rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border-l-4 ${
        index === 0 
          ? 'bg-green-50 border-green-500 shadow-green-200 animate-glow' 
          : 'bg-white border-brown-300'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className={`text-xl font-bold ${index === 0 ? 'text-green-700' : 'text-brown-800'}`}>
          {crop.name}
        </h3>
        {index === 0 && (
          <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold animate-pulse border border-green-300 shadow-sm">
            Best Match
          </span>
        )}
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-brown-600">Suitability Score</span>
          <span className={`text-sm font-medium ${index === 0 ? 'text-green-700' : 'text-green-600'}`}>
            {crop.score}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div 
            className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${
              crop.score >= 80 ? 'bg-green-500' : 
              crop.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: isAnimating ? '0%' : `${crop.score}%` }}
          ></div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
          <p className="text-sm text-brown-600 mb-1">Market Price</p>
          <p className="font-semibold text-brown-800">₹{crop.marketPrice}/kg</p>
        </div>
        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
          <p className="text-sm text-brown-600 mb-1">Market Trend</p>
          <p className={`font-semibold ${getTrendColor(crop.marketTrend)}`}>
            {getTrendLabel(crop.marketTrend)}
          </p>
        </div>
        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
          <p className="text-sm text-brown-600 mb-1">Demand Trend</p>
          <p className={`font-semibold ${getTrendColor(crop.demandTrend)}`}>
            {getTrendLabel(crop.demandTrend)}
          </p>
        </div>
        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
          <p className="text-sm text-brown-600 mb-1">Demand Percentage</p>
          <p className="font-semibold text-brown-800">
            {formatPercentage(crop.demandTrend)}
          </p>
        </div>
      </div>
    </div>
  ))}
</div>

      </div>
    </div>
  );
};

export default AICropRecommendation; 