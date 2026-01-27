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


@app.on_event("startup")
async def startup_event():
    """
    应用启动事件
    创建数据库表
    """
    try:
        logger.info(f"正在初始化数据库: {settings.MYSQL_HOST}:{settings.MYSQL_PORT}/{settings.MYSQL_DB}")

        # 创建所有表（如果表已存在则跳过）
        Base.metadata.create_all(bind=engine)
        logger.info("✅ 数据库表创建成功")

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