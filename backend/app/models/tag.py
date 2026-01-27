"""
标签模型
"""
from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid


class Tag(Base):
    """
    标签表
    用于笔记的标签化管理
    """
    __tablename__ = "tags"

    id = Column(String(36), primary_key=True, index=True, default=lambda: str(uuid.uuid4()), comment="标签ID")
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, comment="用户ID")
    name = Column(String(50), nullable=False, comment="标签名称")
    color = Column(String(20), nullable=True, comment="标签颜色")

    created_at = Column(DateTime(timezone=True), server_default=func.now(), comment="创建时间")

    # 关系
    user = relationship("User", back_populates="tags")
    notes = relationship("Note", secondary="note_tags", back_populates="tags", viewonly=False)

    def __repr__(self):
        return f"<Tag(id={self.id}, name='{self.name}', user_id={self.user_id})>"
