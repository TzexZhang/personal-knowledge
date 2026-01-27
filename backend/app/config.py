"""
配置文件
读取和管理应用配置
"""
from pydantic_settings import BaseSettings
from typing import List
from functools import lru_cache


class Settings(BaseSettings):
    """应用配置类"""

    # 应用基础配置
    APP_NAME: str = "Personal Knowledge Base"
    APP_ENV: str = "development"
    DEBUG: bool = True
    SECRET_KEY: str = "your-secret-key-change-this"

    # 数据库配置
    DATABASE_URL: str = "mysql+pymysql://root:root@localhost:3306/personal_kb"

    # JWT 配置
    JWT_SECRET_KEY: str = "your-jwt-secret-key-change-this"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS 配置
    CORS_ORIGINS: List[str] = [
        "http://localhost:8096",
        "http://localhost:3000",
        "http://127.0.0.1:8096",
        "http://127.0.0.1:3000",
    ]
    CORS_ALLOW_CREDENTIALS: bool = True

    # 文件上传配置
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE: int = 10485760  # 10MB

    class Config:
        """Pydantic 配置"""
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """
    获取配置单例
    使用 lru_cache 确保只创建一次配置实例
    """
    return Settings()


# 导出配置实例
settings = get_settings()
