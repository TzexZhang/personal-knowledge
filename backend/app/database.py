"""
数据库配置
创建数据库连接和会话管理
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

# 创建数据库引擎
engine = create_engine(
    settings.database_url,
    echo=settings.DEBUG,
    pool_pre_ping=True,  # 检查连接有效性
    pool_size=5,
    max_overflow=10,
    pool_recycle=3600,  # MySQL 连接回收时间
)

# 创建会话工厂
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 创建基类
Base = declarative_base()


def get_db():
    """
    数据库会话依赖
    用于 FastAPI 依赖注入
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()