"""
分类模型
"""
from sqlalchemy import Column, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid


class Category(Base):
    """
    分类表
    支持树形结构的分类组织
    """
    __tablename__ = "categories"

    id = Column(String(36), primary_key=True, index=True, default=lambda: str(uuid.uuid4()), comment="分类ID")
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, comment="用户ID")
    name = Column(String(100), nullable=False, comment="分类名称")
    description = Column(Text, nullable=True, comment="分类描述")
    parent_id = Column(String(36), ForeignKey("categories.id", ondelete="SET NULL"), nullable=True, comment="父分类ID")
    color = Column(String(20), nullable=True, comment="分类颜色")
    sort_order = Column(Integer, default=0, comment="排序顺序")

    created_at = Column(DateTime(timezone=True), server_default=func.now(), comment="创建时间")

    # 关系
    user = relationship("User", back_populates="categories")
    parent = relationship("Category", remote_side=[id], back_populates="children")
    children = relationship("Category", back_populates="parent", cascade="all, delete-orphan")
    notes = relationship("Note", back_populates="category", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Category(id={self.id}, name='{self.name}', user_id={self.user_id})>"
