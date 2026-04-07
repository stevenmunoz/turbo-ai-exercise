"""Firebase Cloud Functions entry points.

Each function is registered with @functions_framework.http and delegates
to handlers in handlers/http_handlers.py. This keeps entry points thin
and business logic in the Clean Architecture layers.
"""

import functions_framework
from flask import Request

from handlers import http_handlers


# ============================================================================
# CLOUD FUNCTIONS — Register your functions here
# ============================================================================

@functions_framework.http
def helloWorld(request: Request):
    """Simple greeting endpoint."""
    return http_handlers.hello_world(request)


@functions_framework.http
def health(request: Request):
    """Health check endpoint."""
    return http_handlers.health(request)


@functions_framework.http
def createUser(request: Request):
    """Create a new user (demonstrates full Clean Architecture flow)."""
    return http_handlers.create_user(request)


@functions_framework.http
def getUser(request: Request):
    """Get a user by ID."""
    return http_handlers.get_user(request)


@functions_framework.http
def listUsers(request: Request):
    """List users with pagination."""
    return http_handlers.list_users(request)
