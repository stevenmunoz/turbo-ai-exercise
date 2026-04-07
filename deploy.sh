#!/bin/bash
# Deploy to Firebase

set -e

echo "🚀 Deploying to Firebase..."
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not installed"
    echo "   Install: npm install -g firebase-tools"
    exit 1
fi

# Build frontend
echo "📦 Building frontend..."
cd web
npm run build
cd ..
echo "✅ Frontend built"
echo ""

# Deploy to Firebase
echo "🔥 Deploying Firebase services..."
firebase deploy --only functions,firestore,hosting

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Deployment complete!"
echo ""
echo "Your app is live. Check Firebase console for URLs:"
echo "  firebase open hosting:site"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
