"""
配置文件
读取和管理应用配置
"""
from pydantic_settings import BaseSettings
from typing import List, Optional
from functools import lru_cache
import os


class Settings(BaseSettings):
    """应用配置类"""

    # 应用基础配置
    APP_NAME: str = "Personal Knowledge Base"
    APP_ENV: str = os.getenv("APP_ENV", "production")
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-this")

    # 数据库配置
    # Zeabur MySQL 会自动注入 MYSQLHOST、MYSQLPORT、MYSQLDATABASE、MYSQLUSER、MYSQLPASSWORD 等环境变量
    MYSQL_HOST: Optional[str] = os.getenv("MYSQLHOST", "localhost")
    MYSQL_PORT: Optional[int] = int(os.getenv("MYSQLPORT", "3306"))
    MYSQL_USER: Optional[str] = os.getenv("MYSQLUSER", "root")
    MYSQL_PASSWORD: Optional[str] = os.getenv("MYSQLPASSWORD", "root")
    MYSQL_DB: Optional[str] = os.getenv("MYSQLDATABASE", "personal_kb")

    @property
    def database_url(self) -> str:
        """构建 MySQL 数据库连接 URL"""
        return (
            f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}"
            f"@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DB}"
            f"?charset=utf8mb4"
        )

    # JWT 配置
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "your-jwt-secret-key-change-this")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS 配置（需要在部署后添加 Zeabur 前端域名）
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
    """获取配置单例"""
    return Settings()


# 导出配置实例
settings = get_settings()
