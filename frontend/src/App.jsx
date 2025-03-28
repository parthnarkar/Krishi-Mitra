import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const features = [
      parseFloat(formData.N),
      parseFloat(formData.P),
      parseFloat(formData.K),
      parseFloat(formData.temperature),
      parseFloat(formData.humidity),
      parseFloat(formData.ph),
      parseFloat(formData.rainfall),
    ];

    try {
      const response = await axios.post('http://localhost:5001/predict', {
        features: features,
      });
      setResult(response.data.recommendations[0]);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error predicting crop. Please try again.');
    }
  };

  return (
    <div className="app">
      <h1>🌾 Crop Recommendation System</h1>
      <form onSubmit={handleSubmit} className="form">
        {['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'].map((item) => (
          <div key={item} className="form-group">
            <label>{item.toUpperCase()}</label>
            <input
              type="number"
              name={item}
              value={formData[item]}
              onChange={handleChange}
              required
              step="0.01"
            />
          </div>
        ))}
        <button type="submit">🌱 Get Recommendation</button>
      </form>
      {result && (
        <div className="result">
          <h3>✅ Recommended Crop:</h3>
          <p>{result}</p>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
