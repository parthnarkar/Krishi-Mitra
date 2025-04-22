const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Installing Python dependencies for crop recommendation model...');

try {
  // Check if Python is installed
  try {
    execSync('python --version', { stdio: 'ignore' });
  } catch (error) {
    console.error('Python is not installed or not in PATH. Please install Python 3.7+ and try again.');
    process.exit(1);
  }

  // Path to requirements.txt
  const requirementsPath = path.join(__dirname, 'ml_model', 'requirements.txt');
  
  // Check if requirements.txt exists
  if (!fs.existsSync(requirementsPath)) {
    console.error(`Requirements file not found at ${requirementsPath}`);
    process.exit(1);
  }

  // Install dependencies
  console.log('Installing dependencies from requirements.txt...');
  execSync(`pip install -r "${requirementsPath}"`, { stdio: 'inherit' });
  
  console.log('Python dependencies installed successfully!');
} catch (error) {
  console.error('Error installing Python dependencies:', error.message);
  process.exit(1);
} 