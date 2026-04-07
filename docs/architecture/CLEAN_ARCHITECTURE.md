# Clean Architecture

This project implements Clean Architecture principles to ensure maintainability, testability, and scalability.

## Layers Overview

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│    (Cloud Functions, API Handlers)      │
│  - Cloud Function entry points          │
│  - HTTP request handlers                │
│  - Request/Response formatting          │
├─────────────────────────────────────────┤
│         Application Layer               │
│      (Use Cases, DTOs, Services)        │
│  - Business workflows                   │
│  - Application-specific logic           │
│  - Data transformation                  │
├─────────────────────────────────────────┤
│           Domain Layer                  │
│   (Business Logic, Entities, Interfaces)│
│  - Core business rules                  │
│  - Domain entities                      │
│  - Repository interfaces                │
├─────────────────────────────────────────┤
│       Infrastructure Layer              │
│  (Firestore, External APIs, Services)  │
│  - Firestore implementations            │
│  - External service integrations        │
│  - Dependency injection container       │
└─────────────────────────────────────────┘
```

## Domain Layer

**Location:** `backend/src/domain/`

The domain layer is the heart of the application, containing:

- **Entities:** Core business objects (e.g., `User`, `Conversation`, `Message`)
- **Value Objects:** Immutable objects representing values
- **Repository Interfaces:** Contracts for data access
- **Domain Services:** Business logic that doesn't fit in entities

### Principles:
- **Framework Independent:** No dependencies on external frameworks
- **Pure Business Logic:** Only business rules, no infrastructure concerns
- **Interfaces Over Implementations:** Define contracts, not implementations

### Example:

```python
# backend/src/domain/entities.py
from dataclasses import dataclass
from uuid import UUID
from enum import Enum

class UserStatus(Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"

@dataclass
class User:
    id: UUID
    email: str
    full_name: str
    status: UserStatus

    def is_active(self) -> bool:
        """Domain logic: Check if user is active."""
        return self.status == UserStatus.ACTIVE

# backend/src/domain/repositories.py
from abc import ABC, abstractmethod

class IUserRepository(ABC):
    """Repository interface - no implementation details."""

    @abstractmethod
    async def create(self, user: User) -> User:
        pass

    @abstractmethod
    async def get_by_id(self, user_id: UUID) -> User | None:
        pass
```

## Application Layer

**Location:** `backend/src/application/`

The application layer orchestrates business workflows:

- **Use Cases:** Application-specific business operations
- **DTOs:** Data transfer objects for input/output (using Pydantic)
- **Service Interfaces:** Contracts for application services

### Principles:
- **Use Case Driven:** Each use case represents a business operation
- **DTO Validation:** Input validation using Pydantic
- **Thin Layer:** Orchestrates domain logic, doesn't contain it

### Example:

```python
# backend/src/application/dtos.py
from pydantic import BaseModel, EmailStr

class UserCreateDTO(BaseModel):
    """Input DTO with validation."""
    email: EmailStr
    full_name: str
    password: str

class UserResponseDTO(BaseModel):
    """Output DTO."""
    id: str
    email: str
    full_name: str

    @classmethod
    def from_entity(cls, user: User) -> "UserResponseDTO":
        return cls(
            id=str(user.id),
            email=user.email,
            full_name=user.full_name
        )

# backend/src/application/use_cases/user_use_cases.py
class CreateUserUseCase:
    """Use case: Orchestrates user creation workflow."""

    def __init__(self, user_repository: IUserRepository):
        self._user_repository = user_repository

    async def execute(self, dto: UserCreateDTO) -> UserResponseDTO:
        # 1. Input validation (done by Pydantic DTO)

        # 2. Create domain entity
        user = User(
            id=uuid4(),
            email=dto.email,
            full_name=dto.full_name,
            status=UserStatus.ACTIVE
        )

        # 3. Persist via repository interface
        created_user = await self._user_repository.create(user)

        # 4. Return response DTO
        return UserResponseDTO.from_entity(created_user)
```

## Infrastructure Layer

**Location:** `backend/src/infrastructure/`

The infrastructure layer provides implementations:

- **Repository Implementations:** Concrete data access using Firestore
- **Database Configuration:** Firestore client setup
- **External Services:** Third-party API integrations (LLMs, etc.)
- **Dependency Injection:** Container configuration

### Principles:
- **Implements Interfaces:** Implements domain repository interfaces
- **Framework Specific:** Can use Firebase SDK, Cloud APIs
- **Replaceable:** Can swap implementations without affecting domain

### Example:

```python
# backend/src/infrastructure/repositories.py
from google.cloud.firestore_v1 import AsyncClient
from src.domain.repositories import IUserRepository
from src.domain.entities import User

class UserRepository(IUserRepository):
    """Firestore implementation of user repository."""

    def __init__(self, db: AsyncClient):
        self._db = db

    async def create(self, user: User) -> User:
        # Implementation detail: Using Firestore
        doc_ref = self._db.collection('users').document(str(user.id))
        await doc_ref.set({
            'email': user.email,
            'full_name': user.full_name,
            'status': user.status.value
        })
        return user

    async def get_by_id(self, user_id: UUID) -> User | None:
        doc = await self._db.collection('users').document(str(user_id)).get()
        if not doc.exists:
            return None
        data = doc.to_dict()
        return User(
            id=user_id,
            email=data['email'],
            full_name=data['full_name'],
            status=UserStatus(data['status'])
        )

# backend/src/infrastructure/container.py
class Container:
    """Simple dependency injection container."""

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

## Presentation Layer

**Location:** `backend/functions/`

The presentation layer handles external communication via Cloud Functions:

- **Function Entry Points:** `main.py` - Registered Cloud Functions
- **HTTP Handlers:** Business logic handlers
- **Request Validation:** Parse and validate requests
- **Response Formatting:** Format JSON responses

### Principles:
- **Thin Handlers:** Delegate to use cases
- **Input Validation:** Validate all inputs
- **Proper HTTP Status Codes:** Use correct status codes
- **Stateless:** Each function invocation is independent

### Example:

```python
# backend/functions/main.py
import functions_framework
from handlers import http_handlers

@functions_framework.http
def createUser(request: Request):
    """
    Cloud Function: Create user endpoint.

    Thin wrapper - delegates to handler.
    """
    return http_handlers.create_user(request)

# backend/functions/handlers/http_handlers.py
from flask import Request
from typing import Tuple, Dict, Any

def create_user(request: Request) -> Tuple[Dict[str, Any], int]:
    """Handler: Delegates to use case."""
    try:
        # 1. Parse request
        data = request.get_json()
        dto = UserCreateDTO(**data)

        # 2. Get container (dependency injection)
        container = get_container()

        # 3. Execute use case
        use_case = container.create_user_use_case()
        result = use_case.execute(dto)

        # 4. Return response
        return result.to_dict(), 201

    except ValidationError as e:
        return {"error": "Invalid input", "details": e.errors()}, 400
    except Exception as e:
        return {"error": "Internal server error"}, 500
```

## Dependency Flow

**Dependency Rule:** Dependencies should only point inward. Inner layers should not know about outer layers.

```
Presentation → Application → Domain ← Infrastructure
 (Functions)    (Use Cases)  (Entities)  (Firestore)
                                ↑
                        (implements interfaces)
```

- **Presentation** (Cloud Functions) depends on **Application** (Use Cases)
- **Application** depends on **Domain** (Entities, Interfaces)
- **Infrastructure** depends on **Domain** (implements repository interfaces)
- **Domain** depends on **nothing** (pure business logic)

### Why This Matters:
- ✅ Domain layer is **completely independent** of Firebase
- ✅ Could swap Firestore for PostgreSQL without touching domain
- ✅ Could replace Cloud Functions with FastAPI without touching domain
- ✅ Business logic is **pure and testable**

## Serverless Adaptation

Clean Architecture works perfectly with serverless:

### Container Initialization (Optimized for Cloud Functions)

```python
# Global variable (reused across invocations)
_container = None

def get_container() -> Container:
    """Lazy initialization with caching."""
    global _container
    if _container is None:
        setup_logging()
        _container = Container()
        _container.wire(modules=_container.wiring_config.modules)
    return _container
```

**Benefits:**
- Container created once per function instance
- Reused across invocations (reduces cold start)
- Clean Architecture maintained

### Stateless Functions

Each function call is stateless - perfect for Clean Architecture:
- Use cases are **pure operations** (no state)
- Repositories access database (state managed by Firestore)
- Functions scale independently

## Benefits

1. **Testability:** Each layer can be tested independently
2. **Maintainability:** Changes in one layer don't affect others
3. **Flexibility:** Easy to swap implementations (Firestore → PostgreSQL)
4. **Business Focus:** Domain logic is isolated and clear
5. **Framework Independence:** Not tied to Firebase or any framework
6. **Serverless Ready:** Stateless design fits serverless perfectly

## Testing Strategy

### Domain Layer Tests
```python
# Pure unit tests - no mocks needed
def test_user_is_active():
    user = User(
        id=uuid4(),
        email="test@example.com",
        status=UserStatus.ACTIVE
    )
    assert user.is_active() == True
```

### Application Layer Tests
```python
# Test use cases with mocked repositories
@pytest.mark.asyncio
async def test_create_user_use_case():
    # Mock repository
    mock_repo = Mock(spec=IUserRepository)
    mock_repo.create.return_value = user

    # Test use case
    use_case = CreateUserUseCase(mock_repo)
    result = await use_case.execute(dto)

    assert result.email == "test@example.com"
    mock_repo.create.assert_called_once()
```

### Infrastructure Layer Tests
```python
# Integration tests with Firestore emulator
@pytest.mark.asyncio
async def test_user_repository_create(firestore_client):
    repo = UserRepository(firestore_client)
    user = User(id=uuid4(), email="test@example.com")

    created = await repo.create(user)

    assert created.id == user.id
```

### Presentation Layer Tests
```python
# Test handlers with mocked use cases
def test_create_user_handler():
    mock_use_case = Mock()
    mock_use_case.execute.return_value = UserResponseDTO(...)

    # Mock container
    with patch('handlers.http_handlers.get_container') as mock_container:
        mock_container.return_value.create_user_use_case.return_value = mock_use_case

        response = create_user(mock_request)

        assert response[1] == 201
```

## Project Structure

```
backend/
├── functions/              # Presentation Layer (Cloud Functions)
│   ├── main.py            # Function entry points
│   └── handlers/          # HTTP handlers
│
└── src/                   # Clean Architecture layers
    ├── domain/            # Domain Layer
    │   ├── entities.py
    │   ├── repositories.py
    │   └── services.py
    │
    ├── application/       # Application Layer
    │   ├── dtos.py
    │   └── use_cases/
    │
    └── infrastructure/    # Infrastructure Layer
        ├── repositories.py
        ├── container.py
        └── database.py
```

## Learn More

- [Serverless Architecture](serverless.md) - Cloud Functions design
- [Getting Started](../setup/getting-started.md) - Setup guide
- [Deployment](../deployment/DEPLOYMENT.md) - Production deployment

## External Resources

- [Clean Architecture Book](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164)
- [Uncle Bob's Blog](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Dependency Injection Patterns in Python](https://martinfowler.com/articles/injection.html)
