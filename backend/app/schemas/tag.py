"""
标签相关的 Pydantic 模型
"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class TagBase(BaseModel):
    """标签基础模型"""
    name: str = Field(..., min_length=1, max_length=50, description="标签名称")
    color: Optional[str] = Field(None, pattern="^#[0-9A-Fa-f]{6}$", description="标签颜色")


class TagCreate(TagBase):
    """标签创建模型"""
    pass


class TagUpdate(BaseModel):
    """标签更新模型"""
    name: Optional[str] = Field(None, min_length=1, max_length=50)
    color: Optional[str] = Field(None, pattern="^#[0-9A-Fa-f]{6}$")


class TagResponse(TagBase):
    """标签响应模型"""
    id: str
    user_id: str
    created_at: datetime

    model_config = {"from_attributes": True}
