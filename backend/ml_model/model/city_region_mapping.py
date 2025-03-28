# Mapping of Indian cities to their regions
CITY_REGION_MAPPING = {
    # North India
    'delhi': 'North India',
    'new delhi': 'North India',
    'chandigarh': 'North India',
    'jaipur': 'North India',
    'lucknow': 'North India',
    'kanpur': 'North India',
    'agra': 'North India',
    'varanasi': 'North India',
    'amritsar': 'North India',
    'jammu': 'North India',
    'srinagar': 'North India',
    'dehradun': 'North India',
    'shimla': 'North India',
    'ludhiana': 'North India',
    'meerut': 'North India',
    'ghaziabad': 'North India',
    'noida': 'North India',
    'faridabad': 'North India',
    'gurugram': 'North India',
    'gurgaon': 'North India',
    
    # South India
    'bangalore': 'South India',
    'bengaluru': 'South India',
    'chennai': 'South India',
    'hyderabad': 'South India',
    'kochi': 'South India',
    'thiruvananthapuram': 'South India',
    'coimbatore': 'South India',
    'mysore': 'South India',
    'mysuru': 'South India',
    'vijayawada': 'South India',
    'visakhapatnam': 'South India',
    'madurai': 'South India',
    'mangalore': 'South India',
    'mangaluru': 'South India',
    'trichy': 'South India',
    'tiruchirappalli': 'South India',
    'hubli': 'South India',
    'dharwad': 'South India',
    'pondicherry': 'South India',
    'puducherry': 'South India',
    
    # East India
    'kolkata': 'East India',
    'patna': 'East India',
    'bhubaneswar': 'East India',
    'ranchi': 'East India',
    'jamshedpur': 'East India',
    'dhanbad': 'East India',
    'siliguri': 'East India',
    'cuttack': 'East India',
    'asansol': 'East India',
    'durgapur': 'East India',
    'howrah': 'East India',
    'gaya': 'East India',
    'muzaffarpur': 'East India',
    'bhagalpur': 'East India',
    'puri': 'East India',
    'bokaro': 'East India',
    
    # West India
    'mumbai': 'West India',
    'pune': 'West India',
    'ahmedabad': 'West India',
    'surat': 'West India',
    'nagpur': 'West India',
    'vadodara': 'West India',
    'nashik': 'West India',
    'rajkot': 'West India',
    'thane': 'West India',
    'navi mumbai': 'West India',
    'aurangabad': 'West India',
    'solapur': 'West India',
    'kolhapur': 'West India',
    'amravati': 'West India',
    'bhavnagar': 'West India',
    'gandhinagar': 'West India',
    'jamnagar': 'West India',
    'udaipur': 'West India',
    'jodhpur': 'West India',
    'ajmer': 'West India',
    'kota': 'West India',
    'bikaner': 'West India',
    
    # Central India
    'bhopal': 'Central India',
    'indore': 'Central India',
    'jabalpur': 'Central India',
    'gwalior': 'Central India',
    'raipur': 'Central India',
    'bilaspur': 'Central India',
    'bhilai': 'Central India',
    'ujjain': 'Central India',
    'sagar': 'Central India',
    'satna': 'Central India',
    'rewa': 'Central India',
    'katni': 'Central India',
    'durg': 'Central India',
    'ambikapur': 'Central India',
    'korba': 'Central India',
    
    # Northeast India
    'guwahati': 'Northeast India',
    'imphal': 'Northeast India',
    'shillong': 'Northeast India',
    'agartala': 'Northeast India',
    'kohima': 'Northeast India',
    'itanagar': 'Northeast India',
    'gangtok': 'Northeast India',
    'aizawl': 'Northeast India',
    'dimapur': 'Northeast India',
    'silchar': 'Northeast India',
    'jorhat': 'Northeast India',
    'dibrugarh': 'Northeast India',
    'tezpur': 'Northeast India',
    'tinsukia': 'Northeast India',
    'goalpara': 'Northeast India'
}

# Region codes for the model
REGION_CODE_MAPPING = {
    'North India': 0,
    'South India': 1,
    'East India': 2,
    'West India': 3,
    'Central India': 4,
    'Northeast India': 5
}

def get_region_from_city(city):
    """
    Get the region for a given city name.
    Returns 'Unknown' if the city is not found in the mapping.
    """
    city_lower = city.lower().strip()
    return CITY_REGION_MAPPING.get(city_lower, 'Unknown')

def get_region_code(region):
    """
    Get the numeric code for a region.
    Returns 0 (North India) if the region is not found.
    """
    return REGION_CODE_MAPPING.get(region, 0) 