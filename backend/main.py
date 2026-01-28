"""
FastAPI 应用主文件
应用初始化和路由注册
"""
import sys
from pathlib import Path
import logging

# 添加项目根目录到 Python 路径
sys.path.insert(0, str(Path(__file__).parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.routers import auth, categories, tags, notes
from app.database import engine, Base, get_db

# 导入所有模型（必须导入才能让 SQLAlchemy 创建表）
from app.models import User, Category, Tag, Note, NoteTag

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 创建 FastAPI 应用实例
app = FastAPI(
    title=settings.APP_NAME,
    description="个人知识库管理系统 API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 挂载静态文件目录
uploads_path = Path("uploads")
uploads_path.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_path), name="uploads")

# 注册路由
app.include_router(auth.router, prefix="/api/auth", tags=["认证"])
app.include_router(categories.router, prefix="/api/categories", tags=["分类"])
app.include_router(tags.router, prefix="/api/tags", tags=["标签"])
app.include_router(notes.router, prefix="/api/notes", tags=["笔记"])


def check_and_rebuild_database():
    """
    检查数据库是否使用旧的 Integer ID schema
    如果是，自动重建数据库（会丢失所有数据）
    """
    from sqlalchemy import text, inspect
    import uuid

    try:
        inspector = inspect(engine)

        if 'users' not in inspector.get_table_names():
            logger.info("数据库不存在，将创建新表")
            return

        # 检查 users.id 的类型
        users_columns = inspector.get_columns('users')
        id_column = next((col for col in users_columns if col['name'] == 'id'), None)

        if not id_column:
            return

        # 检查是否为 Integer 类型
        is_integer_id = 'INT' in str(id_column['type']).upper()

        if not is_integer_id:
            logger.info("✅ 数据库已使用 UUID String 类型")
            return

        # ⚠️ 检测到旧的 Integer ID schema，需要重建
        logger.warning("⚠️  检测到数据库使用旧的 Integer ID schema")
        logger.warning("⚠️  需要重建数据库以支持 UUID ID（会删除所有数据）")

        # 从环境变量读取是否允许自动重建
        import os
        auto_rebuild = os.getenv('AUTO_REBUILD_DATABASE', 'false').lower() == 'true'

        if not auto_rebuild:
            logger.error("❌ 自动重建已禁用")
            logger.error("请设置环境变量 AUTO_REBUILD_DATABASE=true 以自动重建")
            logger.error("或者手动执行以下 SQL:")
            logger.error("  DROP TABLE IF EXISTS note_tags, notes, tags, categories, users;")
            raise Exception("数据库 schema 不匹配：需要将 Integer ID 迁移到 UUID String")

        logger.info("🔄 开始自动重建数据库...")

        with engine.connect() as conn:
            # 删除所有表（按依赖顺序）
            logger.info("删除旧表...")
            conn.execute(text("DROP TABLE IF EXISTS note_tags"))
            conn.execute(text("DROP TABLE IF EXISTS notes"))
            conn.execute(text("DROP TABLE IF EXISTS tags"))
            conn.execute(text("DROP TABLE IF EXISTS categories"))
            conn.execute(text("DROP TABLE IF EXISTS users"))
            conn.commit()

        logger.info("✅ 旧表已删除，将创建新表")

    except Exception as e:
        logger.error(f"数据库检查失败: {str(e)}")
        import os
        auto_rebuild = os.getenv('AUTO_REBUILD_DATABASE', 'false').lower() == 'true'
        if not auto_rebuild:
            raise
        logger.warning("继续启动...")


def migrate_database():
    """
    自动迁移数据库：添加缺失的字段
    """
    from sqlalchemy import text, inspect

    try:
        inspector = inspect(engine)

        # 检查并迁移 categories 表
        if 'categories' in inspector.get_table_names():
            columns = [col['name'] for col in inspector.get_columns('categories')]

            with engine.connect() as conn:
                # 添加 color 字段
                if 'color' not in columns:
                    logger.info("迁移: 为 categories 表添加 color 字段...")
                    conn.execute(text(
                        "ALTER TABLE categories "
                        "ADD COLUMN color VARCHAR(20) NULL COMMENT '分类颜色' AFTER description"
                    ))
                    conn.commit()
                    logger.info("✅ categories.color 字段添加成功")

                # 添加 sort_order 字段
                if 'sort_order' not in columns:
                    logger.info("迁移: 为 categories 表添加 sort_order 字段...")
                    conn.execute(text(
                        "ALTER TABLE categories "
                        "ADD COLUMN sort_order INT DEFAULT 0 COMMENT '排序顺序' AFTER color"
                    ))
                    conn.commit()
                    logger.info("✅ categories.sort_order 字段添加成功")

        # 检查并迁移 tags 表
        if 'tags' in inspector.get_table_names():
            columns = [col['name'] for col in inspector.get_columns('tags')]

            with engine.connect() as conn:
                # 添加 color 字段
                if 'color' not in columns:
                    logger.info("迁移: 为 tags 表添加 color 字段...")
                    conn.execute(text(
                        "ALTER TABLE tags "
                        "ADD COLUMN color VARCHAR(20) NULL COMMENT '标签颜色' AFTER name"
                    ))
                    conn.commit()
                    logger.info("✅ tags.color 字段添加成功")

    except Exception as e:
        logger.warning(f"数据库迁移警告: {str(e)}")
        # 不中断启动，继续执行


@app.on_event("startup")
async def startup_event():
    """
    应用启动事件
    创建数据库表
    """
    try:
        logger.info(f"正在初始化数据库: {settings.MYSQL_HOST}:{settings.MYSQL_PORT}/{settings.MYSQL_DB}")

        # 检查数据库 schema，自动重建如果不匹配
        check_and_rebuild_database()

        # 创建所有表（如果表已存在则跳过）
        Base.metadata.create_all(bind=engine)
        logger.info("✅ 数据库表创建成功")

        # 自动迁移数据库（添加缺失的字段）
        migrate_database()

        # 测试数据库连接
        with engine.connect() as connection:
            logger.info("✅ 数据库连接成功")

    except Exception as e:
        logger.error(f"❌ 数据库初始化失败: {str(e)}")
        logger.error(f"数据库配置: {settings.database_url}")
        # 不抛出异常，允许应用启动
        # 这样可以让应用启动，等待数据库就绪


@app.get("/")
def root():
    """
    根路径 - 用于健康检查
    """
    return {
        "message": "欢迎使用个人知识库管理系统 API",
        "version": "1.0.0",
        "docs": "/api/docs",
        "redoc": "/api/redoc"
    }


@app.get("/health")
def health_check():
    """
    健康检查接口
    用于容器编排系统的健康检查
    """
    try:
        # 尝试连接数据库
        with engine.connect() as connection:
            return {"status": "healthy", "database": "connected"}
    except Exception as e:
        logger.warning(f"数据库连接检查失败: {str(e)}")
        return {"status": "degraded", "database": "disconnected", "error": str(e)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )