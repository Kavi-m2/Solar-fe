import React, { useState } from 'react';
import './App.css';

function App() {
  const [inputs, setInputs] = useState({
    sun_altitude: '',
    sun_azimuth: '',
    cloud_index: '',
    dust_level: ''
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = e => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError('');
    setResult(null);
    try {
      const res = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sun_altitude: parseFloat(inputs.sun_altitude),
          sun_azimuth: parseFloat(inputs.sun_azimuth),
          cloud_index: parseFloat(inputs.cloud_index),
          dust_level: parseFloat(inputs.dust_level)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Status ${res.status}`);
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="App">
      <div className="panel">
        <h1>Solar Panel Tilt Predictor</h1>

        <div className="form-group">
          <label>Sun Altitude (°):</label>
          <input
            type="number"
            name="sun_altitude"
            value={inputs.sun_altitude}
            onChange={handleChange}
            placeholder="e.g. 45"
          />
        </div>

        <div className="form-group">
          <label>Sun Azimuth (°):</label>
          <input
            type="number"
            name="sun_azimuth"
            value={inputs.sun_azimuth}
            onChange={handleChange}
            placeholder="e.g. 180"
          />
        </div>

        <div className="form-group">
          <label>Cloud Index (0–1):</label>
          <input
            type="number"
            step="0.01"
            name="cloud_index"
            value={inputs.cloud_index}
            onChange={handleChange}
            placeholder="e.g. 0.2"
          />
        </div>

        <div className="form-group">
          <label>Dust Level (0–1):</label>
          <input
            type="number"
            step="0.01"
            name="dust_level"
            value={inputs.dust_level}
            onChange={handleChange}
            placeholder="e.g. 0.1"
          />
        </div>

        <button onClick={handleSubmit}>Predict</button>

        {error && <div className="error">{error}</div>}

        {result && (
          <div className="result">
            <h2>Prediction</h2>
            <p>Optimal Tilt: <strong>{result.optimal_tilt.toFixed(2)}°</strong></p>
            <p>Energy Output: <strong>{result.energy_output.toFixed(2)} W/m²</strong></p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
