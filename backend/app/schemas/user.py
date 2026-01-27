"""
用户相关的 Pydantic 模型
用于请求验证和响应序列化
"""
from pydantic import BaseModel, EmailStr, Field, computed_field
from datetime import datetime
from typing import Optional
import os


class UserBase(BaseModel):
    """用户基础模型"""
    username: str = Field(..., min_length=3, max_length=50, description="用户名")
    email: EmailStr = Field(..., description="邮箱地址")


class UserCreate(UserBase):
    """用户创建模型"""
    password: str = Field(..., min_length=6, max_length=100, description="密码")


class UserUpdate(BaseModel):
    """用户更新模型"""
    email: Optional[EmailStr] = None
    avatar: Optional[str] = None
    theme_preference: Optional[str] = Field(None, pattern="^(light|dark)$", description="主题偏好")
    primary_color: Optional[str] = Field(None, pattern="^#[0-9A-Fa-f]{6}$", description="主色调")


class UserResponse(UserBase):
    """用户响应模型"""
    id: int
    avatar: Optional[str] = None
    theme_preference: str
    primary_color: str
    created_at: datetime
    updated_at: datetime

    @computed_field
    @property
    def avatar_url(self) -> Optional[str]:
        """返回完整的头像URL"""
        if self.avatar:
            # 如果已经是完整URL，直接返回
            if self.avatar.startswith('http://') or self.avatar.startswith('https://'):
                return self.avatar
            # 否则，假设是相对路径，拼接基础URL
            # 注意：这里返回相对路径，由前端根据环境拼接完整URL
            return self.avatar
        return None

    class Config:
        from_attributes = True  # 支持从 ORM 对象创建


class UserLogin(BaseModel):
    """用户登录模型"""
    username: str = Field(..., description="用户名")
    password: str = Field(..., description="密码")


class Token(BaseModel):
    """Token 响应模型"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int
