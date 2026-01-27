"""
分类相关的 Pydantic 模型
"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class CategoryBase(BaseModel):
    """分类基础模型"""
    name: str = Field(..., min_length=1, max_length=100, description="分类名称")
    description: Optional[str] = Field(None, description="分类描述")
    parent_id: Optional[str] = Field(None, description="父分类ID")
    color: Optional[str] = Field(None, pattern="^#[0-9A-Fa-f]{6}$", description="分类颜色")
    sort_order: int = Field(0, description="排序顺序")


class CategoryCreate(CategoryBase):
    """分类创建模型"""
    pass


class CategoryUpdate(BaseModel):
    """分类更新模型"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    parent_id: Optional[str] = None
    color: Optional[str] = Field(None, pattern="^#[0-9A-Fa-f]{6}$")
    sort_order: Optional[int] = None


class CategoryResponse(CategoryBase):
    """分类响应模型"""
    id: str
    user_id: str
    created_at: datetime

    model_config = {"from_attributes": True}
