# Project Context for AI Agents

> **Comprehensive context about this project for AI assistants.**

## Project Overview

**Type:** Production-ready serverless full-stack starter template
**Architecture:** Firebase Cloud Functions + Clean Architecture
**Purpose:** Rapid project initialization with best practices built-in

## Technology Stack

### Backend (Serverless)
- **Runtime:** Python 3.11+
- **Framework:** Firebase Cloud Functions (functions-framework)
- **Database:** Firebase Firestore
- **Auth:** Firebase Authentication
- **Architecture:** Clean Architecture (Domain → Application → Infrastructure → Presentation)
- **DI:** Simple Python container (no external library)

### Frontend
- **Web:** React 18 + TypeScript + Vite
- **State Management:** React hooks
- **Styling:** CSS modules

### Development
- **Emulator:** Firebase Emulator Suite
- **Testing:** pytest (backend), Jest (frontend)
- **Code Quality:** black, isort, ruff, mypy (Python), ESLint, Prettier (TypeScript)

## Project Structure

```
├── backend/
│   ├── functions/                    # SERVERLESS ENTRY POINTS
│   │   ├── main.py                  # Cloud Functions registration
│   │   ├── handlers/
│   │   │   └── http_handlers.py     # HTTP handlers + container init
│   │   └── requirements.txt         # Functions dependencies
│   │
│   ├── src/                          # CLEAN ARCHITECTURE
│   │   ├── core/                    # Config, exceptions, logging, security
│   │   ├── domain/                  # Entities, repository interfaces, services
│   │   ├── application/             # Use cases, DTOs (Pydantic)
│   │   └── infrastructure/          # Firestore repos, DI container, database
│   │
│   └── tests/                       # pytest tests
│
├── web/                              # REACT WEB APP
│   └── src/
│       ├── components/
│       ├── features/
│       ├── pages/
│       ├── routes/
│       └── core/config.ts
│
├── .claude/                          # CLAUDE CODE TOOLING
│   ├── commands/                    # Slash commands (branch, PR, CI, etc.)
│   ├── skills/                      # Workflow skills (pre-flight, deploy, debug)
│   └── agents/                      # Specialized agent profiles
│
├── docs/                             # Documentation
├── firebase.json                    # Firebase configuration
├── firestore.rules                  # Database security rules
├── setup.sh                         # One-time setup
├── dev.sh                           # Start development
└── deploy.sh                        # Deploy to production
```

## Architecture

### Clean Architecture Layers

**Dependency Rule:** Dependencies point inward only.

```
Presentation → Application → Domain ← Infrastructure
(Functions)    (Use Cases)   (Entities) (Firestore)
```

1. **Domain** (`backend/src/domain/`) — Pure business logic. Entities, repository interfaces, domain services. No external dependencies.
2. **Application** (`backend/src/application/`) — Use cases orchestrate business workflows. DTOs for input/output validation.
3. **Infrastructure** (`backend/src/infrastructure/`) — Implements domain interfaces. Firestore repositories, DI container, database client.
4. **Presentation** (`backend/functions/`) — Cloud Functions entry points. HTTP handlers, request/response formatting.

### Simple DI Container

```python
# backend/src/infrastructure/container.py
class Container:
    """Lazy-initialized properties for singletons, factory methods for use cases."""

    @property
    def db(self):
        if self._db is None:
            self._db = get_firestore()
        return self._db

    @property
    def user_repository(self) -> UserRepository:
        if self._user_repository is None:
            self._user_repository = UserRepository(db=self.db)
        return self._user_repository

    def create_user_use_case(self) -> CreateUserUseCase:
        return CreateUserUseCase(user_repository=self.user_repository)
```

### Container Initialization (Performance Critical)

```python
# Global — reused across Cloud Function invocations to reduce cold starts
_container = None

def get_container() -> Container:
    global _container
    if _container is None:
        setup_logging()
        _container = Container()
    return _container
```

### Function Pattern

```python
# backend/functions/main.py
@functions_framework.http
def createUser(request: Request):
    return http_handlers.create_user(request)

# backend/functions/handlers/http_handlers.py
def create_user(request: Request) -> Tuple[Dict[str, Any], int]:
    data = request.get_json()
    dto = UserCreateDTO(**data)
    container = get_container()
    use_case = container.create_user_use_case()
    result = use_case.execute(dto)
    return json_response(result.to_dict(), 201)
```

## Conventions

### Naming

- **Cloud Functions:** camelCase (`createUser`, `listUsers`)
- **Python:** snake_case functions, PascalCase classes, UPPER_CASE constants
- **TypeScript:** camelCase variables, PascalCase components, UPPER_CASE constants

### Adding a New Endpoint

1. Create handler in `backend/functions/handlers/http_handlers.py`
2. Register in `backend/functions/main.py`
3. Create use case in `backend/src/application/use_cases/`
4. Create DTOs in `backend/src/application/dtos.py`
5. Add factory method in `backend/src/infrastructure/container.py`

### Adding a New Entity

1. Define in `backend/src/domain/entities.py`
2. Create repository interface in `backend/src/domain/repositories.py`
3. Implement in `backend/src/infrastructure/repositories.py`
4. Add mapper class for Firestore serialization

## Environment Configuration

### Backend (`backend/.env`)
```bash
PROJECT_NAME=Starter App
ENVIRONMENT=development
DEBUG=true

# Firebase
FIREBASE_PROJECT_ID=demo-project
USE_FIREBASE_EMULATOR=true
FIREBASE_EMULATOR_HOST=localhost
FIREBASE_EMULATOR_PORT=8080

# Security
SECRET_KEY=<auto-generated>
JWT_SECRET=<auto-generated>
```

### Frontend (`web/.env`)
```bash
VITE_FUNCTIONS_URL=http://localhost:5001/<project-id>/us-central1
VITE_APP_NAME=Starter App
```

## Development

```bash
./setup.sh    # First time setup
./dev.sh      # Start development (emulators + web)
./deploy.sh   # Deploy to Firebase
```

### URLs
- Emulator UI: http://localhost:4000
- Functions: http://localhost:5001
- Web: http://localhost:3000
- Firestore: http://localhost:8080

### Testing
```bash
cd backend && python -m pytest tests/ -v       # Backend
cd web && npm test                               # Frontend
```

## Key Paths

| Purpose | Path |
|---------|------|
| Functions entry | `backend/functions/main.py` |
| Handlers | `backend/functions/handlers/http_handlers.py` |
| Use cases | `backend/src/application/use_cases/` |
| DTOs | `backend/src/application/dtos.py` |
| Entities | `backend/src/domain/entities.py` |
| Repository interfaces | `backend/src/domain/repositories.py` |
| Firestore repos | `backend/src/infrastructure/repositories.py` |
| DI Container | `backend/src/infrastructure/container.py` |
| Config | `backend/src/core/config.py` |
| Exceptions | `backend/src/core/exceptions.py` |
| Firebase config | `firebase.json` |
| Firestore rules | `firestore.rules` |
