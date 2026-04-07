"""HTTP-triggered Cloud Functions handlers."""

import sys
import os
from typing import Any, Dict, Tuple

from flask import Request

# Add parent directory to path for Clean Architecture imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../'))

from src.infrastructure.container import Container
from src.core.exceptions import AppException
from src.core.logging import setup_logging
from src.application.dtos import UserCreateDTO

# Global container (initialized once, reused across invocations)
_container = None


def get_container() -> Container:
    """Get or create container (lazy initialization).

    The container is created once on the first invocation and reused
    across subsequent invocations in the same process. This reduces
    cold start time for Cloud Functions.
    """
    global _container
    if _container is None:
        setup_logging()
        _container = Container()
    return _container


def json_response(data: Any, status_code: int = 200) -> Tuple[Dict[str, Any], int]:
    """Create JSON response tuple."""
    return data, status_code


# ============================================================================
# EXAMPLE ENDPOINTS — Demonstrate full Clean Architecture path
# ============================================================================

def hello_world(request: Request) -> Tuple[Dict[str, Any], int]:
    """Simple hello world endpoint (no container needed)."""
    name = request.args.get('name', 'World')
    return json_response({
        "message": f"Hello, {name}!",
        "service": "scalable-app-template"
    }, 200)


def health(request: Request) -> Tuple[Dict[str, Any], int]:
    """Health check endpoint."""
    return json_response({"status": "healthy"}, 200)


def create_user(request: Request) -> Tuple[Dict[str, Any], int]:
    """Create a new user.

    Demonstrates full Clean Architecture flow:
    Handler → Use Case → Domain Entity → Repository → Firestore
    """
    try:
        data = request.get_json()
        dto = UserCreateDTO(**data)

        container = get_container()
        use_case = container.create_user_use_case()
        result = use_case.execute(dto)

        return json_response(result.to_dict(), 201)
    except AppException as e:
        return json_response({"error": str(e)}, e.status_code)
    except Exception as e:
        return json_response({"error": "Validation failed", "details": str(e)}, 400)


def get_user(request: Request) -> Tuple[Dict[str, Any], int]:
    """Get a user by ID."""
    try:
        user_id = request.args.get('id')
        if not user_id:
            return json_response({"error": "Missing 'id' query parameter"}, 400)

        container = get_container()
        use_case = container.get_user_use_case()
        result = use_case.execute(user_id)

        return json_response(result.to_dict(), 200)
    except AppException as e:
        return json_response({"error": str(e)}, e.status_code)
    except Exception as e:
        return json_response({"error": "Internal server error"}, 500)


def list_users(request: Request) -> Tuple[Dict[str, Any], int]:
    """List all users with pagination."""
    try:
        skip = int(request.args.get('skip', 0))
        limit = int(request.args.get('limit', 10))

        container = get_container()
        use_case = container.list_users_use_case()
        result = use_case.execute(skip=skip, limit=limit)

        return json_response(result.to_dict(), 200)
    except AppException as e:
        return json_response({"error": str(e)}, e.status_code)
    except Exception as e:
        return json_response({"error": "Internal server error"}, 500)
