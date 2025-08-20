#!/bin/bash

echo "===== REINSTALL ASTRO ====="
echo "This script will specifically reinstall Astro and its dependencies"

# Remove Astro-related packages
echo "Removing Astro packages..."
npm uninstall astro @astrojs/mdx

# Clean cache specifically for Astro
echo "Cleaning npm cache for Astro..."
npm cache clean --force astro @astrojs/mdx

# Reinstall Astro with exact version
echo "Reinstalling Astro..."
npm install astro@2.9.3 @astrojs/mdx@0.19.7 --save

# Verify installation
echo "Verifying Astro installation..."
if [ -f "./node_modules/.bin/astro" ]; then
  echo "✓ Found Astro in ./node_modules/.bin/astro"
  echo "✓ Astro reinstalled successfully"
  echo ""
  echo "You can now try running the dev server with:"
  echo "- npm run dev"
  echo "- node direct-run.cjs dev"
  echo "- npx --no-install astro dev"
else
  echo "❌ Astro reinstallation failed"
  echo "Try the full reset script: ./reset-project.sh"
fi
