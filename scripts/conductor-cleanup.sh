#!/bin/bash

# Starter Template - Conductor Cleanup Script
# Runs when archiving a workspace

set -e

print_status() {
    echo -e "\033[0;32m[CONDUCTOR-CLEANUP]\033[0m $1"
}

print_status "Cleaning up workspace: ${CONDUCTOR_WORKSPACE_NAME:-unknown}"

# Remove workspace configuration
if [[ -f ".conductor-workspace" ]]; then
    rm .conductor-workspace
    print_status "Removed workspace configuration"
fi

# Clean up log files
if [[ -d "logs" ]]; then
    rm -rf logs/*.log 2>/dev/null || true
    print_status "Cleaned log files"
fi

# Kill any lingering processes on known ports
for port in 4000 5001 8080 9099 3000; do
    lsof -ti:$port 2>/dev/null | xargs kill -9 2>/dev/null || true
done

print_status "Workspace cleanup complete"
