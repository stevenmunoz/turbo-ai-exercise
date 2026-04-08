#!/bin/bash

# Starter Template - Conductor Run Script
# Starts React web dev server with process monitoring

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
WEB_PID=""

# Cleanup function
cleanup() {
    print_warning "Shutting down services..."

    if [[ -n "$WEB_PID" ]]; then
        print_status "Stopping web dev server (PID: $WEB_PID)..."
        kill -TERM $WEB_PID 2>/dev/null || true
        wait $WEB_PID 2>/dev/null || true
        print_status "Web dev server stopped"
    fi

    # Clean up any remaining processes on known ports
    for port in 3000; do
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
for port in 3000; do
    if is_port_in_use $port; then
        print_warning "Port $port in use, killing existing process..."
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 1
    fi
done

# ============================================================================
# STEP 2: Start Web Dev Server
# ============================================================================

WEB_LOG="$PROJECT_ROOT/logs/web.log"
mkdir -p "$PROJECT_ROOT/logs"

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
# STEP 3: Display Status and Monitor
# ============================================================================

echo
print_status "Development environment is running!"
echo
print_status "Services:"
if [[ "$WEB_READY" == "true" ]]; then
    print_status "   Web App:          http://localhost:3000"
fi
echo
print_status "Logs:"
print_status "   Web:      $WEB_LOG"
echo
print_status "Hot reload enabled. Press Ctrl+C to stop all servers."
echo

# Monitor processes
while true; do
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
