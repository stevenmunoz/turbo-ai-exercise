# Calling Cloud Functions from Frontend

The backend is now serverless using Firebase Cloud Functions. Update your API calls to use the Functions URLs.

## Local Development

```typescript
// web/src/config/api.ts
const FUNCTIONS_URL = import.meta.env.VITE_FUNCTIONS_URL
  || 'http://localhost:5001/<YOUR_PROJECT_ID>/us-central1';

export const API = {
  helloWorld: `${FUNCTIONS_URL}/helloWorld`,
  health: `${FUNCTIONS_URL}/health`,
  createUser: `${FUNCTIONS_URL}/createUser`,
  listUsers: `${FUNCTIONS_URL}/listUsers`,
  getUser: `${FUNCTIONS_URL}/getUser`,
  // Add your functions here
};
```

## Environment Variables

Create `web/.env`:

```bash
# Local development
VITE_FUNCTIONS_URL=http://localhost:5001/<YOUR_PROJECT_ID>/us-central1

# Production
# VITE_FUNCTIONS_URL=https://us-central1-<YOUR_PROJECT_ID>.cloudfunctions.net
```

## Example: Calling a Function

### Simple GET Request

```typescript
// Call hello world
const response = await fetch(`${API.helloWorld}?name=Alice`);
const data = await response.json();
console.log(data.message); // "Hello, Alice!"
```

### POST Request

```typescript
// Create an item
const response = await fetch(API.createItem, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'My Item',
    description: 'Item description'
  })
});

const result = await response.json();
```

### With Authentication (Firebase Auth)

```typescript
import { getAuth } from 'firebase/auth';

async function callProtectedFunction() {
  // Get Firebase Auth token
  const token = await getAuth().currentUser?.getIdToken();

  const response = await fetch(API.createItem, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name: 'Protected Item' })
  });

  return response.json();
}
```

## Error Handling

```typescript
async function callFunction() {
  try {
    const response = await fetch(API.createItem, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test' })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

## React Hook Example

```typescript
// hooks/useCloudFunction.ts
import { useState } from 'react';

export function useCloudFunction<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const call = async (url: string, options?: RequestInit) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Request failed');
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { call, loading, error, data };
}

// Usage
function MyComponent() {
  const { call, loading, data } = useCloudFunction();

  const handleClick = async () => {
    await call(API.helloWorld + '?name=Alice');
  };

  return (
    <div>
      <button onClick={handleClick} disabled={loading}>
        Say Hello
      </button>
      {data && <p>{data.message}</p>}
    </div>
  );
}
```

## Finding Your Project ID

1. Check `firebase.json` or `.firebaserc`
2. Or check Firebase Console: https://console.firebase.google.com/
3. Or run: `firebase projects:list`

## Testing Functions Locally

```bash
# Start emulator
./dev.sh

# Test in browser or curl
curl "http://localhost:5001/<project-id>/us-central1/helloWorld?name=Test"
curl -X POST http://localhost:5001/<project-id>/us-central1/createItem \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Item"}'
```

## Production URLs

After deploying with `./deploy.sh`, your functions will be at:

```
https://us-central1-<YOUR_PROJECT_ID>.cloudfunctions.net/<functionName>
```

Update `VITE_FUNCTIONS_URL` in production environment to this URL.
