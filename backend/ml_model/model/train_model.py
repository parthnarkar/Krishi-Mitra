import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from sklearn.preprocessing import LabelEncoder
import pickle
import json

def get_season(month):
    """Map month to season"""
    if month in [2, 3, 4, 5]:  # Feb-May
        return 'summer'
    elif month in [6, 7, 8, 9]:  # June-Sept
        return 'monsoon'
    else:  # Oct-Jan
        return 'winter'

def train_model():
# Load and prepare the dataset
    try:
        crop_data = pd.read_csv('Crop_recommendation.csv')
        apy_data = pd.read_csv('apy.csv')
        
        print("✅ Datasets loaded successfully")
        print(f"Crop data columns: {crop_data.columns.tolist()}")
        print(f"APY data columns: {apy_data.columns.tolist()}")
    except FileNotFoundError as e:
        print(f"❌ Error loading datasets: {e}")
        return 

    # ======================================================================
    # DATA PREPROCESSING
    # ======================================================================
    
    # Process Crop Recommendation Data
    crop_data = crop_data[['temperature', 'humidity', 'rainfall', 'label']]
    crop_data.rename(columns={'label': 'recommended_crops'}, inplace=True)
    
    # Standardize crop names
    crop_data['recommended_crops'] = crop_data['recommended_crops'].str.strip().str.lower()
    apy_data['Crop'] = apy_data['Crop'].str.strip().str.lower()
    
    print("\nUnique crops in each dataset:")
    print("Crop recommendation data:", crop_data['recommended_crops'].unique()[:10])
    print("APY data:", apy_data['Crop'].unique()[:10])
    
    # Use default month value
    month = 5  # May
    season = get_season(month)
    print(f"\nUsing month {month} ({season} season)")
    
    # Process APY Data
    try:
        # Calculate production statistics
        apy_stats = apy_data.groupby(['Crop', 'Crop_Year']).agg({
            'Production': 'mean',
            'Area': 'mean'
        }).reset_index()
        
        # Calculate features
        apy_stats['previous_sales'] = apy_stats.groupby('Crop')['Production'].shift(1)
        apy_stats['market_price'] = np.log(apy_stats['Production'] + 1) * 10
        apy_stats['demand_trend'] = apy_stats.groupby('Crop')['Production'].transform(
            lambda x: x.rolling(3, min_periods=1).mean().pct_change(fill_method=None)
        )
        
        # Get most recent year's data
        latest_apy = apy_stats.sort_values('Crop_Year').groupby('Crop').last().reset_index()
        
        # Add season column
        latest_apy['month_season'] = season
        
    except Exception as e:
        print(f"❌ Error processing APY data: {e}")
        return

    # ======================================================================
    # DATA MERGING
    # ======================================================================
    
    try:
        merged_data = pd.merge(
            crop_data,
            latest_apy,
            left_on='recommended_crops',
            right_on='Crop',
            how='inner'
        )
        
        print(f"\nAfter merging: {merged_data.shape[0]} rows")
        print("Merged columns:", merged_data.columns.tolist())
        
        if merged_data.empty:
            print("❌ Merge resulted in empty dataset!")
            return
            
        # Verify all required columns exist
        required_columns = ['month_season', 'previous_sales', 'market_price', 'demand_trend']
        missing_cols = [col for col in required_columns if col not in merged_data.columns]
        
        if missing_cols:
            print(f"❌ Missing columns after merge: {missing_cols}")
            return
            
        # Fill NA values
        merged_data['previous_sales'] = merged_data['previous_sales'].fillna(merged_data['Production'])
        merged_data['demand_trend'] = merged_data['demand_trend'].fillna(0)
        
    except Exception as e:
        print(f"❌ Error during merge: {e}")
        return

    # ======================================================================
    # FEATURE ENGINEERING
    # ======================================================================
    
    try:
        le = LabelEncoder()
        merged_data['month_season_encoded'] = le.fit_transform(merged_data['month_season'])
        
        # Save label encoders
        with open('label_encoders.pkl', 'wb') as f:
            pickle.dump({
                'month_season': le.classes_
            }, f)
            
        features = [
            'temperature', 'humidity', 'rainfall', 'month_season_encoded',
            'previous_sales', 'market_price', 'demand_trend'
        ]
        
        X = merged_data[features]
        y = merged_data['recommended_crops']
        
        print("\nFinal dataset shape:", X.shape)
        print("Target distribution:\n", y.value_counts())
        
    except Exception as e:
        print(f"❌ Error during feature engineering: {e}")
        return

    # ======================================================================
    # MODEL TRAINING
    # ======================================================================
    
    try:
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

        model = RandomForestClassifier(n_estimators=200, max_depth=25, min_samples_split=5, min_samples_leaf=1, max_features='sqrt', random_state=42, n_jobs=-1)
        model.fit(X_train, y_train)

        # Evaluation
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print(f"\n✅ Model trained successfully")
        print(f"📊 Accuracy: {accuracy:.2%}")
        print("\n📈 Classification Report:")
        print(classification_report(y_test, y_pred))
        
        # Save model
        with open('crop_model.pkl', 'wb') as f:
            pickle.dump(model, f)

        print("\n💾 Model saved as crop_model.pkl")
        
    except Exception as e:
        print(f"❌ Error during model training: {e}")
        return

if __name__ == '__main__':
    train_model()