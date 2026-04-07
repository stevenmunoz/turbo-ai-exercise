#!/bin/bash
# Development environment startup script
# Starts Firebase Emulator and web frontend

set -e

echo "🚀 Starting Development Environment..."
echo ""

# Create logs directory if it doesn't exist
mkdir -p logs

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not installed"
    echo "   Run ./setup.sh to install it"
    exit 1
fi

# Function to kill background processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    jobs -p | xargs -r kill 2>/dev/null || true
    exit
}

trap cleanup INT TERM

# Start Firebase Emulator (with Functions)
echo "🔥 Starting Firebase Emulator..."
firebase emulators:start --only functions,firestore,auth > logs/firebase.log 2>&1 &
FIREBASE_PID=$!
echo "✅ Firebase Emulator starting (PID: $FIREBASE_PID)"
echo "   Logs: logs/firebase.log"

# Wait for Firebase Emulator to be ready
echo ""
echo "⏳ Waiting for Firebase Emulator to start..."
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if curl -sf http://localhost:4000 > /dev/null 2>&1; then
        echo "✅ Firebase Emulator ready"
        break
    fi
    sleep 2
    attempt=$((attempt + 1))
    if [ $attempt -eq $max_attempts ]; then
        echo "❌ Firebase Emulator failed to start"
        echo ""
        echo "📋 Last 20 lines of firebase log:"
        tail -20 logs/firebase.log
        cleanup
        exit 1
    fi
done

# Start Web
echo ""
echo "🌐 Starting Web Frontend..."
cd web
if [ -d "node_modules" ]; then
    npm run dev > ../logs/web.log 2>&1 &
    WEB_PID=$!
    echo "✅ Web started (PID: $WEB_PID)"
    echo "   Logs: logs/web.log"
else
    echo "⚠️  node_modules not found. Run ./setup.sh first"
    cleanup
    exit 1
fi
cd ..

# Health check for web
echo ""
echo "⏳ Waiting for web frontend to start..."
WEB_RETRIES=0
WEB_MAX_RETRIES=20
while [ $WEB_RETRIES -lt $WEB_MAX_RETRIES ]; do
    if curl -sf http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Web frontend is responding"
        break
    fi
    WEB_RETRIES=$((WEB_RETRIES + 1))
    if [ $WEB_RETRIES -eq $WEB_MAX_RETRIES ]; then
        echo "⚠️  Web frontend may still be starting"
        echo "   Check logs/web.log if it doesn't load in your browser"
        break
    fi
    sleep 1
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Development environment is running!"
echo ""
echo "📍 Services:"
echo "   • Emulator UI:     http://localhost:4000"
echo "   • Cloud Functions: http://localhost:5001/<project-id>/us-central1/<functionName>"
echo "   • Firestore:       http://localhost:8080"
echo "   • Web App:         http://localhost:3000"
echo ""
echo "💡 Example function calls:"
echo "   curl http://localhost:5001/<project-id>/us-central1/helloWorld"
echo "   curl http://localhost:5001/<project-id>/us-central1/health"
echo ""
echo "📝 Logs:"
echo "   • Firebase: tail -f logs/firebase.log"
echo "   • Web:      tail -f logs/web.log"
echo ""
echo "🛑 Press Ctrl+C to stop all services"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Wait for all background processes
wait
