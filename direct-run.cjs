#!/usr/bin/env node

/**
 * This is a CommonJS script that can directly run Astro without using npx
 * Helpful when there are issues with PATH or npx resolution
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ASTRO_PATHS = [
  './node_modules/.bin/astro',
  './node_modules/astro/dist/cli/astro.js'
];

function findAstroPath() {
  for (const aPath of ASTRO_PATHS) {
    try {
      const resolvedPath = path.resolve(process.cwd(), aPath);
      if (fs.existsSync(resolvedPath)) {
        return resolvedPath;
      }
    } catch (e) {
      console.error(`Error checking for ${aPath}:`, e.message);
    }
  }
  return null;
}

// Get command to run (dev, build, etc.)
const command = process.argv[2] || 'dev';

// Find the Astro executable
const astroPath = findAstroPath();

if (!astroPath) {
  console.error('❌ Could not find Astro in node_modules.');
  console.error('Please try reinstalling dependencies with npm install.');
  process.exit(1);
}

console.log(`Found Astro at: ${astroPath}`);
console.log(`Running command: ${command}`);

// Determine if we should run as a node script or as an executable
let child;
if (astroPath.endsWith('.js')) {
  child = spawn('node', [astroPath, command], { stdio: 'inherit' });
} else {
  child = spawn(astroPath, [command], { stdio: 'inherit' });
}

child.on('error', (err) => {
  console.error(`❌ Failed to start Astro: ${err.message}`);
  console.error('Trying alternative method...');

  // Fallback to npx as a last resort
  const npxChild = spawn('npx', ['--no-install', 'astro', command], { stdio: 'inherit' });

  npxChild.on('error', (npxErr) => {
    console.error(`❌ Both methods failed. Error: ${npxErr.message}`);
    process.exit(1);
  });
});

child.on('close', (code) => {
  if (code !== 0) {
    console.error(`Astro exited with code ${code}`);
  }
  process.exit(code);
});
