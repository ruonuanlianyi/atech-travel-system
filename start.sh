#!/bin/bash

echo "🚀 Starting A-tech Travel System Setup..."
echo ""

# Backend setup
echo "📦 Installing backend dependencies..."
cd backend
npm install

echo ""
echo "🗄️  Initializing database..."
npm run init-db

echo ""
echo "🚀 Starting backend server..."
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Frontend setup
echo ""
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

echo ""
echo "🎨 Starting frontend application..."
npm start

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
