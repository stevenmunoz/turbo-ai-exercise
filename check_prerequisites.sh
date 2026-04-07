#!/bin/bash
# Check system prerequisites before running setup
# This ensures all required tools are installed

echo "🔍 Checking system prerequisites..."
echo ""

MISSING=()
WARNINGS=()

# Check for compatible Python version
echo "Checking Python..."
PYTHON_FOUND=false
for py_version in python3.11 python3.12 python3.10 python3; do
    if command -v $py_version &> /dev/null; then
        py_ver=$($py_version --version 2>&1 | awk '{print $2}' | cut -d'.' -f1-2)
        if [ "$py_ver" = "3.11" ] || [ "$py_ver" = "3.10" ] || [ "$py_ver" = "3.12" ]; then
            echo "✅ Python $py_ver found ($py_version)"
            PYTHON_FOUND=true
            break
        fi
    fi
done

if [ "$PYTHON_FOUND" = false ]; then
    MISSING+=("Python 3.10-3.12")
fi

# Check Node.js
echo "Checking Node.js..."
if command -v node &> /dev/null; then
    node_ver=$(node --version)
    echo "✅ Node.js $node_ver found"
else
    MISSING+=("Node.js")
fi

# Check npm
echo "Checking npm..."
if command -v npm &> /dev/null; then
    npm_ver=$(npm --version)
    echo "✅ npm $npm_ver found"
else
    MISSING+=("npm")
fi

# Check git
echo "Checking git..."
if command -v git &> /dev/null; then
    git_ver=$(git --version | awk '{print $3}')
    echo "✅ git $git_ver found"
else
    WARNINGS+=("git (recommended for version control)")
fi

# Check curl
echo "Checking curl..."
if command -v curl &> /dev/null; then
    echo "✅ curl found"
else
    WARNINGS+=("curl (recommended for health checks)")
fi

# Optional: Check for Firebase CLI
echo "Checking Firebase CLI (optional)..."
if command -v firebase &> /dev/null; then
    firebase_ver=$(firebase --version | head -n 1)
    echo "✅ Firebase CLI $firebase_ver found"
else
    echo "ℹ️  Firebase CLI not installed (optional)"
    echo "   Install later: npm install -g firebase-tools"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Report results
if [ ${#MISSING[@]} -eq 0 ] && [ ${#WARNINGS[@]} -eq 0 ]; then
    echo "✅ All prerequisites met! You're ready to run ./setup.sh"
    echo ""
    exit 0
fi

if [ ${#MISSING[@]} -gt 0 ]; then
    echo "❌ Missing required prerequisites:"
    for item in "${MISSING[@]}"; do
        echo "   • $item"
    done
    echo ""
    echo "📥 Installation guide:"
    echo ""
    echo "macOS:"
    echo "  brew install python@3.11 node"
    echo ""
    echo "Ubuntu/Debian:"
    echo "  sudo apt update"
    echo "  sudo apt install python3.11 python3.11-venv nodejs npm"
    echo ""
    echo "Windows:"
    echo "  Download Python: https://www.python.org/downloads/"
    echo "  Download Node.js: https://nodejs.org/"
    echo ""
    exit 1
fi

if [ ${#WARNINGS[@]} -gt 0 ]; then
    echo "⚠️  Missing recommended tools:"
    for item in "${WARNINGS[@]}"; do
        echo "   • $item"
    done
    echo ""
    echo "✅ You can continue with ./setup.sh, but some features may be limited"
    echo ""
    exit 0
fi
