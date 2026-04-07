# Getting Started

A **serverless full-stack template** using Firebase Cloud Functions, React, and Clean Architecture.

## Quick Start

### Prerequisites
- **Python 3.10, 3.11, or 3.12** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **Firebase CLI** (auto-installed by setup script)

### Setup & Run (3 commands)

```bash
# 1. One-time setup
./setup.sh

# 2. Start development
./dev.sh

# 3. Test it works
curl http://localhost:5001/<project-id>/us-central1/health
```

### Services Running

- **Emulator UI**: http://localhost:4000 (Firebase dashboard)
- **Cloud Functions**: http://localhost:5001/\<project-id\>/us-central1/\<functionName\>
- **Web App**: http://localhost:3000
- **Firestore**: http://localhost:8080

## Project Structure

```
.
├── backend/
│   ├── functions/              # 🔥 Serverless functions
│   │   ├── main.py            # Function entry points
│   │   ├── handlers/          # Business logic
│   │   └── requirements.txt   # Dependencies
│   │
│   └── src/                   # Clean Architecture (optional)
│       ├── domain/            # Business entities
│       ├── application/       # Use cases
│       └── infrastructure/    # Repositories
│
├── web/                       # React frontend
├── firebase.json              # Firebase config
├── firestore.rules           # Database security
│
├── setup.sh                  # Setup script
├── dev.sh                    # Start development
└── deploy.sh                 # Deploy to production
```

## Example: Test Functions

```bash
# Health check
curl http://localhost:5001/<project-id>/us-central1/health

# Hello World
curl "http://localhost:5001/<project-id>/us-central1/helloWorld?name=World"

# Create User (POST)
curl -X POST http://localhost:5001/<project-id>/us-central1/createUser \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "secure123", "full_name": "Test User"}'

# List Users
curl http://localhost:5001/<project-id>/us-central1/listUsers
```

## Add Your Own Function

### 1. Create handler logic
Edit `backend/functions/handlers/http_handlers.py`:

```python
def my_function(request: Request) -> Tuple[Dict[str, Any], int]:
    """Your custom endpoint."""
    data = request.get_json()

    # Your business logic here
    result = {"message": "Success!", "data": data}

    return json_response(result, 200)
```

### 2. Register function
Edit `backend/functions/main.py`:

```python
@functions_framework.http
def myFunction(request: Request):
    """My custom Cloud Function."""
    return http_handlers.my_function(request)
```

### 3. Test it
```bash
# Restart dev (Ctrl+C to stop, then)
./dev.sh

# Call your function
curl -X POST http://localhost:5001/<project-id>/us-central1/myFunction \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## Use Clean Architecture (Optional)

Connect to use cases and repositories:

```python
# backend/functions/handlers/http_handlers.py
def my_function(request: Request):
    data = request.get_json()

    # Get dependency injection container
    container = get_container()

    # Use a use case
    use_case = container.my_use_case()
    result = use_case.execute(data)

    return json_response(result.to_dict(), 200)
```

Create your use case in `backend/src/application/use_cases/`.

## Frontend Integration

Call functions from React:

```typescript
const functionsUrl = 'http://localhost:5001/<project-id>/us-central1';

const response = await fetch(`${functionsUrl}/myFunction`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ data: 'test' })
});

const result = await response.json();
```

See `web/CLOUD_FUNCTIONS_API.md` for detailed integration guide.

## Deploy to Production

```bash
# Build and deploy
./deploy.sh
```

Functions will be live at:
```
https://us-central1-<YOUR_PROJECT_ID>.cloudfunctions.net/<functionName>
```

## Next Steps

- **Add dependencies**: Edit `backend/functions/requirements.txt`
- **Customize functions**: Replace examples with your logic
- **Add use cases**: Create in `backend/src/application/use_cases/`
- **Configure Firestore**: Edit `firestore.rules` for security
- **Deploy**: Run `./deploy.sh` when ready

## Learn More

- [Serverless Architecture](../architecture/serverless.md)
- [Clean Architecture](../architecture/CLEAN_ARCHITECTURE.md)
- [Troubleshooting](troubleshooting.md)
- [Deployment Guide](../deployment/DEPLOYMENT.md)
