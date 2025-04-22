const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get all regions
router.get('/regions', (req, res) => {
  try {
    // Read the city_region_mapping.py file to extract regions
    const mappingFilePath = path.join(__dirname, '../ml_model/model/city_region_mapping.py');
    const fileContent = fs.readFileSync(mappingFilePath, 'utf8');
    
    // Extract the regions dictionary using regex
    const regionsMatch = fileContent.match(/regions\s*=\s*({[\s\S]*?})/);
    if (!regionsMatch) {
      return res.status(500).json({ error: 'Could not extract regions data' });
    }
    
    // Convert the Python dictionary to a JavaScript object
    // This is a simplified approach - in production, you'd want a more robust parser
    const regionsStr = regionsMatch[1]
      .replace(/'/g, '"')  // Replace single quotes with double quotes
      .replace(/True/g, 'true')  // Replace Python boolean with JS boolean
      .replace(/False/g, 'false');
    
    let regions;
    try {
      regions = JSON.parse(regionsStr);
    } catch (e) {
      console.error('Error parsing regions:', e);
      return res.status(500).json({ error: 'Error parsing regions data' });
    }
    
    // Format the response
    const formattedRegions = Object.entries(regions).map(([name, data]) => ({
      name,
      major_cities: data.major_cities,
      climate: data.climate,
      typical_crops: data.typical_crops
    }));
    
    res.json(formattedRegions);
  } catch (error) {
    console.error('Error fetching regions:', error);
    res.status(500).json({ error: 'Failed to fetch regions' });
  }
});

// Predict crop based on city and month
router.post('/predict', (req, res) => {
  const { city, month } = req.body;
  
  if (!city || !month) {
    return res.status(400).json({ error: 'City and month are required' });
  }
  
  try {
    // Path to the Python script
    const pythonScriptPath = path.join(__dirname, '../ml_model/model/app.py');
    
    // Spawn a Python process
    const pythonProcess = spawn('python', [pythonScriptPath, city, month.toString()]);
    
    let dataString = '';
    let errorString = '';
    
    // Collect data from stdout
    pythonProcess.stdout.on('data', (data) => {
      dataString += data.toString();
    });
    
    // Collect data from stderr
    pythonProcess.stderr.on('data', (data) => {
      errorString += data.toString();
      console.error(`Python Error: ${data}`);
    });
    
    // Handle process completion
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        return res.status(500).json({ error: 'Error running prediction model' });
      }
      
      try {
        // Parse the JSON response from Python
        const result = JSON.parse(dataString);
        res.json(result);
      } catch (error) {
        console.error('Error parsing Python output:', error);
        res.status(500).json({ error: 'Error parsing prediction results' });
      }
    });
  } catch (error) {
    console.error('Error running prediction:', error);
    res.status(500).json({ error: 'Failed to run prediction' });
  }
});

module.exports = router; 