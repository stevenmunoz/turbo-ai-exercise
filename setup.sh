#!/bin/bash
# Enterprise App Template - One-Command Setup
# This script sets up the entire development environment

set -e  # Exit on error

echo "🔧 Enterprise App Template - Setup"
echo "===================================="
echo ""

# Smart Python version detection with automatic fallback
echo "🐍 Detecting compatible Python version..."

# Try to find compatible Python in order of preference
PYTHON_CMD=""
for py_version in python3.11 python3.12 python3.10 python3; do
    if command -v $py_version &> /dev/null; then
        py_ver=$($py_version --version 2>&1 | awk '{print $2}' | cut -d'.' -f1-2)
        if [ "$py_ver" = "3.11" ] || [ "$py_ver" = "3.10" ] || [ "$py_ver" = "3.12" ]; then
            PYTHON_CMD=$py_version
            echo "✅ Found compatible Python $py_ver at $py_version"
            break
        fi
    fi
done

if [ -z "$PYTHON_CMD" ]; then
    echo "❌ No compatible Python version found (need 3.10, 3.11, or 3.12)"
    echo ""
    echo "   Python 3.13+ is not yet supported due to dependency compatibility issues."
    echo ""
    echo "📥 Installation options:"
    echo "   macOS:  brew install python@3.11"
    echo "   Ubuntu: sudo apt install python3.11 python3.11-venv"
    echo "   Windows: Download from python.org/downloads/"
    echo ""
    exit 1
fi
echo ""

# Check Node.js
echo "📦 Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "   Install: brew install node (macOS) or apt install nodejs (Linux)"
    exit 1
fi

node_version=$(node --version)
echo "✅ Node.js $node_version detected"
echo ""

# Setup environment files
echo "📋 Setting up environment files..."

# Backend .env
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env

    # Generate secure secrets
    echo "   Generating secure secrets..."
    secret_key=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
    jwt_secret=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")

    # Update .env with secrets
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|SECRET_KEY=.*|SECRET_KEY=$secret_key|" backend/.env
        sed -i '' "s|JWT_SECRET=.*|JWT_SECRET=$jwt_secret|" backend/.env
    else
        # Linux
        sed -i "s|SECRET_KEY=.*|SECRET_KEY=$secret_key|" backend/.env
        sed -i "s|JWT_SECRET=.*|JWT_SECRET=$jwt_secret|" backend/.env
    fi

    echo "✅ Created backend/.env with generated secrets"
else
    echo "   backend/.env already exists (skipping)"
fi

# Web .env
if [ ! -f web/.env ]; then
    cp web/.env.example web/.env
    echo "✅ Created web/.env"
else
    echo "   web/.env already exists (skipping)"
fi

# Mobile .env
if [ -f mobile/.env.example ] && [ ! -f mobile/.env ]; then
    cp mobile/.env.example mobile/.env
    echo "✅ Created mobile/.env"
fi

echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend

if [ ! -d "venv" ]; then
    echo "   Creating Python virtual environment..."
    $PYTHON_CMD -m venv venv
fi

# Verify virtual environment uses compatible Python version
echo "   Verifying virtual environment..."
venv_python_version=$(./venv/bin/python --version 2>&1 | awk '{print $2}' | cut -d'.' -f1-2)
if [ "$venv_python_version" != "3.11" ] && [ "$venv_python_version" != "3.10" ] && [ "$venv_python_version" != "3.12" ]; then
    echo "   ⚠️  Virtual environment created with incompatible Python $venv_python_version"
    echo "   Recreating with compatible Python..."
    rm -rf venv

    if command -v python3.11 &> /dev/null; then
        python3.11 -m venv venv
        echo "   ✅ Virtual environment recreated with Python 3.11"
    else
        echo "   ❌ Cannot create compatible virtual environment"
        echo "      Please install Python 3.11: brew install python@3.11"
        exit 1
    fi
fi

echo "   Activating virtual environment..."
source venv/bin/activate

echo "   Installing Python packages..."
pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt

echo "✅ Backend dependencies installed"
cd ..
echo ""

# Install web dependencies
echo "🌐 Installing web dependencies..."
cd web
if [ ! -d "node_modules" ]; then
    npm install --silent
    echo "✅ Web dependencies installed"
else
    echo "   node_modules already exists (skipping)"
fi
cd ..
echo ""

# Create logs directory
mkdir -p logs
echo "✅ Created logs directory"
echo ""

# Verify environment file
echo "🔑 Checking configuration..."
if [ -f "backend/.env" ]; then
    echo "✅ Environment file found"
else
    echo "⚠️  No backend/.env found — copying from .env.example"
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env from template"
fi

# Install Firebase CLI if not present
echo "🔥 Setting up Firebase Functions..."
if ! command -v firebase &> /dev/null; then
    echo "   Installing Firebase CLI..."
    npm install -g firebase-tools
    echo "✅ Firebase CLI installed"
else
    echo "✅ Firebase CLI already installed"
fi

# Create functions venv
if [ ! -d "backend/functions/venv" ]; then
    echo "   Creating functions virtual environment..."
    cd backend/functions
    $PYTHON_CMD -m venv venv
    source venv/bin/activate
    pip install --quiet --upgrade pip
    pip install --quiet -r requirements.txt
    deactivate
    cd ../..
    echo "✅ Functions dependencies installed"
else
    echo "   Functions venv already exists (skipping)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Run the development environment:"
echo "     ./dev.sh"
echo ""
echo "  2. Access your app:"
echo "     • Emulator UI:      http://localhost:4000"
echo "     • Cloud Functions:  http://localhost:5001"
echo "     • Web App:          http://localhost:3000"
echo ""
echo "Optional:"
echo "  • Edit backend/.env to customize configuration"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
