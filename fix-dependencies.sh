#!/bin/bash

# Clean npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules
rm -f package-lock.json

# Reinstall dependencies
npm install

# Install missing yargs-parser specifically
npm install yargs-parser@21.1.1

# Install astro CLI globally to ensure the command is available
npm install -g astro

# Verify astro is installed correctly
echo "Checking astro installation..."
which astro || echo "Astro not found in PATH. Try using npx instead."

echo "Dependencies reinstalled. Try running 'npm run dev' again."
echo "If that doesn't work, try running 'npx astro dev' instead."
