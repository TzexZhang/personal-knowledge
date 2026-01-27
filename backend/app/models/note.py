"""
笔记模型
"""
from sqlalchemy import Column, String, Text, ForeignKey, Boolean, DateTime, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid


class NoteTag(Base):
    """
    笔记标签关联表
    多对多关系中间表
    """
    __tablename__ = "note_tags"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), comment="关联ID")
    note_id = Column(String(36), ForeignKey("notes.id", ondelete="CASCADE"), nullable=False, comment="笔记ID")
    tag_id = Column(String(36), ForeignKey("tags.id", ondelete="CASCADE"), nullable=False, comment="标签ID")

    created_at = Column(DateTime(timezone=True), server_default=func.now(), comment="创建时间")

    def __repr__(self):
        return f"<NoteTag(note_id={self.note_id}, tag_id={self.tag_id})>"


class Note(Base):
    """
    笔记表
    存储用户的知识笔记内容
    """
    __tablename__ = "notes"

    id = Column(String(36), primary_key=True, index=True, default=lambda: str(uuid.uuid4()), comment="笔记ID")
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, comment="用户ID")
    category_id = Column(String(36), ForeignKey("categories.id", ondelete="SET NULL"), nullable=True, comment="分类ID")
    title = Column(String(200), nullable=False, comment="笔记标题")
    content = Column(Text, nullable=True, comment="笔记内容（支持Markdown）")

    is_favorite = Column(Boolean, default=False, comment="是否收藏")
    view_count = Column(Integer, default=0, comment="浏览次数")

    created_at = Column(DateTime(timezone=True), server_default=func.now(), comment="创建时间")
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), comment="更新时间")

    # 关系
    user = relationship("User", back_populates="notes")
    category = relationship("Category", back_populates="notes")
    tags = relationship("Tag", secondary="note_tags", back_populates="notes", viewonly=False)

    def __repr__(self):
        return f"<Note(id={self.id}, title='{self.title}', user_id={self.user_id})>"
