#!/bin/bash
echo "Installing backend dependencies..."
cd backend
npm ci
echo "Generating Prisma client..."
npx prisma generate
echo "Build complete!"
