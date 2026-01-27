"""
依赖注入函数
用于在路由中获取当前用户
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import JWTError

from app.database import get_db
from app.models import User
from app.utils import decode_access_token

# HTTP Bearer 安全方案
security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    获取当前登录用户

    Args:
        credentials: HTTP Bearer Token
        db: 数据库会话

    Returns:
        User: 当前用户对象

    Raises:
        HTTPException: 认证失败时抛出 401 错误
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="无法验证凭据",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # 验证 Token
        token = credentials.credentials
        print(f"[DEBUG] Token received: {token[:50] if len(token) > 50 else token}...", flush=True)

        payload = decode_access_token(token)
        if payload is None:
            print(f"[DEBUG] Token decode failed", flush=True)
            raise credentials_exception

        print(f"[DEBUG] Payload: {payload}", flush=True)

        user_id_str = payload.get("sub")
        if user_id_str is None:
            print(f"[DEBUG] No sub in payload", flush=True)
            raise credentials_exception

        print(f"[DEBUG] user_id from payload: {user_id_str} (type: {type(user_id_str).__name__})", flush=True)

        # user_id 现在就是 string 类型，直接使用
        user_id = user_id_str
        print(f"[DEBUG] user_id: {user_id}", flush=True)

        # 查询用户
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            print(f"[DEBUG] User not found in database for id={user_id}", flush=True)
            raise credentials_exception

        print(f"[DEBUG] User found: {user.username}", flush=True)
        return user

    except Exception as e:
        print(f"[DEBUG] Exception in get_current_user: {type(e).__name__}: {e}", flush=True)
        raise credentials_exception
