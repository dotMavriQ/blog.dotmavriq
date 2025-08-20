#!/bin/bash

set -e # Exit on any error

echo "===== COMPREHENSIVE PROJECT RESET ====="
echo "This script will completely reset your project dependencies"
echo "and ensure Astro is properly installed."
echo ""

# Step 1: Clean environment
echo "Step 1: Cleaning environment..."
npm cache clean --force
rm -rf node_modules
rm -f package-lock.json
echo "✓ Environment cleaned"
echo ""

# Step 2: Check Node.js version
echo "Step 2: Checking Node.js version..."
node -v
if [ $? -ne 0 ]; then
  echo "⚠️ Node.js not found. Please install Node.js 16 or later."
  exit 1
fi
echo "✓ Node.js is installed"
echo ""

# Step 3: Install dependencies
echo "Step 3: Installing dependencies..."
npm install
echo "✓ Dependencies installed"
echo ""

# Step 4: Verify Astro installation
echo "Step 4: Verifying Astro installation..."
echo "Checking for local Astro..."
if [ -f "./node_modules/.bin/astro" ]; then
  echo "✓ Local Astro found at ./node_modules/.bin/astro"
else
  echo "⚠️ Local Astro not found in node_modules"
  echo "Attempting to reinstall Astro specifically..."
  npm install astro@2.9.3 --save
fi
echo ""

# Step 5: Test Astro execution
echo "Step 5: Testing Astro execution..."
echo "Trying to execute Astro via npx..."
npx astro --version
if [ $? -ne 0 ]; then
  echo "⚠️ Astro execution via npx failed"
  echo "Trying alternative method..."
  ./node_modules/.bin/astro --version
  if [ $? -ne 0 ]; then
    echo "⚠️ Astro execution via node_modules path failed"
    echo "Installing Astro globally as a fallback..."
    npm install -g astro
  else
    echo "✓ Astro executes via node_modules path"
  fi
else
  echo "✓ Astro executes via npx"
fi
echo ""

# Step 6: Create alternative execution scripts
echo "Step 6: Creating alternative execution scripts..."

cat > run-dev.js << 'EOL'
#!/usr/bin/env node

// Direct execution script for Astro
const { spawn } = require('child_process');
const path = require('path');

// Try to find Astro in different locations
const possiblePaths = [
  path.join(__dirname, 'node_modules', '.bin', 'astro'),
  path.join(__dirname, 'node_modules', 'astro', 'dist', 'cli', 'astro.js')
];

let astroPath = null;
for (const p of possiblePaths) {
  try {
    if (require('fs').existsSync(p)) {
      astroPath = p;
      break;
    }
  } catch (e) {
    console.error(`Error checking path ${p}:`, e);
  }
}

if (!astroPath) {
  console.error('Could not find Astro executable in node_modules');
  console.error('Falling back to npx execution');

  const npx = spawn('npx', ['astro', 'dev'], { stdio: 'inherit' });

  npx.on('error', (err) => {
    console.error('Failed to start npx process:', err);
    process.exit(1);
  });

  npx.on('close', (code) => {
    process.exit(code);
  });
} else {
  console.log(`Found Astro at: ${astroPath}`);

  const astro = spawn('node', [astroPath, 'dev'], { stdio: 'inherit' });

  astro.on('error', (err) => {
    console.error('Failed to start Astro process:', err);
    process.exit(1);
  });

  astro.on('close', (code) => {
    process.exit(code);
  });
}
EOL

chmod +x run-dev.js
echo "✓ Created Node.js alternative execution script: run-dev.js"

cat > start-dev.sh << 'EOL'
#!/bin/bash

# Try multiple methods to run Astro dev server

echo "Attempting to start Astro dev server..."
echo "Method 1: Using npm script"
npm run dev

if [ $? -ne 0 ]; then
  echo "Method 1 failed, trying Method 2: Direct npx"
  npx astro dev

  if [ $? -ne 0 ]; then
    echo "Method 2 failed, trying Method 3: Node.js script"
    node run-dev.js

    if [ $? -ne 0 ]; then
      echo "Method 3 failed, trying Method 4: Local path"
      ./node_modules/.bin/astro dev

      if [ $? -ne 0 ]; then
        echo "❌ All methods failed. Please try these manual steps:"
        echo "1. npm install -g astro@2.9.3"
        echo "2. astro dev"
      fi
    fi
  fi
fi
EOL

chmod +x start-dev.sh
echo "✓ Created shell alternative execution script: start-dev.sh"
echo ""

# Step 7: Verify package.json
echo "Step 7: Verifying package.json..."
jq . package.json > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "⚠️ package.json might be corrupted"
  # Create a minimal working package.json if needed
  if [ ! -f "package.json.backup" ]; then
    cp package.json package.json.backup
  fi

  cat > package.json << 'EOL'
{
  "name": "jonatan-devblog",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "node run-dev.js",
    "start": "node run-dev.js",
    "build": "npx astro build",
    "preview": "npx astro preview",
    "astro": "npx astro",
    "deploy": "npm run build && npx gh-pages -d dist -b gh-pages"
  },
  "dependencies": {
    "@astrojs/mdx": "^0.19.7",
    "astro": "^2.9.3",
    "yargs-parser": "^21.1.1"
  },
  "devDependencies": {
    "gh-pages": "^6.0.0"
  }
}
EOL

  echo "✓ Created a fixed package.json"
else
  echo "✓ package.json is valid"
fi
echo ""

# Final Step: Summary and instructions
echo "===== RESET COMPLETE ====="
echo "Your project has been reset and dependencies reinstalled."
echo "To start the development server, try one of these methods:"
echo ""
echo "Method 1: npm run dev"
echo "Method 2: ./start-dev.sh"
echo "Method 3: node run-dev.js"
echo "Method 4: npx astro dev"
echo ""
echo "If you still have issues, please check the Astro documentation or seek help in the community."
