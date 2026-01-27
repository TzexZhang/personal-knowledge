"""
笔记相关的 Pydantic 模型
"""
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional, List, Any


class NoteBase(BaseModel):
    """笔记基础模型"""
    title: str = Field(..., min_length=1, max_length=200, description="笔记标题")
    content: Optional[str] = Field(None, description="笔记内容（Markdown格式）")
    category_id: Optional[int] = Field(None, description="分类ID")
    is_favorite: bool = Field(False, description="是否收藏")


class NoteCreate(NoteBase):
    """笔记创建模型"""
    tag_ids: List[int] = Field(default=[], description="标签ID列表")


class NoteUpdate(BaseModel):
    """笔记更新模型"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = None
    category_id: Optional[int] = None
    is_favorite: Optional[bool] = None
    tag_ids: Optional[List[int]] = None


class TagResponse(BaseModel):
    """标签响应模型"""
    id: int
    name: str

    class Config:
        from_attributes = True


class CategoryResponse(BaseModel):
    """分类响应模型"""
    id: int
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


class NoteResponse(NoteBase):
    """笔记响应模型"""
    id: int
    user_id: int
    view_count: int
    created_at: datetime
    updated_at: datetime

    # 关联数据
    category: Optional[CategoryResponse] = None
    tags: List[TagResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class NoteListResponse(BaseModel):
    """笔记列表响应模型"""
    items: List[NoteResponse]
    total: int
    page: int
    page_size: int


class NoteSearchResponse(BaseModel):
    """笔记搜索响应模型"""
    results: List[NoteResponse]
    total: int
