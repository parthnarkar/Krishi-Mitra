import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import pickle

# Load and prepare the dataset
data = pd.read_csv('crop_data.csv')

# Check for missing values and handle them if necessary
data.dropna(inplace=True)

# Encode categorical variables
data['month_season'] = data['month_season'].astype('category').cat.codes
data['demand_trend'] = data['demand_trend'].astype('category').cat.codes

# Define features and target
features = ['temperature', 'humidity', 'rainfall', 'month_season',
            'previous_sales', 'market_price', 'demand_trend']

X = data[features]
y = data['recommended_crops']

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Initialize and train a Random Forest model
model = RandomForestClassifier(
    n_estimators=150,  # Increased for better accuracy
    max_depth=20,  # Limiting depth to prevent overfitting
    min_samples_split=4,  # Minimum samples required to split a node
    min_samples_leaf=2,  # Minimum samples required at a leaf node
    random_state=42
)
model.fit(X_train, y_train)

# Evaluate model accuracy
accuracy = model.score(X_test, y_test)
print(f"✅ Model training completed with accuracy: {accuracy:.2f}")

# Save the trained model to a file
with open('crop_model.pkl', 'wb') as f:
    pickle.dump(model, f)

print("📦 Model saved successfully as 'crop_model.pkl'.")
