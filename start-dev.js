const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Algebro development environment...\n');

// Check if Python is installed
const checkPython = () => {
  return new Promise((resolve) => {
    const python = spawn('python', ['--version']);
    python.on('error', () => {
      console.error('❌ Python is not installed!');
      console.error('Please install Python 3.8+ from https://python.org');
      process.exit(1);
    });
    python.on('close', () => resolve(true));
  });
};

// Check if backend dependencies are installed
const checkBackendDeps = () => {
  const reqFile = path.join(__dirname, 'backend', 'requirements.txt');
  if (!fs.existsSync(reqFile)) {
    console.error('❌ backend/requirements.txt not found!');
    process.exit(1);
  }
  
  console.log('📦 Installing Python dependencies...');
  const pip = spawn('pip', ['install', '-r', reqFile]);
  
  pip.stdout.on('data', (data) => console.log(`🐍 ${data.toString().trim()}`));
  pip.stderr.on('data', (data) => console.error(`❌ ${data.toString().trim()}`));
  
  return new Promise((resolve) => {
    pip.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Python dependencies installed\n');
        resolve(true);
      } else {
        console.error('❌ Failed to install dependencies');
        process.exit(1);
      }
    });
  });
};

// Start FastAPI backend
const startBackend = () => {
  console.log('🐍 Starting FastAPI backend...');
  const backend = spawn('python', [path.join(__dirname, 'backend', 'main.py')]);
  
  backend.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(`📡 Backend: ${output.trim()}`);
    
    // When backend is ready, start Expo
    if (output.includes('Application startup complete') || output.includes('Uvicorn running')) {
      if (!expoStarted) {
        startExpo();
      }
    }
  });
  
  backend.stderr.on('data', (data) => {
    console.error(`❌ Backend error: ${data.toString().trim()}`);
  });
  
  backend.on('close', (code) => {
    console.log(`🔚 Backend stopped with code ${code}`);
    process.exit(code);
  });
  
  return backend;
};

let expoStarted = false;

// Start Expo
const startExpo = () => {
  expoStarted = true;
  console.log('\n📱 Starting Expo...\n');
  const expo = spawn('npx', ['expo', 'start', '--clear'], {
    stdio: 'inherit',
    shell: true
  });
  
  expo.on('close', (code) => {
    console.log(`\n🔚 Expo stopped with code ${code}`);
    process.exit(code);
  });
};

// Handle cleanup on exit
const cleanup = () => {
  console.log('\n🛑 Shutting down...');
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Main execution
(async () => {
  await checkPython();
  await checkBackendDeps();
  startBackend();
})();