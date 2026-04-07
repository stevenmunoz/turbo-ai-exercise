# Serverless Migration Validation Checklist

Use this checklist to validate the serverless migration is working correctly.

## Setup Validation

### 1. Prerequisites
- [ ] Python 3.10, 3.11, or 3.12 installed: `python3 --version`
- [ ] Node.js 18+ installed: `node --version`
- [ ] Firebase CLI installed: `firebase --version`

### 2. Project Setup
```bash
# Run setup script
./setup.sh
```

**Verify:**
- [ ] `backend/.env` exists with secrets
- [ ] `backend/venv/` created
- [ ] `backend/functions/venv/` created
- [ ] `web/node_modules/` exists
- [ ] Firebase CLI installed

## Local Development Validation

### 3. Start Development Environment
```bash
./dev.sh
```

**Wait for:**
- [ ] "Firebase Emulator ready" message
- [ ] "Web frontend is responding" message
- [ ] No errors in console

### 4. Test Services

**Emulator UI:**
```bash
curl http://localhost:4000
# Expected: HTML response (Emulator UI)
```
- [ ] Emulator UI loads at http://localhost:4000

**Health Function:**
```bash
curl http://localhost:5001/<project-id>/us-central1/health
# Expected: {"status": "healthy", "service": "scalable-app-template", "version": "1.0.0"}
```
- [ ] Health function returns 200 OK

**Hello World Function:**
```bash
curl "http://localhost:5001/<project-id>/us-central1/helloWorld?name=Test"
# Expected: {"message": "Hello, Test!", "service": "scalable-app-template"}
```
- [ ] Hello function returns personalized greeting

**Create Item Function:**
```bash
curl -X POST http://localhost:5001/<project-id>/us-central1/createItem \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Item", "description": "Testing"}'
# Expected: {"message": "Item created", "data": {...}}
```
- [ ] Create function accepts POST and returns 201

**Web Frontend:**
- [ ] Web app loads at http://localhost:3000
- [ ] No console errors in browser

## Function Development Validation

### 5. Test Container Initialization

Create a test function that uses the container:

```python
# backend/functions/handlers/http_handlers.py
def test_container(request):
    container = get_container()
    return json_response({
        "container_initialized": container is not None,
        "message": "Container works!"
    }, 200)
```

```python
# backend/functions/main.py
@functions_framework.http
def testContainer(request):
    return http_handlers.test_container(request)
```

Restart emulator and test:
```bash
curl http://localhost:5001/<project-id>/us-central1/testContainer
# Expected: {"container_initialized": true, "message": "Container works!"}
```
- [ ] Container initializes successfully

### 6. Test Firestore Access

```bash
# In Emulator UI (http://localhost:4000)
# 1. Go to Firestore tab
# 2. Create a test collection 'items'
# 3. Add a document with fields: name="Test", description="..."
```
- [ ] Can create Firestore documents via UI
- [ ] Can read Firestore documents (if you add use case)

## Logs Validation

### 7. Check Logs

```bash
# Firebase logs
tail -f logs/firebase.log

# Web logs
tail -f logs/web.log
```

**Look for:**
- [ ] No Python errors in firebase.log
- [ ] Functions load successfully
- [ ] No import errors
- [ ] No dependency errors

## Common Issues

### Firebase Emulator won't start
```bash
# Check Java is installed (required by emulator)
java --version

# If not, install:
# macOS: brew install openjdk
# Ubuntu: sudo apt install openjdk-11-jdk
```

### Function returns 404
- Check project ID is correct
- Check function name matches main.py
- Check firebase.log for errors

### Import errors
```bash
cd backend/functions
source venv/bin/activate
pip install -r requirements.txt
```

### Container initialization fails
- Check backend/src/infrastructure/container.py exists
- Check all dependencies are installed
- Check sys.path includes backend directory

## Production Deployment Validation

### 8. Test Deployment (Optional)

**Only if you want to test production deployment:**

```bash
# Initialize Firebase project
firebase login
firebase init  # Select functions, firestore, hosting

# Deploy
./deploy.sh
```

**Verify:**
- [ ] Deployment succeeds
- [ ] Functions accessible at production URL
- [ ] No deployment errors

**Test production function:**
```bash
curl https://us-central1-<project-id>.cloudfunctions.net/health
# Expected: {"status": "healthy", ...}
```

## Success Criteria

All checks passed? You're ready to build! ✅

### Next Steps
1. Read `backend/functions/README.md` for development guide
2. Replace example functions with your business logic
3. Add use cases in `backend/src/application/use_cases/`
4. Update frontend to call your functions
5. Deploy with `./deploy.sh`

## Failed Checks?

- Read relevant logs in `logs/` directory
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- See [MIGRATION.md](MIGRATION.md) for architecture details
- Review `backend/functions/README.md` for function development
