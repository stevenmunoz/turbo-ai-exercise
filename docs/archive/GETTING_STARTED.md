# Getting Started with Serverless Template

A **minimal serverless template** ready for your project. Replace the examples with your business logic.

## 🚀 3-Step Quick Start

```bash
# 1. Setup everything
./setup.sh

# 2. Start development
./dev.sh

# 3. Test it works
curl http://localhost:5001/<project-id>/us-central1/health
```

That's it! Your serverless backend is running.

## 📍 What's Running

- **Emulator UI**: http://localhost:4000 (Firebase dashboard)
- **Functions**: http://localhost:5001/\<project-id\>/us-central1/\<functionName\>
- **Web App**: http://localhost:3000
- **Firestore**: http://localhost:8080

## 🧪 Test the Example Functions

```bash
# Health check
curl http://localhost:5001/<project-id>/us-central1/health

# Hello World
curl "http://localhost:5001/<project-id>/us-central1/helloWorld?name=YourName"

# Create Item (POST)
curl -X POST http://localhost:5001/<project-id>/us-central1/createItem \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Item", "description": "Testing"}'

# Get Items
curl http://localhost:5001/<project-id>/us-central1/getItems
```

## 📝 Add Your Own Function

### 1. Create the handler logic
Edit `backend/functions/handlers/http_handlers.py`:

```python
def my_function(request: Request) -> Tuple[Dict[str, Any], int]:
    """Your custom business logic."""
    data = request.get_json()

    # Add your code here
    result = {"message": "It works!", "data": data}

    return json_response(result, 200)
```

### 2. Register the function
Edit `backend/functions/main.py`:

```python
@functions_framework.http
def myFunction(request: Request):
    """My custom endpoint."""
    return http_handlers.my_function(request)
```

### 3. Test it
```bash
# Restart dev environment
# Press Ctrl+C to stop
./dev.sh

# Call your function
curl -X POST http://localhost:5001/<project-id>/us-central1/myFunction \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## 🏗️ Project Structure

```
.
├── backend/
│   ├── functions/              # ⭐ Your serverless functions
│   │   ├── main.py            #    Register functions here
│   │   ├── handlers/          #    Business logic here
│   │   └── requirements.txt   #    Add dependencies here
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
├── setup.sh                  # One-time setup
├── dev.sh                    # Start development
└── deploy.sh                 # Deploy to production
```

## 🎯 Use Clean Architecture (Optional)

If you want to use use cases and repositories:

```python
# backend/functions/handlers/http_handlers.py
def my_function(request: Request):
    data = request.get_json()

    # Get container
    container = get_container()

    # Use a use case
    use_case = container.my_use_case()
    result = use_case.execute(data)

    return json_response(result.to_dict(), 200)
```

Create your use case in `backend/src/application/use_cases/`.

## 📦 Add Dependencies

Edit `backend/functions/requirements.txt`:

```txt
# Add what you need
openai>=1.100.0         # For OpenAI
anthropic>=0.30.*       # For Anthropic/Claude
PyPDF2>=3.0.1          # For PDF processing
pillow>=10.0.0         # For image processing
```

Then reinstall:
```bash
cd backend/functions
source venv/bin/activate
pip install -r requirements.txt
```

## 🌐 Call from Frontend

```typescript
// Example: Call a function from React
const response = await fetch(
  'http://localhost:5001/<project-id>/us-central1/myFunction',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: 'test' })
  }
);

const result = await response.json();
```

See `web/CLOUD_FUNCTIONS_API.md` for more details.

## 🚀 Deploy to Production

```bash
# Deploy everything
./deploy.sh
```

Your functions will be live at:
```
https://us-central1-<YOUR_PROJECT_ID>.cloudfunctions.net/<functionName>
```

## 📚 Documentation

- **Functions Guide**: `backend/functions/README.md`
- **Frontend Integration**: `web/CLOUD_FUNCTIONS_API.md`
- **Validation**: `VALIDATION.md`
- **Migration Details**: `MIGRATION.md`

## 🆘 Troubleshooting

### Emulator won't start
```bash
# Check Firebase CLI
firebase --version

# Reinstall if needed
npm install -g firebase-tools
```

### Function errors
```bash
# Check logs
tail -f logs/firebase.log

# Look for Python errors
```

### Dependencies issues
```bash
# Reinstall functions dependencies
cd backend/functions
rm -rf venv
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 💡 Tips

1. **Start simple** - Use the example functions as templates
2. **Test locally** - Always test with `./dev.sh` before deploying
3. **Check logs** - Use `tail -f logs/firebase.log` to debug
4. **One function at a time** - Add features incrementally
5. **Deploy often** - Serverless makes deployments fast and cheap

## ✅ You're Ready!

Replace the example functions with your business logic and start building your serverless app.

**Happy coding!** 🎉
