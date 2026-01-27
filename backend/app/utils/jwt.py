"""
JWT 工具函数
用于创建和验证 JWT Token
"""
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from app.config import settings


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    创建访问令牌

    Args:
        data: 要编码的数据
        expires_delta: 过期时间增量

    Returns:
        str: JWT Token
    """
    to_encode = data.copy()

    # 设置过期时间
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})

    # 编码 JWT
    print(f"[JWT] Creating token with secret: {settings.JWT_SECRET_KEY[:10]}...", flush=True)
    print(f"[JWT] Algorithm: {settings.JWT_ALGORITHM}", flush=True)
    print(f"[JWT] Data to encode: {to_encode}", flush=True)

    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

    print(f"[JWT] Token created (first 50 chars): {encoded_jwt[:50]}...", flush=True)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """
    解码访问令牌

    Args:
        token: JWT Token

    Returns:
        Optional[dict]: 解码后的数据，失败返回 None
    """
    try:
        print(f"[JWT] Decoding token with secret: {settings.JWT_SECRET_KEY[:10]}...", flush=True)
        print(f"[JWT] Algorithm: {settings.JWT_ALGORITHM}", flush=True)
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        print(f"[JWT] Decode successful: {payload}", flush=True)
        return payload
    except JWTError as e:
        print(f"[JWT] Decode failed: {type(e).__name__}: {e}", flush=True)
        return None
