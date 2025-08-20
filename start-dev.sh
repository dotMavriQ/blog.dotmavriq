#!/bin/bash

# This script will run the Astro development server using npx
# to ensure the command is found regardless of installation state

echo "Starting Astro development server using npx..."

# Use npx to run astro directly without relying on PATH
npx astro dev

# If the above fails, try this alternative
if [ $? -ne 0 ]; then
  echo "Trying alternative method..."
  npx --no astro@2.9.3 dev
fi
