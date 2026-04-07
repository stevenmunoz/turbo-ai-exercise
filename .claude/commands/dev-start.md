# Start Development Environment

Start all services needed for local development.

## Workflow

### Step 1: Check if setup has been done

```bash
# Check for backend venv and web node_modules
if [ ! -d "backend/venv" ] || [ ! -d "web/node_modules" ]; then
    echo "Running first-time setup..."
    ./setup.sh
fi
```

### Step 2: Start everything

```bash
./dev.sh
```

This starts:
- Firebase Emulators (functions, firestore, auth)
- React web dev server

### Step 3: Verify services are running

Once started, these URLs should be available:

| Service | URL |
|---------|-----|
| Web App | http://localhost:3000 |
| Emulator UI | http://localhost:4000 |
| Cloud Functions | http://localhost:5001 |
| Firestore | http://localhost:8080 |

### Step 4: Quick health check

```bash
curl http://localhost:5001/demo-project/us-central1/health
curl "http://localhost:5001/demo-project/us-central1/helloWorld?name=World"
```

## If Ports Are Already in Use

```bash
# Kill processes on common ports
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:4000 | xargs kill -9 2>/dev/null
lsof -ti:5001 | xargs kill -9 2>/dev/null
lsof -ti:8080 | xargs kill -9 2>/dev/null
```

## Without Conductor

This project works without Conductor. The standard workflow is:

```bash
./setup.sh    # One-time: installs deps, creates venvs, sets up .env
./dev.sh      # Starts Firebase emulators + web dev server
# Ctrl+C to stop
```
