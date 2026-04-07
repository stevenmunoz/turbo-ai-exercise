---
name: test-suite
description: "Run and manage tests across the project. Use when the user asks to 'run tests', 'check tests', 'write tests', 'test coverage', 'add tests', or needs to verify code with tests. Covers backend (pytest) and frontend (npm test) test suites."
---

# Test Suite

Run and manage tests across the project.

## Test Pyramid Targets

| Level | Target | Tool |
|-------|--------|------|
| Unit tests | 90%+ coverage for use cases | pytest |
| Integration tests | Key repository operations | pytest + Firestore emulator |
| Frontend tests | Component rendering + interactions | npm test (React Testing Library) |

Overall target: **70%+ coverage**, with **90%+ for use cases**.

## Quick Reference

```bash
# Backend — all tests
cd backend && python -m pytest tests/ -v

# Backend — specific file
cd backend && python -m pytest tests/unit/test_user_use_cases.py -v

# Backend — with coverage
cd backend && python -m pytest tests/ --cov=src --cov-report=term-missing

# Frontend — all tests
cd web && npm test -- --watchAll=false

# Frontend — specific file
cd web && npm test -- --testPathPattern="App.test" --watchAll=false
```

## Workflows

### 1. Run All Tests

```bash
cd backend && python -m pytest tests/ -v --tb=short
cd web && npm test -- --watchAll=false
```

### 2. Check Coverage

```bash
cd backend && python -m pytest tests/ --cov=src --cov-report=term-missing --cov-fail-under=70
```

Target coverage: 70%+ overall, 90%+ for use cases.

### 3. Find Untested Code

```bash
cd backend && python -m pytest tests/ --cov=src --cov-report=term-missing | grep "MISS"
```

Look for:
- Use cases without test files
- Repository methods not covered
- Error handling paths not tested

### 4. Write Tests for New Use Cases

Follow this pattern:
```python
# tests/unit/test_<use_case>.py
import pytest
from unittest.mock import Mock, AsyncMock
from src.application.use_cases.<module> import <UseCase>
from src.domain.repositories import IUserRepository

@pytest.mark.asyncio
async def test_use_case_success():
    mock_repo = Mock(spec=IUserRepository)
    mock_repo.method = AsyncMock(return_value=expected)

    use_case = UseCase(user_repository=mock_repo)
    result = await use_case.execute(dto)

    assert result.field == expected_value
    mock_repo.method.assert_called_once()

@pytest.mark.asyncio
async def test_use_case_not_found():
    mock_repo = Mock(spec=IUserRepository)
    mock_repo.get_by_id = AsyncMock(return_value=None)

    use_case = UseCase(user_repository=mock_repo)
    with pytest.raises(NotFoundException):
        await use_case.execute("nonexistent-id")
```

### 5. Pre-PR Test Validation

```bash
# Must pass before PR
cd backend && python -m pytest tests/ -x --tb=short
cd web && npm test -- --watchAll=false
```
