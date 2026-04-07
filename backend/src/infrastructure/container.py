"""Simple dependency injection container.

Uses lazy-initialized properties instead of an external DI library.
Singletons (db, repositories, services) are cached on first access.
Use cases return new instances each call (factory pattern).
"""

from src.application.use_cases.auth_use_cases import LoginUseCase, RefreshTokenUseCase
from src.application.use_cases.user_use_cases import (
    CreateUserUseCase,
    DeleteUserUseCase,
    GetUserUseCase,
    ListUsersUseCase,
    UpdateUserUseCase,
)
from src.domain.services import AuthenticationService
from src.infrastructure.database import get_firestore
from src.infrastructure.repositories import UserRepository


class Container:
    """Application dependency injection container.

    Provides lazy-initialized instances of repositories, services,
    and use cases. The Firestore client is created once and shared.

    Usage:
        container = Container()
        use_case = container.create_user_use_case()
        result = await use_case.execute(dto)
    """

    def __init__(self) -> None:
        self._db = None
        self._user_repository: UserRepository | None = None
        self._auth_service: AuthenticationService | None = None

    # ---- Singletons (cached) ------------------------------------------------

    @property
    def db(self):
        """Firestore client (singleton)."""
        if self._db is None:
            self._db = get_firestore()
        return self._db

    @property
    def user_repository(self) -> UserRepository:
        """User repository (singleton)."""
        if self._user_repository is None:
            self._user_repository = UserRepository(db=self.db)
        return self._user_repository

    @property
    def auth_service(self) -> AuthenticationService:
        """Authentication service (singleton)."""
        if self._auth_service is None:
            self._auth_service = AuthenticationService(
                user_repository=self.user_repository
            )
        return self._auth_service

    # ---- Use Case Factories (new instance per call) --------------------------

    def create_user_use_case(self) -> CreateUserUseCase:
        return CreateUserUseCase(user_repository=self.user_repository)

    def get_user_use_case(self) -> GetUserUseCase:
        return GetUserUseCase(user_repository=self.user_repository)

    def update_user_use_case(self) -> UpdateUserUseCase:
        return UpdateUserUseCase(user_repository=self.user_repository)

    def list_users_use_case(self) -> ListUsersUseCase:
        return ListUsersUseCase(user_repository=self.user_repository)

    def delete_user_use_case(self) -> DeleteUserUseCase:
        return DeleteUserUseCase(user_repository=self.user_repository)

    def login_use_case(self) -> LoginUseCase:
        return LoginUseCase(auth_service=self.auth_service)

    def refresh_token_use_case(self) -> RefreshTokenUseCase:
        return RefreshTokenUseCase()
