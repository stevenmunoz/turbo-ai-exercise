# Troubleshooting

Common issues and solutions for development and deployment.

## Setup Issues

### Python Version Incompatible

**Problem**: `No compatible Python version found`

**Solution**:
```bash
# macOS
brew install python@3.11

# Ubuntu
sudo apt install python3.11 python3.11-venv

# Verify
python3.11 --version
```

### Firebase CLI Not Installed

**Problem**: `firebase: command not found`

**Solution**:
```bash
npm install -g firebase-tools

# Verify
firebase --version
```

### Virtual Environment Issues

**Problem**: Dependencies won't install

**Solution**:
```bash
# Backend
cd backend
rm -rf venv
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Functions
cd functions
rm -rf venv
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Development Issues

### Emulator Won't Start

**Problem**: Firebase Emulator fails to start

**Solutions**:

1. **Check Java** (required by emulator):
```bash
java --version

# If not installed
# macOS: brew install openjdk
# Ubuntu: sudo apt install openjdk-11-jdk
```

2. **Check logs**:
```bash
tail -f logs/firebase.log
```

3. **Kill existing processes**:
```bash
# Kill any running emulators
pkill -f firebase
lsof -ti:4000,5001,8080,9099 | xargs kill -9

# Restart
./dev.sh
```

### Function Returns 404

**Problem**: `Cannot GET /<functionName>`

**Solutions**:

1. **Verify function name** matches `main.py`:
```python
# main.py
@functions_framework.http
def myFunction(request):  # ← Must match URL
    ...
```

2. **Check project ID** in URL:
```bash
# Should be
http://localhost:5001/<correct-project-id>/us-central1/functionName

# Find your project ID
cat .firebaserc
```

3. **Check logs**:
```bash
tail -f logs/firebase.log
# Look for function registration messages
```

### Import Errors in Functions

**Problem**: `ModuleNotFoundError: No module named 'src'`

**Solution**:

Verify `sys.path` in handlers:
```python
# backend/functions/handlers/http_handlers.py
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../'))

from src.infrastructure.container import Container
```

### Container Initialization Fails

**Problem**: Dependency injection errors

**Solutions**:

1. **Check container wiring**:
```python
# backend/src/infrastructure/container.py
wiring_config = containers.WiringConfiguration(
    modules=[
        # Add your handler modules here
    ]
)
```

2. **Verify imports**:
```bash
cd backend/functions
source venv/bin/activate
python -c "from src.infrastructure.container import Container; print('OK')"
```

### Web App Won't Load

**Problem**: Frontend shows errors

**Solutions**:

1. **Check web logs**:
```bash
tail -f logs/web.log
```

2. **Reinstall dependencies**:
```bash
cd web
rm -rf node_modules package-lock.json
npm install
```

3. **Check port conflicts**:
```bash
lsof -ti:3000 | xargs kill -9
```

## Deployment Issues

### Deployment Fails

**Problem**: `firebase deploy` errors

**Solutions**:

1. **Login to Firebase**:
```bash
firebase login
```

2. **Check project**:
```bash
firebase projects:list
firebase use <project-id>
```

3. **Check functions build**:
```bash
cd backend/functions
source venv/bin/activate
pip install -r requirements.txt
```

4. **Deploy specific services**:
```bash
# Deploy only functions
firebase deploy --only functions

# Deploy only hosting
firebase deploy --only hosting
```

### Function Timeout in Production

**Problem**: Functions timeout after 60s

**Solution**:

Increase timeout in `firebase.json`:
```json
{
  "functions": [
    {
      "source": "backend/functions",
      "runtime": "python311",
      "timeout": "300s"  // 5 minutes max
    }
  ]
}
```

### CORS Errors in Production

**Problem**: Browser blocks API calls

**Solution**:

Add CORS headers in handlers:
```python
def my_function(request: Request):
    # Handle preflight
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
        return ('', 204, headers)

    # Add CORS to response
    result = {"message": "Success"}
    headers = {'Access-Control-Allow-Origin': '*'}
    return (result, 200, headers)
```

## Performance Issues

### Slow Cold Starts

**Problem**: First function call takes >5 seconds

**Solutions**:

1. **Use global variables** for container (already implemented):
```python
_container = None

def get_container():
    global _container
    if _container is None:
        _container = Container()
    return _container
```

2. **Minimize dependencies** in `requirements.txt`

3. **Consider Cloud Run** for latency-critical endpoints

### High Costs

**Problem**: Unexpected Firebase bills

**Solutions**:

1. **Set budget alerts** in Firebase Console

2. **Check invocations**:
```bash
firebase functions:log
```

3. **Add caching**:
```python
from functools import lru_cache

@lru_cache(maxsize=128)
def expensive_operation(param):
    # Cached result
    return result
```

## Validation Checklist

Run these to verify everything works:

```bash
# 1. Check prerequisites
./check_prerequisites.sh

# 2. Verify setup
ls backend/venv
ls backend/functions/venv
ls web/node_modules

# 3. Test emulator
./dev.sh
# Wait for "Development environment is running!"

# 4. Test function
curl http://localhost:5001/<project-id>/us-central1/health

# 5. Check logs
tail logs/firebase.log
tail logs/web.log
```

## Still Stuck?

1. **Check logs**:
   - `logs/firebase.log` - Functions errors
   - `logs/web.log` - Frontend errors

2. **Verify environment**:
   ```bash
   python3 --version  # Should be 3.10-3.12
   node --version     # Should be 18+
   firebase --version # Should be installed
   ```

3. **Clean restart**:
   ```bash
   # Stop everything
   pkill -f firebase
   pkill -f node

   # Clean
   rm -rf logs/*

   # Restart
   ./dev.sh
   ```

4. **Read documentation**:
   - [Getting Started](getting-started.md)
   - [Serverless Architecture](../architecture/serverless.md)
   - [Firebase Functions Docs](https://firebase.google.com/docs/functions)

5. **Check GitHub Issues**:
   - Search for similar issues
   - Open a new issue with logs
