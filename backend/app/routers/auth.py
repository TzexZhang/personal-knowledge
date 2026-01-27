"""
认证相关路由
用户注册、登录、登出、个人信息管理
"""
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models import User
from app.schemas.user import UserCreate, UserUpdate, UserResponse, UserLogin, Token
from app.utils import get_password_hash, verify_password, create_access_token
from app.dependencies import get_current_user
from app.config import settings
import os

router = APIRouter(prefix="/auth", tags=["认证"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """
    用户注册

    Args:
        user: 用户创建数据
        db: 数据库会话

    Returns:
        UserResponse: 创建成功的用户信息

    Raises:
        HTTPException: 用户名或邮箱已存在
    """
    # 检查用户名是否已存在
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="用户名已存在"
        )

    # 检查邮箱是否已存在
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="邮箱已被注册"
        )

    # 创建新用户
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


@router.post("/login", response_model=Token)
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """
    用户登录

    Args:
        user_credentials: 登录凭据
        db: 数据库会话

    Returns:
        Token: JWT Token

    Raises:
        HTTPException: 用户名或密码错误
    """
    # 查找用户
    user = db.query(User).filter(User.username == user_credentials.username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 验证密码
    if not verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 创建访问令牌
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "username": user.username},  # 将user.id转换为字符串
        expires_delta=access_token_expires
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


@router.get("/profile", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    """
    获取个人信息

    Args:
        current_user: 当前登录用户

    Returns:
        UserResponse: 用户信息
    """
    return current_user


@router.put("/profile", response_model=UserResponse)
def update_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    更新个人信息

    Args:
        user_update: 更新数据
        current_user: 当前登录用户
        db: 数据库会话

    Returns:
        UserResponse: 更新后的用户信息
    """
    # 更新字段
    if user_update.email is not None:
        current_user.email = user_update.email
    if user_update.avatar is not None:
        current_user.avatar = user_update.avatar
    if user_update.theme_preference is not None:
        current_user.theme_preference = user_update.theme_preference
    if user_update.primary_color is not None:
        current_user.primary_color = user_update.primary_color

    db.commit()
    db.refresh(current_user)

    return current_user


@router.post("/logout")
def logout():
    """
    用户登出

    由于使用 JWT 无状态认证，登出主要由前端处理（删除 Token）
    此接口主要用于记录登出日志等操作
    """
    return {"message": "登出成功"}


@router.post("/change-password")
def change_password(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    修改密码

    Args:
        data: 包含 old_password 和 new_password 的字典
        current_user: 当前登录用户
        db: 数据库会话

    Returns:
        dict: 成功消息

    Raises:
        HTTPException: 原密码错误
    """
    old_password = data.get("old_password")
    new_password = data.get("new_password")

    if not old_password or not new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="请提供原密码和新密码"
        )

    # 验证原密码
    if not verify_password(old_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="原密码错误"
        )

    # 更新密码
    if len(new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="新密码长度至少6个字符"
        )

    current_user.password_hash = get_password_hash(new_password)
    db.commit()
    db.refresh(current_user)

    return {"message": "密码修改成功"}


@router.post("/upload-avatar")
async def upload_avatar(
    file: UploadFile = File(..., description="头像文件"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    上传头像

    Args:
        file: 上传的文件
        current_user: 当前登录用户
        db: 数据库会话

    Returns:
        dict: 包含头像URL的响应

    Raises:
        HTTPException: 文件类型或大小错误
    """
    # 验证文件类型
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="只支持图片文件"
        )

    # 验证文件大小（2MB限制）
    file_content = await file.read()
    if len(file_content) > 2 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="图片大小不能超过2MB"
        )

    # TODO: 实际项目中应该将文件上传到对象存储服务（如阿里云OSS、AWS S3等）
    # 这里简化处理，返回一个假URL
    # 实际使用时需要：
    # 1. 将文件保存到服务器本地或云存储
    # 2. 返回可访问的URL

    # 简化方案：保存到本地uploads目录
    uploads_dir = "uploads/avatars"
    os.makedirs(uploads_dir, exist_ok=True)

    # 生成唯一文件名
    file_extension = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    unique_filename = f"avatar_{current_user.id}_{int(current_user.updated_at.timestamp())}.{file_extension}"
    file_path = os.path.join(uploads_dir, unique_filename)

    # 保存文件
    with open(file_path, "wb") as f:
        f.write(file_content)

    # 返回访问URL
    avatar_url = f"/uploads/avatars/{unique_filename}"

    # 更新用户头像
    current_user.avatar = avatar_url
    db.commit()
    db.refresh(current_user)

    return {
        "avatar_url": avatar_url,
        "message": "头像上传成功"
    }
