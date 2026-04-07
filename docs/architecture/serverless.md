# Serverless Architecture

This template uses **Firebase Cloud Functions** for a pure serverless backend architecture.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Clients                          │
│         (React Web + React Native Mobile)                    │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              Firebase Cloud Functions                        │
│                  (Serverless - Python)                       │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ helloWorld   │  │ createUser   │  │ listUsers    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                    ┌───────▼───────┐                        │
│                    │   Handlers    │                        │
│                    └───────┬───────┘                        │
└────────────────────────────┼─────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Container     │
                    │ (Dependency DI) │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼─────┐       ┌──────▼──────┐     ┌──────▼──────┐
   │ Use Cases│       │Repositories │     │  Services   │
   └──────────┘       └──────┬──────┘     └─────────────┘
                             │
                      ┌──────▼──────┐
                      │  Firestore  │
                      └─────────────┘
```

## Why Serverless?

### Cost Efficiency
- ✅ **Scales to zero** - No always-on server costs
- ✅ **Free tier**: 125K invocations/month, 40K GB-seconds
- ✅ **Pay per use**: Only charged for actual execution time
- 💰 Typical cost: **$0-5/month** (vs. $10-50/month for traditional server)

### Performance
- ⚡ **Auto-scaling** - Handles traffic spikes automatically
- 🌍 **Global distribution** - Functions deployed worldwide
- 🚀 **Fast cold starts** - Optimized for serverless

### Developer Experience
- 🎯 **No infrastructure management** - Firebase handles everything
- 📊 **Built-in monitoring** - Logs and metrics in Firebase Console
- 🔄 **Simple deployment** - Single command: `./deploy.sh`

## Function Structure

### Entry Points (`backend/functions/main.py`)

```python
import functions_framework
from handlers import http_handlers

@functions_framework.http
def helloWorld(request: Request):
    """
    HTTP-triggered function.

    URL: https://<region>-<project>.cloudfunctions.net/helloWorld
    """
    return http_handlers.hello_world(request)
```

### Handlers (`backend/functions/handlers/http_handlers.py`)

```python
from flask import Request

def hello_world(request: Request) -> Tuple[Dict[str, Any], int]:
    """Business logic for hello world."""
    name = request.args.get('name', 'World')
    return {"message": f"Hello, {name}!"}, 200
```

### With Clean Architecture

```python
def create_user(request: Request) -> Tuple[Dict[str, Any], int]:
    """Use Clean Architecture layers."""
    data = request.get_json()
    dto = UserCreateDTO(**data)

    # Lazy-load container (cached across invocations)
    container = get_container()

    # Execute use case
    use_case = container.create_user_use_case()
    result = use_case.execute(dto)

    return result.to_dict(), 201
```

## Container Initialization

**Global singleton pattern** for performance:

```python
# Global (initialized once, reused across invocations)
_container = None

def get_container() -> Container:
    """Lazy initialization with caching."""
    global _container
    if _container is None:
        setup_logging()
        _container = Container()
        _container.wire(modules=_container.wiring_config.modules)
    return _container
```

**Benefits:**
- ✅ Container created only on first invocation
- ✅ Reused across subsequent invocations in same instance
- ✅ Reduces cold start time
- ✅ Maintains Clean Architecture

## Function Types

### 1. HTTP Functions

Triggered by HTTP requests:

```python
@functions_framework.http
def myFunction(request: Request):
    """Handle HTTP GET/POST/etc."""
    if request.method == 'POST':
        data = request.get_json()
        # Process data
    return {"result": "success"}, 200
```

### 2. Firestore Triggers (Optional)

Triggered by database changes:

```python
@functions_framework.cloud_event
def onUserCreated(cloud_event):
    """Auto-run when user document created."""
    user_id = cloud_event.data['value']['name'].split('/')[-1]
    # Send welcome email, etc.
```

### 3. Storage Triggers (Optional)

Triggered by file uploads:

```python
@functions_framework.cloud_event
def onDocumentUploaded(cloud_event):
    """Process uploaded files."""
    file_name = cloud_event.data['name']
    # Analyze document, extract text, etc.
```

## Deployment

### Local Development

```bash
# Start emulator
./dev.sh

# Functions run at
http://localhost:5001/<project-id>/us-central1/<functionName>
```

### Production Deployment

```bash
# Deploy all services
./deploy.sh

# Or deploy only functions
firebase deploy --only functions

# Functions accessible at
https://us-central1-<project-id>.cloudfunctions.net/<functionName>
```

## Configuration

### firebase.json

```json
{
  "functions": [
    {
      "source": "backend/functions",
      "runtime": "python311",
      "ignore": ["venv", ".git", "__pycache__"]
    }
  ],
  "emulators": {
    "functions": {"port": 5001},
    "firestore": {"port": 8080},
    "auth": {"port": 9099},
    "ui": {"enabled": true, "port": 4000}
  }
}
```

### Environment Variables

Functions read from `backend/.env`:

```bash
# Firebase
FIREBASE_PROJECT_ID=your-project-id
USE_FIREBASE_EMULATOR=true

# Services (optional)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

## Security

### Firestore Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Authenticated users only
    match /items/{itemId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Function Authentication

```python
from firebase_admin import auth

def require_auth(func):
    """Decorator for authenticated functions."""
    def wrapper(request):
        token = request.headers.get('Authorization', '').split('Bearer ')[1]
        try:
            decoded = auth.verify_id_token(token)
            return func(request, decoded['uid'])
        except:
            return {"error": "Unauthorized"}, 401
    return wrapper

@require_auth
def protected_function(request, user_id):
    """Only authenticated users can call this."""
    return {"user_id": user_id}, 200
```

## Performance Optimization

### 1. Global Variables

```python
# Initialized once, reused across invocations
_db_client = None

def get_db():
    global _db_client
    if _db_client is None:
        _db_client = firestore.Client()
    return _db_client
```

### 2. Lazy Loading

```python
# Only import when needed
def heavy_operation(request):
    import heavy_library  # Loaded on first call only
    return heavy_library.process(request.data)
```

### 3. Caching

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def expensive_query(user_id):
    """Results cached in memory."""
    return db.collection('users').document(user_id).get()
```

### 4. Minimize Dependencies

Keep `requirements.txt` minimal - only include what you need.

## Monitoring

### View Logs

```bash
# Development
tail -f logs/firebase.log

# Production
firebase functions:log
```

### Metrics

Firebase Console shows:
- Invocations count
- Execution time
- Error rate
- Memory usage

## Cost Estimation

### Free Tier (Monthly)
- 2M invocations
- 400K GB-seconds
- 200K CPU-seconds

### Typical Costs
- **Light usage** (< 10K requests/month): **$0**
- **Medium usage** (100K requests/month): **$2-5**
- **Heavy usage** (1M requests/month): **$20-50**

**Much cheaper than:**
- Cloud Run: ~$10-50/month (always-on)
- EC2: ~$30-100/month (always-on)
- Heroku: ~$7-25/month (always-on)

## Migration from FastAPI

If you had FastAPI before:

### Before (FastAPI)
```python
# src/main.py
from fastapi import FastAPI

app = FastAPI()

@app.post("/api/v1/items")
def create_item(data: dict):
    return {"id": 1, "data": data}
```

### After (Cloud Functions)
```python
# functions/main.py
@functions_framework.http
def createItem(request):
    data = request.get_json()
    return {"id": 1, "data": data}, 200
```

**Key changes:**
- ❌ No FastAPI app object
- ❌ No routers or middleware
- ✅ Individual functions instead
- ✅ Same business logic (use cases, repositories)

## Best Practices

1. **Keep functions small** - Each does one thing
2. **Use global variables** - For shared resources
3. **Lazy initialization** - Load on first call
4. **Clean Architecture** - Separate concerns
5. **Error handling** - Return proper HTTP codes
6. **Security** - Validate inputs, check auth
7. **Logging** - Use structured logging
8. **Testing** - Test handlers separately

## Learn More

- [Getting Started](../setup/getting-started.md)
- [Clean Architecture](CLEAN_ARCHITECTURE.md)
- [Deployment Guide](../deployment/DEPLOYMENT.md)
- [Firebase Functions Docs](https://firebase.google.com/docs/functions)
