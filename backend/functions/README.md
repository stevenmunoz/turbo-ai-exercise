# Firebase Cloud Functions - Serverless Backend

This is a **bare minimum serverless template** using Firebase Cloud Functions. Replace the example functions with your own business logic.

## Structure

```
backend/functions/
├── main.py              # Function entry points (register functions here)
├── handlers/            # Business logic handlers
│   ├── http_handlers.py # HTTP request handlers
│   └── __init__.py
├── requirements.txt     # Python dependencies
└── venv/               # Virtual environment (auto-created)
```

## Quick Start

### 1. Setup
```bash
# From project root
./setup.sh
```

### 2. Run locally
```bash
# From project root
./dev.sh

# Access Emulator UI: http://localhost:4000
# Functions: http://localhost:5001/<project-id>/us-central1/<functionName>
```

### 3. Test a function
```bash
# Health check
curl http://localhost:5001/<project-id>/us-central1/health

# Hello World
curl "http://localhost:5001/<project-id>/us-central1/helloWorld?name=Alice"

# Create User
curl -X POST http://localhost:5001/<project-id>/us-central1/createUser \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "secure123", "full_name": "Test User"}'
```

### 4. Deploy to production
```bash
# From project root
./deploy.sh
```

## Adding Your Own Functions

### Step 1: Create a handler
Edit `handlers/http_handlers.py`:

```python
def my_custom_function(request: Request) -> Tuple[Dict[str, Any], int]:
    """Your custom business logic."""
    data = request.get_json()

    # Use Clean Architecture
    container = get_container()
    use_case = container.my_use_case()
    result = use_case.execute(data)

    return json_response(result.to_dict(), 200)
```

### Step 2: Register in main.py
Edit `main.py`:

```python
@functions_framework.http
def myCustomFunction(request: Request):
    """
    My custom endpoint.

    Method: POST
    Body: {"field": "value"}
    """
    return http_handlers.my_custom_function(request)
```

### Step 3: Test it
```bash
curl -X POST http://localhost:5001/<project-id>/us-central1/myCustomFunction \
  -H "Content-Type: application/json" \
  -d '{"field": "value"}'
```

## Clean Architecture Integration

This template preserves Clean Architecture:

- **Domain Layer** (`backend/src/domain/`): Business entities and rules
- **Application Layer** (`backend/src/application/`): Use cases
- **Infrastructure Layer** (`backend/src/infrastructure/`): Repositories, external services
- **Presentation Layer** (`backend/functions/`): Cloud Functions (HTTP handlers)

### Example: Using a Use Case

```python
from src.application.use_cases.my_use_case import MyUseCase

def my_handler(request: Request):
    container = get_container()
    use_case = container.my_use_case()

    result = use_case.execute(data)
    return json_response(result.to_dict(), 200)
```

## Environment Variables

Functions read from `backend/.env`:

```bash
# Firebase
FIREBASE_PROJECT_ID=your-project-id
USE_FIREBASE_EMULATOR=true  # for local dev

# Optional: Add as needed
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

## Dependencies

Add dependencies to `requirements.txt`:

```txt
# Example: Add OpenAI
openai>=1.100.0

# Example: Add document processing
PyPDF2>=3.0.1
pytesseract>=0.3.10
```

Then reinstall:
```bash
cd backend/functions
source venv/bin/activate
pip install -r requirements.txt
```

## Deployment

### Development
```bash
./dev.sh  # Starts Firebase Emulator
```

### Production
```bash
./deploy.sh  # Deploys to Firebase
```

### Manual deployment
```bash
firebase deploy --only functions
```

## Troubleshooting

### Functions not loading
1. Check logs: `tail -f logs/firebase.log`
2. Verify Python version: `python3 --version` (needs 3.11)
3. Reinstall functions venv:
   ```bash
   cd backend/functions
   rm -rf venv
   python3.11 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

### Import errors
Make sure `sys.path` includes backend:
```python
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../'))
```

### Container initialization fails
Check that `backend/src/infrastructure/container.py` is properly configured.

## Next Steps

1. **Replace example functions** with your business logic
2. **Add use cases** in `backend/src/application/use_cases/`
3. **Add repositories** in `backend/src/infrastructure/repositories.py`
4. **Update Firestore rules** in `firestore.rules`
5. **Add tests** in `backend/tests/`

## Resources

- [Firebase Functions Docs](https://firebase.google.com/docs/functions)
- [Functions Framework Python](https://github.com/GoogleCloudPlatform/functions-framework-python)
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)
