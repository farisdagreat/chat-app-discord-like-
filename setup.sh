#!/bin/bash
echo "🚀 Starting ChatVoice Application..."
echo ""
echo "📦 Installing backend dependencies..."
cd backend && npm install

echo ""
echo "📦 Installing frontend dependencies..."  
cd ../frontend && npm install

echo ""
echo "✅ Installation complete!"
echo ""
echo "To start the app:"
echo "  Terminal 1: cd backend && npm run dev"
echo "  Terminal 2: cd frontend && npm run dev"
echo ""
echo "Then open http://localhost:5173 in your browser"
