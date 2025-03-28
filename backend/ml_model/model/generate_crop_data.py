import pandas as pd

data = {
    "N": [90, 85, 60, 78, 92, 70, 65, 75, 80, 88, 95, 72, 64, 81, 90, 77, 89, 82, 93, 86],
    "P": [42, 58, 30, 50, 45, 30, 40, 55, 35, 48, 60, 38, 44, 39, 50, 33, 15, 10, 20, 25],
    "K": [50, 40, 70, 60, 55, 40, 55, 45, 50, 58, 65, 52, 48, 53, 55, 60, 15, 10, 20, 25],
    "temperature": [22.5, 25.0, 20.0, 23.0, 24.5, 21.0, 26.0, 27.5, 24.0, 23.5, 29, 24, 26, 30, 28, 22, 25, 27, 23, 21],
    "humidity": [80, 75, 85, 78, 82, 70, 65, 72, 80, 77, 85, 73, 76, 79, 82, 75, 78, 70, 68, 72],
    "ph": [6.5, 6.8, 6.2, 6.4, 6.7, 6.0, 6.3, 6.4, 6.1, 6.3, 6.2, 6.5, 6.4, 6.3, 6.6, 6.8, 6.5, 6.7, 6.2, 6.1],
    "rainfall": [200, 180, 220, 210, 190, 150, 160, 175, 200, 185, 230, 190, 160, 210, 205, 180, 170, 200, 220, 215],
    "label": ["rice", "maize", "chickpea", "lentil", "banana", "wheat",
              "sorghum", "cotton", "potato", "tomato", "cucumber",
              "onion", "pulse", "mustard", "sugarcane",
              "sunflower", "millet", "cabbage",
              "pumpkin", "zucchini"]
}

# Create DataFrame
df = pd.DataFrame(data)

# Save as crop_data.csv in the model directory
file_path = r"C:\Users\Umesh Chitte\Desktop\Archit\KRISHIMITRA\krishi-connect\backend\ml_model\model\crop_data.csv"
df.to_csv(file_path, index=False)
print(f"✅ crop_data.csv successfully created at: {file_path}")
