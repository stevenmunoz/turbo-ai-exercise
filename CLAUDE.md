# Instructions for Claude (AI Assistant)

> **Read this file first when helping with this project.**

## Project Context

**Full project context:** See `AGENTS.md` for architecture, structure, and conventions.

This is a **production-ready serverless full-stack starter template** built with:
- Firebase Cloud Functions (Python serverless backend)
- React + TypeScript (web frontend)
- Clean Architecture principles
- Firebase Firestore database
- Simple dependency injection (no external DI library)

## Critical Rules

### Always Follow These Patterns

#### 1. Cloud Functions Pattern

**Register function in `backend/functions/main.py`:**
```python
@functions_framework.http
def myFunction(request: Request):
    """Brief description."""
    return http_handlers.my_function(request)
```

**Create handler in `backend/functions/handlers/http_handlers.py`:**
```python
def my_function(request: Request) -> Tuple[Dict[str, Any], int]:
    try:
        data = request.get_json()
        dto = MyDTO(**data)

        container = get_container()
        use_case = container.my_use_case()
        result = use_case.execute(dto)

        return json_response(result.to_dict(), 200)
    except AppException as e:
        return json_response({"error": str(e)}, e.status_code)
    except Exception as e:
        return json_response({"error": "Internal server error"}, 500)
```

#### 2. Clean Architecture Layers

**Dependency flow (inward only):**
```
Functions → Use Cases → Domain Entities ← Repository Implementations
```

- **Domain** (`backend/src/domain/`) — Pure business logic, NO external dependencies
- **Application** (`backend/src/application/`) — Use cases, DTOs (Pydantic models)
- **Infrastructure** (`backend/src/infrastructure/`) — Firestore repos, DI container
- **Presentation** (`backend/functions/`) — Cloud Functions entry points, handlers

#### 3. Simple Dependency Injection

The container uses plain Python — no external library:

```python
# backend/src/infrastructure/container.py
class Container:
    @property
    def user_repository(self) -> UserRepository:
        if self._user_repository is None:
            self._user_repository = UserRepository(db=self.db)
        return self._user_repository

    def create_user_use_case(self) -> CreateUserUseCase:
        return CreateUserUseCase(user_repository=self.user_repository)
```

**Container initialization (performance critical):**
```python
# Global — reused across Cloud Function invocations
_container = None

def get_container() -> Container:
    global _container
    if _container is None:
        setup_logging()
        _container = Container()
    return _container
```

#### 4. Error Handling

```python
try:
    # Business logic
    pass
except AppException as e:
    return json_response({"error": str(e)}, e.status_code)
except ValidationError as e:
    return json_response({"error": "Validation failed", "details": e.errors()}, 400)
except Exception as e:
    logger.error(f"Unexpected error: {e}")
    return json_response({"error": "Internal server error"}, 500)
```

#### 5. Type Safety

**Python:** Always use type hints.
**TypeScript:** Strict mode, no `any`.

## When Adding New Endpoints

1. Create handler in `backend/functions/handlers/http_handlers.py`
2. Register in `backend/functions/main.py`
3. Create use case in `backend/src/application/use_cases/`
4. Create DTOs in `backend/src/application/dtos.py`
5. Add factory method in `backend/src/infrastructure/container.py`

## When Modifying Frontend

```typescript
// web/src/core/config.ts
export const config = {
  apiUrl: import.meta.env.VITE_FUNCTIONS_URL || 'http://localhost:5001',
  appName: import.meta.env.VITE_APP_NAME || 'Starter App',
} as const;
```

## Running the Project

### Without Conductor (standard)
```bash
./setup.sh    # One-time: installs deps, creates venvs, generates .env
./dev.sh      # Starts Firebase emulators + web dev server
# Ctrl+C to stop all services
```

### With Conductor
Conductor uses `conductor.json` to run `scripts/conductor-setup.sh` and `scripts/conductor-run.sh` automatically. Same services, managed by Conductor's workspace lifecycle.

### Service URLs (once running)
| Service | URL |
|---------|-----|
| Web App | http://localhost:3000 |
| Emulator UI | http://localhost:4000 |
| Cloud Functions | http://localhost:5001/demo-project/us-central1/ |
| Firestore | http://localhost:8080 |

## Testing

```bash
# Backend
cd backend && python -m pytest tests/ -v

# Frontend
cd web && npm test
```

## Claude Code Tooling

This project includes `.claude/` configuration:

- **Commands** (`/create-branch`, `/create-pr`, `/dev-start`, `/watch-ci`, `/resolve-merge-conflicts`, `/cleanup-merged-branches`, `/fix-pr-comments`)
- **Skills** (pre-flight, deploy-function, debug-cloud-function, test-suite, feature-completion-check, skill-creator)
- **Agents** (backend-debugger, code-quality-guardian, test-coverage-specialist)

## Quick Reference

### URLs
- Local Functions: `http://localhost:5001/<project-id>/us-central1/<functionName>`
- Emulator UI: `http://localhost:4000`
- Web App: `http://localhost:3000`

### Commands
```bash
./setup.sh              # Setup project
./dev.sh                # Start development
./deploy.sh             # Deploy to production
pytest backend/tests/   # Run tests
```

### Key Paths
- Functions: `backend/functions/main.py`
- Handlers: `backend/functions/handlers/http_handlers.py`
- Use Cases: `backend/src/application/use_cases/`
- Entities: `backend/src/domain/entities.py`
- Repositories: `backend/src/infrastructure/repositories.py`
- Container: `backend/src/infrastructure/container.py`

## Common Pitfalls

- Don't put business logic in handlers — use cases only
- Don't skip DTOs for validation
- Don't use `any` type in TypeScript
- Don't forget error handling in handlers
- Don't create new venv without Python 3.11+
- Do follow Clean Architecture layer boundaries
- Do use `get_container()` global pattern for cold start optimization
- Do validate with Pydantic DTOs
