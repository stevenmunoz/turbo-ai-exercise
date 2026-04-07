# Troubleshooting Guide

Common issues and solutions for the Scalable App Template.

## Table of Contents

- [Setup Issues](#setup-issues)
  - [Python 3.13 Detected](#python-313-detected)
  - [No Compatible Python Found](#no-compatible-python-found)
  - [Virtual Environment Creation Failed](#virtual-environment-creation-failed)
- [Configuration Issues](#configuration-issues)
  - [CORS Configuration Error](#cors-configuration-error)
  - [Missing Environment Files](#missing-environment-files)
  - [Invalid API Keys](#invalid-api-keys)
- [Runtime Issues](#runtime-issues)
  - [Ports Already in Use](#ports-already-in-use)
  - [Backend Failed to Start](#backend-failed-to-start)
  - [Web Frontend Not Loading](#web-frontend-not-loading)
  - [Firebase Emulator Not Starting](#firebase-emulator-not-starting)
- [Dependency Issues](#dependency-issues)
  - [Pip Install Failed](#pip-install-failed)
  - [NPM Install Failed](#npm-install-failed)
- [General Tips](#general-tips)

---

## Setup Issues

### Python 3.13 Detected

**Symptom**: Setup fails with errors like:
```
fatal error: too many errors emitted, stopping now [-ferror-limit=]
error: can't find Rust compiler
ERROR: Failed building wheel for dependency-injector
ERROR: Failed building wheel for tiktoken
```

**Root Cause**: Python 3.13+ introduced breaking changes to C extension APIs. Some dependencies (`dependency-injector`, `tiktoken`) are not yet compatible.

**Fix**:
```bash
# Install Python 3.11 (recommended)
# macOS
brew install python@3.11

# Ubuntu/Debian
sudo apt update
sudo apt install python3.11 python3.11-venv

# Verify installation
python3.11 --version

# Re-run setup (it will auto-detect python3.11)
./setup.sh
```

**Prevention**: The updated setup script now automatically detects and uses compatible Python versions (3.10-3.12).

---

### No Compatible Python Found

**Symptom**: Setup exits with:
```
❌ No compatible Python version found (need 3.10, 3.11, or 3.12)
```

**Fix**:

**macOS**:
```bash
# Install Python 3.11
brew install python@3.11

# Verify
python3.11 --version
```

**Ubuntu/Debian**:
```bash
sudo apt update
sudo apt install python3.11 python3.11-venv

# Verify
python3.11 --version
```

**Windows**:
1. Download Python 3.11 from [python.org/downloads](https://www.python.org/downloads/)
2. Run installer and check "Add Python to PATH"
3. Verify: `python --version` in Command Prompt

---

### Virtual Environment Creation Failed

**Symptom**: Error during venv creation or venv uses wrong Python version

**Fix**:
```bash
# Remove existing venv
rm -rf backend/venv

# Create with specific Python version
cd backend
python3.11 -m venv venv

# Verify venv Python version
./venv/bin/python --version

# Install dependencies
source venv/bin/activate
pip install -r requirements.txt
```

---

## Configuration Issues

### CORS Configuration Error

**Symptom**: Backend fails to start with:
```
pydantic_settings.sources.SettingsError: error parsing value for field "CORS_ORIGINS"
```

**Root Cause**: CORS_ORIGINS format not recognized by Pydantic v2.

**Fix**: The issue has been fixed in the latest version. Both formats are now supported:

**Format 1 - Comma-separated (recommended)**:
```bash
# In backend/.env
CORS_ORIGINS=http://localhost:3000,http://localhost:19006
```

**Format 2 - JSON array**:
```bash
# In backend/.env
CORS_ORIGINS='["http://localhost:3000","http://localhost:19006"]'
```

If you still see this error, update to the latest template code:
```bash
git pull origin main
```

---

### Missing Environment Files

**Symptom**: Errors about missing `.env` files

**Fix**:
```bash
# Run setup script (creates all .env files)
./setup.sh

# Or manually create from examples
cp backend/.env.example backend/.env
cp web/.env.example web/.env

# Edit files to add your API keys
# macOS
open backend/.env

# Linux
nano backend/.env
```

---

### Invalid API Keys

**Symptom**: Backend starts but AI features don't work, or errors like "Invalid API key"

**Fix**:
```bash
# Edit backend/.env
nano backend/.env  # or your preferred editor

# For OpenAI
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-actual-openai-key

# For Anthropic
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-your-actual-anthropic-key

# Restart backend
./stop.sh
./dev.sh
```

**Get API Keys**:
- OpenAI: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- Anthropic: [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)

---

## Runtime Issues

### Ports Already in Use

**Symptom**: Services fail to start with "address already in use" or ports are occupied

**Fix**:

**Find what's using the port**:
```bash
# Check port 8000 (Backend)
lsof -i :8000

# Check port 3000 (Web)
lsof -i :3000

# Check port 4000 (Firebase)
lsof -i :4000
```

**Kill processes on specific ports**:
```bash
# Kill backend
lsof -ti:8000 | xargs kill -9

# Kill web
lsof -ti:3000 | xargs kill -9

# Kill Firebase
lsof -ti:4000 | xargs kill -9

# Or stop all services
./stop.sh
```

**Alternative**: Change ports in configuration files if needed.

---

### Backend Failed to Start

**Symptom**: Backend doesn't respond, health check fails

**Diagnosis**:
```bash
# Check backend logs
tail -f logs/backend.log

# Or view last 50 lines
tail -50 logs/backend.log

# Run validation
python3 validate_setup.py
```

**Common Fixes**:

1. **Missing dependencies**:
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

2. **Wrong Python version in venv**:
```bash
# Check venv Python
./backend/venv/bin/python --version

# Should be 3.10, 3.11, or 3.12
# If not, recreate venv
rm -rf backend/venv
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. **Configuration error**:
```bash
# Verify .env exists and is valid
cat backend/.env

# Check for syntax errors, missing required fields
```

---

### Web Frontend Not Loading

**Symptom**: `http://localhost:3000` doesn't load or shows errors

**Diagnosis**:
```bash
# Check web logs
tail -f logs/web.log

# Check if web dependencies are installed
ls web/node_modules/
```

**Common Fixes**:

1. **Missing dependencies**:
```bash
cd web
npm install
```

2. **Port conflict**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Restart
./dev.sh
```

3. **Build errors**:
```bash
# Clear cache and reinstall
cd web
rm -rf node_modules .next
npm install
```

---

### Firebase Emulator Not Starting

**Symptom**: Firebase UI not available at `http://localhost:4000`

**Fix**:

1. **Install Firebase CLI**:
```bash
npm install -g firebase-tools

# Verify installation
firebase --version
```

2. **Initialize Firebase** (if needed):
```bash
cd backend
firebase login
firebase init  # Select Firestore and Auth
```

3. **Start emulator manually**:
```bash
cd backend
firebase emulators:start --only firestore,auth
```

**Note**: Firebase emulator is optional for development. The backend works without it using demo mode.

---

## Dependency Issues

### Pip Install Failed

**Symptom**: Errors during `pip install -r requirements.txt`

**Diagnosis**:
```bash
# Activate venv
cd backend
source venv/bin/activate

# Check Python version (must be 3.10-3.12)
python --version

# Try installing with verbose output
pip install -v -r requirements.txt
```

**Common Fixes**:

1. **Outdated pip**:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

2. **Missing system dependencies**:
```bash
# Ubuntu/Debian
sudo apt install python3-dev build-essential

# macOS (requires Xcode Command Line Tools)
xcode-select --install
```

3. **Network issues**:
```bash
# Use different PyPI mirror
pip install -r requirements.txt --index-url https://pypi.org/simple
```

---

### NPM Install Failed

**Symptom**: Errors during `npm install`

**Fix**:

1. **Clear npm cache**:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

2. **Use different registry**:
```bash
npm install --registry https://registry.npmjs.org/
```

3. **Update Node.js**:
```bash
# Check version (need 18+)
node --version

# Update via nvm (if installed)
nvm install 18
nvm use 18

# Or via package manager
# macOS
brew upgrade node

# Ubuntu
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## General Tips

### Run Validation

Before reporting issues, run the validation script:
```bash
python3 validate_setup.py
```

This checks:
- ✅ Python version in virtual environment
- ✅ Environment files exist
- ✅ Dependencies installed
- ✅ Ports available

### Check Prerequisites

Verify system requirements:
```bash
./check_prerequisites.sh
```

### View All Logs

```bash
# Backend
tail -f logs/backend.log

# Web
tail -f logs/web.log

# Firebase
tail -f logs/firebase.log

# All at once (requires tmux or screen)
tail -f logs/*.log
```

### Clean Restart

If all else fails, clean everything and start fresh:
```bash
# Stop all services
./stop.sh

# Clean Python virtual environment
rm -rf backend/venv

# Clean Node modules
rm -rf web/node_modules
rm -rf mobile/node_modules

# Re-run setup
./setup.sh

# Validate
python3 validate_setup.py

# Start
./dev.sh
```

### Get Help

1. Check this troubleshooting guide
2. Run `python3 validate_setup.py` for diagnostics
3. Review logs in `logs/` directory
4. Check [GitHub Issues](https://github.com/your-org/your-repo/issues)
5. Review [QUICKSTART.md](QUICKSTART.md) for detailed setup instructions

---

## Still Having Issues?

If you've tried the fixes above and still have problems:

1. **Collect diagnostics**:
```bash
# Python info
python3 --version
which python3

# Node info
node --version
npm --version

# System info
uname -a  # Linux/macOS
```

2. **Check logs**:
```bash
ls -la logs/
tail -100 logs/backend.log > backend_error.txt
tail -100 logs/web.log > web_error.txt
```

3. **Validation output**:
```bash
python3 validate_setup.py > validation_output.txt 2>&1
```

4. **Open an issue** with the collected information

---

**Last Updated**: 2024-12-10
