"""In-memory data store for users."""

from models import User

# In-memory stores
_users_by_token: dict[str, User] = {}
_users_by_email: dict[str, User] = {}


def save_user(user: User) -> None:
    _users_by_token[user.token] = user
    _users_by_email[user.email] = user


def get_user_by_token(token: str) -> User | None:
    return _users_by_token.get(token)


def get_user_by_email(email: str) -> User | None:
    return _users_by_email.get(email)
