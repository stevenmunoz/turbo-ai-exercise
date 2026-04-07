# Deployment Guide

Deploy your serverless app to Firebase with a single command.

## Quick Deploy

```bash
./deploy.sh
```

That's it! Your app is live in ~2-5 minutes.

## Pre-Deployment Checklist

- [ ] Firebase project created (or use existing)
- [ ] Logged into Firebase CLI
- [ ] Environment variables configured
- [ ] Functions tested locally (`./dev.sh`)
- [ ] Web app builds successfully
- [ ] Firestore rules configured

## Step-by-Step Deployment

### 1. Create Firebase Project

**Option A: Use Firebase Console**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name
4. Enable Google Analytics (optional)

**Option B: Use CLI**
```bash
firebase projects:create your-project-id
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Initialize Firebase (First Time Only)

```bash
firebase init

# Select:
# - Functions (Python)
# - Firestore
# - Hosting
# - Storage (optional)

# Choose existing project or create new one
firebase use <your-project-id>
```

### 4. Configure Environment

**Update `.firebaserc`:**
```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

**Set environment variables:**
```bash
# For functions
firebase functions:config:set \
  app.environment="production" \
  openai.api_key="sk-..." \
  anthropic.api_key="sk-ant-..."

# View config
firebase functions:config:get
```

### 5. Build Frontend

```bash
cd web
npm run build
cd ..
```

### 6. Deploy

**Deploy everything:**
```bash
./deploy.sh
```

**Or deploy specific services:**
```bash
# Functions only
firebase deploy --only functions

# Hosting only
firebase deploy --only hosting

# Firestore rules only
firebase deploy --only firestore:rules

# Multiple services
firebase deploy --only functions,hosting
```

## Deployment Configuration

### firebase.json

```json
{
  "functions": [
    {
      "source": "backend/functions",
      "runtime": "python311",
      "ignore": ["venv", ".git", "__pycache__"],
      "timeout": "60s",
      "memory": "256MB"
    }
  ],
  "hosting": {
    "public": "web/dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

### Function Configuration

**Increase timeout (if needed):**
```json
{
  "functions": [{
    "timeout": "300s"  // Max 9 minutes
  }]
}
```

**Increase memory (if needed):**
```json
{
  "functions": [{
    "memory": "512MB"  // Options: 128MB, 256MB, 512MB, 1GB, 2GB
  }]
}
```

**Set region:**
```json
{
  "functions": [{
    "region": "us-central1"  // or europe-west1, asia-east1, etc.
  }]
}
```

## Environment Variables

### Development (.env)
```bash
# backend/.env
FIREBASE_PROJECT_ID=your-project-id
USE_FIREBASE_EMULATOR=true
OPENAI_API_KEY=sk-...
```

### Production (Firebase Config)
```bash
firebase functions:config:set \
  app.environment="production" \
  firebase.project_id="your-project-id" \
  openai.api_key="sk-..."
```

**Access in code:**
```python
import os
from firebase_functions import config

# Development (reads .env)
api_key = os.getenv('OPENAI_API_KEY')

# Production (reads Firebase config)
api_key = config().get('openai', {}).get('api_key')
```

## Custom Domain

### 1. Add Domain in Firebase Console
1. Go to Hosting → Add custom domain
2. Enter your domain (e.g., `app.example.com`)
3. Follow DNS verification steps

### 2. Update DNS Records
Add the records Firebase provides (usually A or CNAME).

### 3. SSL Certificate
Firebase automatically provisions SSL certificates (can take up to 24 hours).

## Monitoring

### View Logs

**Functions logs:**
```bash
firebase functions:log
```

**Specific function:**
```bash
firebase functions:log --only helloWorld
```

**Follow logs:**
```bash
firebase functions:log --tail
```

### Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to:
   - **Functions** - Invocations, errors, execution time
   - **Firestore** - Database usage, requests
   - **Hosting** - Bandwidth, requests
   - **Analytics** - User behavior (if enabled)

### Set Up Alerts

1. Functions → Usage → Set budget alerts
2. Configure email notifications
3. Set thresholds (e.g., 80%, 90%, 100%)

## Rollback

### Rollback Functions

```bash
# List previous versions
firebase functions:list --json

# Rollback to previous version
# (Not directly supported - redeploy previous code)
git checkout <previous-commit>
firebase deploy --only functions
git checkout main
```

### Rollback Hosting

```bash
# List previous deployments
firebase hosting:channel:list

# Rollback (clone previous version)
firebase hosting:clone <source>:live <target>:live
```

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          cd web && npm install
          cd ../backend/functions
          pip install -r requirements.txt

      - name: Build web
        run: cd web && npm run build

      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: your-project-id
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
deploy:
  image: node:18
  script:
    - npm install -g firebase-tools
    - cd web && npm install && npm run build && cd ..
    - firebase deploy --token $FIREBASE_TOKEN
  only:
    - main
```

## Cost Management

### Free Tier Limits (Monthly)
- Functions: 2M invocations, 400K GB-sec
- Firestore: 1 GB storage, 50K reads, 20K writes
- Hosting: 10 GB bandwidth

### Optimize Costs

1. **Minimize cold starts:**
   ```python
   # Use global variables
   _container = None

   def get_container():
       global _container
       if _container is None:
           _container = Container()
       return _container
   ```

2. **Cache expensive operations:**
   ```python
   from functools import lru_cache

   @lru_cache(maxsize=128)
   def expensive_query(param):
       return db.collection('items').get()
   ```

3. **Set memory appropriately:**
   - Most functions: 256MB
   - Heavy processing: 512MB-1GB
   - Don't over-provision

4. **Monitor usage:**
   ```bash
   firebase functions:log --json | jq '.usage'
   ```

## Troubleshooting

### Deployment Fails

**Check Firebase login:**
```bash
firebase logout
firebase login
```

**Verify project:**
```bash
firebase projects:list
firebase use <project-id>
```

**Check build:**
```bash
cd web
npm run build
cd ..
```

### Function Not Accessible

**Check deployment:**
```bash
firebase functions:list
```

**Check logs:**
```bash
firebase functions:log --only <functionName>
```

**Verify URL:**
```
https://us-central1-<project-id>.cloudfunctions.net/<functionName>
```

### CORS Errors

Add CORS headers to functions:
```python
def my_function(request):
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    }

    if request.method == 'OPTIONS':
        return ('', 204, headers)

    result = {"message": "Success"}
    return (result, 200, headers)
```

## Production Checklist

- [ ] Environment variables configured
- [ ] Firestore security rules deployed
- [ ] Storage rules deployed (if using)
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Budget alerts set up
- [ ] Monitoring configured
- [ ] Backup strategy in place
- [ ] Team access configured
- [ ] API keys rotated (if needed)

## Learn More

- [Firebase Functions Docs](https://firebase.google.com/docs/functions)
- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Console](https://console.firebase.google.com/)
