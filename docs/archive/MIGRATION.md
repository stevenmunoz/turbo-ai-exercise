# Migration to Serverless (Firebase Cloud Functions)

This template has been migrated from **FastAPI (traditional server)** to **Firebase Cloud Functions (serverless)**.

## What Changed

### Before (FastAPI)
- ❌ Always-on server (Cloud Run / VM)
- ❌ Higher costs (server running 24/7)
- ❌ Slower cold starts with containers
- ✅ FastAPI endpoints at `/api/v1/*`

### After (Cloud Functions)
- ✅ Serverless (pay per invocation)
- ✅ Scales to zero when idle
- ✅ Faster cold starts
- ✅ Direct Firebase integration
- ✅ Individual function endpoints

## Architecture Changes

### Removed
- `backend/src/main.py` - FastAPI app (replaced with `backend/functions/main.py`)
- `backend/src/presentation/api/` - FastAPI routers (replaced with function handlers)
- `backend/src/presentation/middleware.py` - CORS, logging middleware (not needed)
- FastAPI dependencies (`fastapi`, `uvicorn`)

### Added
- `backend/functions/` - Cloud Functions directory
  - `main.py` - Function entry points
  - `handlers/http_handlers.py` - HTTP handlers
  - `requirements.txt` - Function dependencies
- `firebase.json` - Firebase configuration
- `firestore.rules` - Firestore security rules
- `storage.rules` - Storage security rules

### Preserved (Clean Architecture)
- ✅ `backend/src/domain/` - Business logic (unchanged)
- ✅ `backend/src/application/` - Use cases (unchanged)
- ✅ `backend/src/infrastructure/` - Repositories (unchanged)
- ✅ Dependency injection pattern (unchanged)

## Endpoint Migration

| Old (FastAPI) | New (Cloud Functions) |
|---------------|----------------------|
| `POST /api/v1/users` | `POST /createUser` |
| `GET /api/v1/users/me` | `GET /getCurrentUser` |
| `GET /api/v1/users` | `GET /listUsers` |
| `POST /api/v1/auth/login` | `POST /login` |
| `POST /api/v1/chat` | `POST /chat` |

## Local Development

### Before
```bash
./dev.sh
# Backend: http://localhost:8000
# Docs: http://localhost:8000/docs
```

### After
```bash
./dev.sh
# Emulator UI: http://localhost:4000
# Functions: http://localhost:5001/<project-id>/us-central1/<functionName>
```

## Deployment

### Before
```bash
# Deploy to Cloud Run
gcloud run deploy ...
```

### After
```bash
# Deploy to Firebase
./deploy.sh
# or
firebase deploy --only functions
```

## Cost Comparison

### FastAPI (Cloud Run - Always On)
- **Min**: ~$5-10/month (always running)
- **Scaling**: More expensive as traffic increases

### Cloud Functions (Serverless)
- **Free tier**: 125K invocations/month, 40K GB-seconds
- **Light usage**: $0-5/month (most apps stay in free tier)
- **Scaling**: Only pay for actual invocations

## Breaking Changes

### Frontend API Calls
Update your API client to call Cloud Functions:

**Before:**
```typescript
const response = await fetch('http://localhost:8000/api/v1/users', {
  method: 'POST',
  body: JSON.stringify(data)
});
```

**After:**
```typescript
const functionsUrl = 'http://localhost:5001/<project-id>/us-central1';
const response = await fetch(`${functionsUrl}/createUser`, {
  method: 'POST',
  body: JSON.stringify(data)
});
```

### Authentication
Simplified - no complex JWT handling needed. Use Firebase Auth:

```typescript
import { getAuth } from 'firebase/auth';

const token = await getAuth().currentUser?.getIdToken();
const response = await fetch(`${functionsUrl}/myFunction`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Migration Checklist

If you have an existing FastAPI app to migrate:

- [ ] Create `backend/functions/` directory
- [ ] Copy business logic to handlers
- [ ] Register functions in `main.py`
- [ ] Update frontend API calls
- [ ] Test with Firebase Emulator (`./dev.sh`)
- [ ] Remove `backend/src/main.py` and FastAPI dependencies
- [ ] Deploy with `./deploy.sh`

## Rollback (if needed)

The FastAPI code is preserved in git history. To rollback:

```bash
git log --oneline  # Find commit before migration
git checkout <commit-hash> backend/src/main.py
git checkout <commit-hash> backend/src/presentation/
```

## Questions?

- Read `backend/functions/README.md` for detailed Cloud Functions guide
- Check Firebase docs: https://firebase.google.com/docs/functions
