# Import necessary libraries
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle

# Load crop_data.csv
data = pd.read_csv('crop_data.csv', encoding='utf-8')
data.columns = data.columns.str.strip()

# Define features and target
X = data[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
y = data['label']

# Split the data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model using Random Forest Classifier
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save the trained model to crop_model.pkl
with open('crop_model.pkl', 'wb') as f:
    pickle.dump(model, f)

print("✅ Model training complete. crop_model.pkl saved successfully!")
