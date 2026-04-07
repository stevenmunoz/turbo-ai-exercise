#!/bin/bash

# Starter Template - Conductor Run Script
# Starts Firebase Emulators + React web dev server with process monitoring

set -e

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[CONDUCTOR-RUN]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[CONDUCTOR-RUN]${NC} $1"
}

print_error() {
    echo -e "${RED}[CONDUCTOR-RUN]${NC} $1"
}

# Function to check if port is in use
is_port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# If workspace not set up, run setup first
if [[ ! -f "$PROJECT_ROOT/.conductor-workspace" ]]; then
    print_warning "Workspace not set up. Running setup first..."
    chmod +x "$SCRIPT_DIR/conductor-setup.sh"
    "$SCRIPT_DIR/conductor-setup.sh"
fi

cd "$PROJECT_ROOT"

# Store PIDs for cleanup
EMULATOR_PID=""
WEB_PID=""

# Cleanup function
cleanup() {
    print_warning "Shutting down services..."

    if [[ -n "$EMULATOR_PID" ]]; then
        print_status "Stopping Firebase Emulators (PID: $EMULATOR_PID)..."
        kill -TERM $EMULATOR_PID 2>/dev/null || true
        wait $EMULATOR_PID 2>/dev/null || true
        print_status "Firebase Emulators stopped"
    fi

    if [[ -n "$WEB_PID" ]]; then
        print_status "Stopping web dev server (PID: $WEB_PID)..."
        kill -TERM $WEB_PID 2>/dev/null || true
        wait $WEB_PID 2>/dev/null || true
        print_status "Web dev server stopped"
    fi

    # Clean up any remaining processes on known ports
    for port in 4000 5001 8080 9099 3000; do
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
    done

    print_status "All services stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

print_status "Starting development environment"
print_status "Workspace: ${CONDUCTOR_WORKSPACE_NAME:-default}"
echo

# ============================================================================
# STEP 1: Kill Any Existing Processes on Required Ports
# ============================================================================

print_status "Checking ports..."
for port in 4000 5001 8080 9099 3000; do
    if is_port_in_use $port; then
        print_warning "Port $port in use, killing existing process..."
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 1
    fi
done

# ============================================================================
# STEP 2: Start Firebase Emulators
# ============================================================================

EMULATOR_LOG="$PROJECT_ROOT/logs/firebase.log"
mkdir -p "$PROJECT_ROOT/logs"

print_status "Starting Firebase Emulators..."

firebase emulators:start --only functions,firestore,auth > "$EMULATOR_LOG" 2>&1 &
EMULATOR_PID=$!
print_status "Firebase Emulators starting (PID: $EMULATOR_PID)"

# Wait for emulators to be ready
print_status "Waiting for emulators to initialize..."
EMULATOR_READY=false
for i in {1..60}; do
    if curl -s http://localhost:4000 >/dev/null 2>&1; then
        EMULATOR_READY=true
        print_status "Firebase Emulators ready!"
        break
    fi
    if ! kill -0 $EMULATOR_PID 2>/dev/null; then
        print_error "Firebase Emulators failed to start!"
        print_error "Check log: $EMULATOR_LOG"
        tail -20 "$EMULATOR_LOG" 2>/dev/null
        exit 1
    fi
    sleep 2
done

if [[ "$EMULATOR_READY" != "true" ]]; then
    print_warning "Emulators taking longer than expected..."
    print_warning "Check log: $EMULATOR_LOG"
fi

# Verify health endpoint
sleep 2
if curl -s http://localhost:5001/demo-project/us-central1/health 2>/dev/null | grep -q "healthy"; then
    print_status "Cloud Functions healthy"
else
    print_warning "Health check not responding yet (functions may still be loading)"
fi

# ============================================================================
# STEP 3: Start Web Dev Server
# ============================================================================

WEB_LOG="$PROJECT_ROOT/logs/web.log"

if [[ -d "$PROJECT_ROOT/web" ]] && [[ -f "$PROJECT_ROOT/web/package.json" ]]; then
    print_status "Starting web dev server..."

    cd "$PROJECT_ROOT/web"
    npm run dev > "$WEB_LOG" 2>&1 &
    WEB_PID=$!
    cd "$PROJECT_ROOT"

    print_status "Web dev server starting (PID: $WEB_PID)"

    # Wait for web server to be ready
    WEB_READY=false
    for i in {1..30}; do
        if curl -s http://localhost:3000 >/dev/null 2>&1; then
            WEB_READY=true
            print_status "Web dev server ready!"
            break
        fi
        if ! kill -0 $WEB_PID 2>/dev/null; then
            print_error "Web dev server failed to start!"
            print_error "Check log: $WEB_LOG"
            tail -20 "$WEB_LOG" 2>/dev/null
            break
        fi
        sleep 1
    done

    if [[ "$WEB_READY" != "true" ]]; then
        print_warning "Web server taking longer than expected..."
    fi
else
    print_warning "web/ directory not found - skipping web dev server"
fi

# ============================================================================
# STEP 4: Display Status and Monitor
# ============================================================================

echo
print_status "Development environment is running!"
echo
print_status "Services:"
print_status "   Emulator UI:     http://localhost:4000"
print_status "   Cloud Functions:  http://localhost:5001"
print_status "   Firestore:       http://localhost:8080"
print_status "   Auth:            http://localhost:9099"
if [[ "$WEB_READY" == "true" ]]; then
    print_status "   Web App:          http://localhost:3000"
fi
echo
print_status "Logs:"
print_status "   Firebase: $EMULATOR_LOG"
print_status "   Web:      $WEB_LOG"
echo
print_status "Test endpoints:"
print_status "   curl http://localhost:5001/demo-project/us-central1/health"
print_status "   curl http://localhost:5001/demo-project/us-central1/helloWorld?name=World"
echo
print_status "Hot reload enabled. Press Ctrl+C to stop all servers."
echo

# Monitor processes
while true; do
    # Monitor Firebase Emulators
    if ! kill -0 $EMULATOR_PID 2>/dev/null; then
        print_error "Firebase Emulators stopped unexpectedly!"
        print_error "Check log: $EMULATOR_LOG"
        print_status "Attempting restart..."

        firebase emulators:start --only functions,firestore,auth > "$EMULATOR_LOG" 2>&1 &
        EMULATOR_PID=$!

        sleep 10
        if ! kill -0 $EMULATOR_PID 2>/dev/null; then
            print_error "Failed to restart Firebase Emulators!"
            tail -20 "$EMULATOR_LOG" 2>/dev/null
            cleanup
            exit 1
        else
            print_status "Firebase Emulators restarted (PID: $EMULATOR_PID)"
        fi
    fi

    # Monitor web dev server
    if [[ -n "$WEB_PID" ]]; then
        if ! kill -0 $WEB_PID 2>/dev/null; then
            print_warning "Web dev server stopped. Restarting..."

            cd "$PROJECT_ROOT/web"
            npm run dev > "$WEB_LOG" 2>&1 &
            WEB_PID=$!
            cd "$PROJECT_ROOT"

            sleep 3
            if kill -0 $WEB_PID 2>/dev/null; then
                print_status "Web dev server restarted (PID: $WEB_PID)"
            else
                print_warning "Web dev server failed to restart"
                WEB_PID=""
            fi
        fi
    fi

    sleep 5
done
