"""
数据库配置和会话管理
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

# 创建数据库引擎
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,  # 检查连接是否有效
    pool_recycle=3600,    # 1小时后回收连接
    echo=settings.DEBUG    # 开发环境下打印SQL
)

# 创建会话工厂
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 创建基类
Base = declarative_base()


def get_db():
    """
    获取数据库会话
    用于依赖注入，每次请求创建新的会话
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
