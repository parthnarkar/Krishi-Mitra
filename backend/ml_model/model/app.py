from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import requests
from pytrends.request import TrendReq
from datetime import datetime, timedelta
import logging
from city_region_mapping import get_region_from_city, get_region_code

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load trained model
with open('crop_model.pkl', 'rb') as f:
    model = pickle.load(f)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# OpenWeatherMap API Key and URL
WEATHER_API_KEY = '2b5d5463eec19ec6ba7ff756575c7636'
WEATHER_API_URL = 'http://api.openweathermap.org/data/2.5/weather'

# Initialize pytrends
pytrends = TrendReq(hl='en-IN', tz=330)

def get_weather_data(city):
    """Fetch weather data for a given city."""
    try:
        params = {
            'q': city,
            'appid': WEATHER_API_KEY,
            'units': 'metric'  # Use Celsius
        }
        response = requests.get(WEATHER_API_URL, params=params)
        data = response.json()
        
        if data['cod'] != 200:
            logger.error(f"Weather API error: {data['message']}")
            return {'error': data['message']}
        
        # Extract weather data
        temperature = data['main']['temp']
        humidity = data['main']['humidity']
        
        # Extract rainfall if available
        rainfall = data.get('rain', {}).get('1h', 0)  # Rain in last 1 hour, default to 0

        return {
            'temperature': temperature,
            'humidity': humidity,
            'rainfall': rainfall
        }
    except Exception as e:
        logger.error(f"Weather data error: {str(e)}")
        return {'error': str(e)}

def get_demand_trends(crop, region):
    """Fetch demand trends for a crop using Google Trends."""
    try:
        # Use IN for India as default, can be refined based on regions
        geo_code = 'IN'
        
        # Build payload with crop name and related terms
        keywords = [crop, f"{crop} price", f"{crop} demand"]
        pytrends.build_payload(keywords, timeframe='today 3-m', geo=geo_code)
        
        # Get interest over time
        interest_data = pytrends.interest_over_time()
        
        if not interest_data.empty:
            # Calculate average interest for each keyword
            avg_interest = interest_data[keywords].mean()
            
            # Calculate overall trend (0-1 scale)
            max_interest = avg_interest.max()
            if max_interest > 0:
                trend = avg_interest[crop] / max_interest
                return {'demand_trend': float(trend)}
        
        logger.warning(f"No demand trend data found for crop: {crop}")
        return {'demand_trend': 0.5}  # Default to moderate if no data
    except Exception as e:
        logger.error(f"Demand trends error: {str(e)}")
        return {'demand_trend': 0.5}

@app.route('/weather', methods=['POST'])
def get_weather():
    """Fetch weather data based on city input."""
    try:
        data = request.json
        city = data['city']
        weather_info = get_weather_data(city)
        return jsonify(weather_info)
    except Exception as e:
        logger.error(f"Weather endpoint error: {str(e)}")
        return jsonify({'error': str(e)})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        city = data['city']
        month = int(data['month'])

        # Validate inputs
        if not city or not month:
            return jsonify({'error': 'Missing required fields'})

        if month < 1 or month > 12:
            return jsonify({'error': 'Invalid month'})

        # Get region from city
        region = get_region_from_city(city)
        if region == 'Unknown':
            logger.warning(f"Unknown city: {city}. Using default region.")
            region = 'North India'  # Default to North India

        # Log region detected
        logger.info(f"City: {city}, Region detected: {region}")

        # Get weather data
        weather_data = get_weather_data(city)
        if 'error' in weather_data:
            return jsonify({'error': weather_data['error']})

        # Get demand trends
        demand_trend = get_demand_trends('agriculture', region)

        # Prepare feature vector for prediction
        # We don't use region in our model now, but keeping the code structure for flexibility
        features = np.array([
            weather_data['temperature'],
            weather_data['humidity'],
            weather_data['rainfall'],
            month,  # month_season
            1000,   # previous_sales (default value based on dataset)
            40,     # market_price (default value based on dataset)
            demand_trend['demand_trend']  # demand_trend
        ]).reshape(1, -1)

        # Make predictions
        predictions = model.predict(features)
        recommendations = predictions.tolist()

        # Extract more relevant crop info from the dataset
        # In a real app, you'd have a database with crop details

        # Get typical conditions for recommended crops
        crop_condition = "These crops thrive in the current temperature, humidity, and rainfall conditions."
        
        # Provide more detailed information
        detailed_recommendation = {
            'crops': recommendations,
            'region': region,
            'regionDetails': {
                'name': region,
                'typicalCrops': get_typical_crops_for_region(region),
                'climate': get_climate_for_region(region)
            },
            'conditions': crop_condition,
            'demand_trend': demand_trend['demand_trend']
        }

        return jsonify(detailed_recommendation)
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({'error': str(e)})

def get_typical_crops_for_region(region):
    """Return typical crops for a given region."""
    typical_crops = {
        'North India': ['Wheat', 'Rice', 'Barley', 'Maize'],
        'South India': ['Rice', 'Pulses', 'Coconut', 'Banana'],
        'East India': ['Rice', 'Jute', 'Tea', 'Maize'],
        'West India': ['Cotton', 'Groundnut', 'Jowar', 'Bajra'],
        'Central India': ['Soybean', 'Wheat', 'Gram', 'Cotton'],
        'Northeast India': ['Rice', 'Jute', 'Tea', 'Banana']
    }
    return typical_crops.get(region, ['Rice', 'Wheat'])

def get_climate_for_region(region):
    """Return climate description for a given region."""
    climate_info = {
        'North India': 'Continental climate with hot summers and cold winters',
        'South India': 'Tropical climate with high humidity and moderate temperatures year-round',
        'East India': 'Sub-tropical climate with hot summers and mild winters',
        'West India': 'Arid to semi-arid climate in Rajasthan and Gujarat, Coastal climate in Maharashtra',
        'Central India': 'Tropical climate with hot summers and moderate winters',
        'Northeast India': 'Subtropical climate with high rainfall and moderate temperatures'
    }
    return climate_info.get(region, 'Varied climate depending on location')

@app.route('/demand-trends', methods=['GET'])
def fetch_demand_trends():
    """Fetch demand trends for a specific crop."""
    try:
        crop = request.args.get('crop', 'agriculture')
        city = request.args.get('city', '')
        region = get_region_from_city(city) if city else 'Unknown'
        trend_data = get_demand_trends(crop, region)
        return jsonify(trend_data)
    except Exception as e:
        logger.error(f"Demand trends endpoint error: {str(e)}")
        return jsonify({'error': str(e)})

@app.route('/regions', methods=['GET'])
def get_regions():
    """Return all available regions and their details."""
    regions = [
        {
            'name': 'North India',
            'states': ['Delhi', 'Haryana', 'Punjab', 'Uttar Pradesh', 'Uttarakhand', 'Himachal Pradesh', 'Jammu & Kashmir'],
            'major_cities': ['Delhi', 'Chandigarh', 'Lucknow', 'Jaipur', 'Dehradun', 'Shimla']
        },
        {
            'name': 'South India',
            'states': ['Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh', 'Telangana'],
            'major_cities': ['Chennai', 'Bangalore', 'Hyderabad', 'Kochi', 'Coimbatore']
        },
        {
            'name': 'East India',
            'states': ['West Bengal', 'Bihar', 'Odisha', 'Jharkhand'],
            'major_cities': ['Kolkata', 'Patna', 'Bhubaneswar', 'Ranchi']
        },
        {
            'name': 'West India',
            'states': ['Maharashtra', 'Gujarat', 'Rajasthan', 'Goa'],
            'major_cities': ['Mumbai', 'Pune', 'Ahmedabad', 'Jaipur', 'Panaji']
        },
        {
            'name': 'Central India',
            'states': ['Madhya Pradesh', 'Chhattisgarh'],
            'major_cities': ['Bhopal', 'Indore', 'Raipur', 'Jabalpur']
        },
        {
            'name': 'Northeast India',
            'states': ['Assam', 'Meghalaya', 'Manipur', 'Nagaland', 'Tripura', 'Arunachal Pradesh', 'Sikkim', 'Mizoram'],
            'major_cities': ['Guwahati', 'Shillong', 'Imphal', 'Agartala']
        }
    ]
    return jsonify(regions)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
