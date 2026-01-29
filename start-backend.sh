#!/bin/bash

echo "🚀 Starting Addepar Integration Backend..."
cd "$(dirname "$0")/server"
npx ts-node src/server.ts
