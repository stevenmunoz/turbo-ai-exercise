---
name: feature-completion-check
description: "Verify a feature is implemented end-to-end across all Clean Architecture layers. Use before marking a feature as done, creating a PR for a new feature, or when the user asks 'is this feature complete', 'check feature', 'verify implementation', or 'did I miss anything'."
---

# Feature Completion Check

Verify a feature is implemented end-to-end across all layers.

## Workflow

### Step 1: Map the Data Flow

Identify all layers the feature touches:
```
Cloud Function → Handler → Use Case → Domain Entity → Repository → Firestore
Frontend Route → Component → API Service → Cloud Function
```

### Step 2: Verify Each Layer

For each layer, check that the implementation exists and is connected:

| Layer | File | Check |
|-------|------|-------|
| **Cloud Function** | `backend/functions/main.py` | Function registered with `@functions_framework.http` |
| **Handler** | `backend/functions/handlers/http_handlers.py` | Handler function exists, uses container |
| **Use Case** | `backend/src/application/use_cases/` | Use case class with `execute()` method |
| **DTOs** | `backend/src/application/dtos.py` | Request/Response DTOs defined |
| **Domain Entity** | `backend/src/domain/entities.py` | Entity with business logic |
| **Repository Interface** | `backend/src/domain/repositories.py` | Abstract method defined |
| **Repository Impl** | `backend/src/infrastructure/repositories.py` | Firestore implementation |
| **Container** | `backend/src/infrastructure/container.py` | Use case wired with dependencies |
| **Frontend Route** | `web/src/routes/index.tsx` | Route added |
| **Frontend Component** | `web/src/pages/` or `web/src/features/` | Page/component exists |
| **API Service** | `web/src/features/*/services/` | API call to Cloud Function |
| **Tests** | `backend/tests/` | Unit test for use case |

### Step 3: Test Critical Paths

```bash
# Backend: verify imports work
cd backend && python -c "from src.infrastructure.container import Container; c = Container(); print(type(c.<use_case_method>()))"

# Frontend: verify build
cd web && npm run build

# Run tests
cd backend && python -m pytest tests/ -x
```

**Also verify these critical paths:**
- **Empty state**: What happens when no data exists? Does the frontend handle empty responses?
- **Error state**: What happens when the backend returns an error? Does the frontend show an error message?
- **Validation**: What happens with invalid input? Do DTOs reject bad data with clear errors?

### Step 4: Report

Output a completion checklist:

```
Feature: <feature name>

[x] Cloud Function registered in main.py
[x] Handler created with error handling
[x] Use case implements business logic
[x] DTOs validate input/output
[x] Domain entity defined
[x] Repository interface declared
[x] Firestore repository implemented
[x] Container wires dependencies
[ ] Frontend route added
[ ] Frontend component created
[x] Tests exist and pass
[ ] Documentation updated
```
