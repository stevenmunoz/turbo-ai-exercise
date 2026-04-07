#!/bin/bash

# Starter Template - Conductor Setup Script
# Sets up Firebase Cloud Functions (Python) + React web app workspace

set -e

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[CONDUCTOR-SETUP]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[CONDUCTOR-SETUP]${NC} $1"
}

print_error() {
    echo -e "${RED}[CONDUCTOR-SETUP]${NC} $1"
}

# Default workspace name if not set
if [[ -z "$CONDUCTOR_WORKSPACE_NAME" ]]; then
    CONDUCTOR_WORKSPACE_NAME="default"
fi

print_status "Setting up Starter Template workspace"
print_status "Project root: $PROJECT_ROOT"
print_status "Workspace: $CONDUCTOR_WORKSPACE_NAME"

cd "$PROJECT_ROOT"

# ============================================================================
# STEP 1: Environment Variables
# ============================================================================

print_status "Setting up environment variables..."

if [[ -n "$CONDUCTOR_ROOT_PATH" ]]; then
    print_status "Using main project at: $CONDUCTOR_ROOT_PATH"

    # Copy backend .env from main project
    BACKEND_ENV_SOURCE="$CONDUCTOR_ROOT_PATH/backend/.env"
    BACKEND_ENV_DEST="$PROJECT_ROOT/backend/.env"
    if [[ -f "$BACKEND_ENV_SOURCE" ]]; then
        cp "$BACKEND_ENV_SOURCE" "$BACKEND_ENV_DEST"
        print_status "Copied backend/.env from main project"
    elif [[ -f "$PROJECT_ROOT/backend/.env.example" ]]; then
        cp "$PROJECT_ROOT/backend/.env.example" "$BACKEND_ENV_DEST"
        print_status "Created backend/.env from .env.example"
    fi

    # Copy web .env from main project
    WEB_ENV_SOURCE="$CONDUCTOR_ROOT_PATH/web/.env"
    WEB_ENV_DEST="$PROJECT_ROOT/web/.env"
    if [[ -f "$WEB_ENV_SOURCE" ]]; then
        cp "$WEB_ENV_SOURCE" "$WEB_ENV_DEST"
        print_status "Copied web/.env from main project"
    fi
else
    # No main project — use .env.example as fallback
    if [[ ! -f "backend/.env" ]] && [[ -f "backend/.env.example" ]]; then
        cp backend/.env.example backend/.env
        print_status "Created backend/.env from .env.example"
    else
        print_status "backend/.env already exists"
    fi
fi

# ============================================================================
# STEP 2: Check Prerequisites
# ============================================================================

print_status "Checking prerequisites..."

# Check Python
PYTHON_CMD=""
for cmd in python3.12 python3.11 python3; do
    if command -v "$cmd" &>/dev/null; then
        PYTHON_CMD="$cmd"
        break
    fi
done

if [[ -z "$PYTHON_CMD" ]]; then
    print_error "Python 3.11+ is required but not found"
    exit 1
fi

PYTHON_VERSION=$($PYTHON_CMD --version 2>&1)
print_status "Found $PYTHON_VERSION"

# Check Node.js
if ! command -v node &>/dev/null; then
    print_error "Node.js is required but not found"
    exit 1
fi
NODE_VERSION=$(node --version)
print_status "Found Node.js $NODE_VERSION"

# Check Firebase CLI
if ! command -v firebase &>/dev/null; then
    print_warning "Firebase CLI not found. Installing..."
    npm install -g firebase-tools
    print_status "Firebase CLI installed"
else
    print_status "Firebase CLI found"
fi

# ============================================================================
# STEP 3: Backend Dependencies
# ============================================================================

print_status "Setting up backend..."

# Create backend venv if it doesn't exist
if [[ ! -d "backend/venv" ]]; then
    print_status "Creating Python virtual environment..."
    cd backend
    $PYTHON_CMD -m venv venv
    source venv/bin/activate
    pip install --quiet --upgrade pip
    pip install --quiet -r requirements.txt
    deactivate
    cd "$PROJECT_ROOT"
    print_status "Backend dependencies installed"
else
    print_status "Backend venv already exists"
fi

# Create functions venv if it doesn't exist
if [[ ! -d "backend/functions/venv" ]]; then
    print_status "Creating functions virtual environment..."
    cd backend/functions
    $PYTHON_CMD -m venv venv
    source venv/bin/activate
    pip install --quiet --upgrade pip
    pip install --quiet -r requirements.txt
    deactivate
    cd "$PROJECT_ROOT"
    print_status "Functions dependencies installed"
else
    print_status "Functions venv already exists"
fi

# ============================================================================
# STEP 4: Frontend Dependencies
# ============================================================================

print_status "Setting up frontend..."

if [[ -d "web" ]] && [[ ! -d "web/node_modules" ]]; then
    cd web
    npm install
    cd "$PROJECT_ROOT"
    print_status "Web dependencies installed"
else
    print_status "Web dependencies already installed"
fi

# ============================================================================
# STEP 5: Create Workspace Configuration
# ============================================================================

mkdir -p logs

cat > .conductor-workspace <<EOF
# Conductor Workspace Configuration
WORKSPACE_NAME=$CONDUCTOR_WORKSPACE_NAME
WORKSPACE_PATH=$PROJECT_ROOT
SETUP_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
ROOT_PATH=${CONDUCTOR_ROOT_PATH:-$PROJECT_ROOT}
NODE_VERSION=$NODE_VERSION
PYTHON_VERSION=$PYTHON_VERSION
APP_TYPE=firebase-cloud-functions-react
EOF

print_status "Workspace configuration saved"

echo
print_status "Setup complete!"
echo
print_status "Services:"
print_status "   Emulator UI:     http://localhost:4000"
print_status "   Cloud Functions:  http://localhost:5001"
print_status "   Firestore:       http://localhost:8080"
print_status "   Web App:          http://localhost:3000"
echo
print_status "Run 'Run' in Conductor to start the development environment"
echo
