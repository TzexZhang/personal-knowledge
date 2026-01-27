"""
数据库配置
创建数据库连接和会话管理
"""
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings
import logging

logger = logging.getLogger(__name__)


def create_database_if_not_exists():
    """
    如果数据库不存在则创建数据库
    """
    # 构建不包含数据库名的连接 URL
    base_url = (
        f"mysql+pymysql://{settings.MYSQL_USER}:{settings.MYSQL_PASSWORD}"
        f"@{settings.MYSQL_HOST}:{settings.MYSQL_PORT}"
        f"?charset=utf8mb4"
    )

    try:
        # 连接到 MySQL 服务器（不指定数据库）
        engine_base = create_engine(base_url, echo=settings.DEBUG, pool_pre_ping=True)

        with engine_base.connect() as conn:
            # 检查数据库是否存在
            result = conn.execute(text(f"SHOW DATABASES LIKE '{settings.MYSQL_DB}'"))
            if not result.fetchone():
                # 数据库不存在，创建数据库
                logger.info(f"数据库 '{settings.MYSQL_DB}' 不存在，正在创建...")
                conn.execute(text(f"CREATE DATABASE {settings.MYSQL_DB} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"))
                conn.commit()
                logger.info(f"✅ 数据库 '{settings.MYSQL_DB}' 创建成功")
            else:
                logger.info(f"✅ 数据库 '{settings.MYSQL_DB}' 已存在")

        engine_base.dispose()
    except Exception as e:
        logger.error(f"❌ 创建数据库失败: {e}")
        raise


# 在创建引擎前先确保数据库存在
create_database_if_not_exists()

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