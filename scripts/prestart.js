const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Start Python backend
console.log('🚀 Starting Python backend...');
const python = spawn('python', ['backend/main.py']);

python.stdout.on('data', (data) => {
  console.log(`🐍 Backend: ${data}`);
  if (data.includes('Application startup complete')) {
    console.log('✅ Backend ready! Starting Expo...');
    // Now start Expo
    const expo = spawn('npx', ['expo', 'start'], { 
      stdio: 'inherit',
      shell: true 
    });
  }
});

python.stderr.on('data', (data) => {
  console.error(`❌ Backend error: ${data}`);
});