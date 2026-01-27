# Zeabur 部署方案

基于 GitHub 仓库 + React 前端 + FastAPI 后端 + MySQL 数据库的完整部署方案。

**最后更新：2026-01-27** | 基于 Zeabur 最新文档

## 技术栈

- **前端**：React 18 + Vite 5 + Ant Design + TypeScript
- **后端**：FastAPI + SQLAlchemy + PyMySQL + Python 3.10+
- **数据库**：MySQL 8.0（Zeabur 提供）
- **仓库**：GitHub
- **部署平台**：Zeabur (https://zeabur.com)

## 架构概览

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   前端 (React)  │ ───▶ │  后端 (FastAPI) │ ───▶ │   MySQL 数据库  │
│   静态托管      │      │  Python 服务    │      │  Zeabur MySQL   │
│  GitHub 部署    │      │  GitHub 部署    │      │  内网连接       │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

---

## Zeabur 部署方式概览

Zeabur 提供多种灵活的部署方式，选择最适合你项目的方式：

### 1. 从 Git 部署（推荐）⭐
- **适用场景**：代码托管在 GitHub/GitLab
- **优势**：
  - ✅ 零配置 CI/CD
  - ✅ 自动识别项目类型（Node.js、Python、Docker 等）
  - ✅ 代码推送即自动部署
- **使用方式**：连接 Git 仓库 → 选择分支 → 自动部署

### 2. 从模板部署
- **适用场景**：快速部署开源项目
- **可用模板**：WordPress、n8n、Ghost、Discord Bot 等
- **优势**：
  - ✅ 一键部署，无需代码
  - ✅ 预配置好环境
  - ✅ 适合快速原型

### 3. 从本地项目部署
- **适用场景**：不想使用 Git 仓库
- **优势**：
  - ✅ 直接上传项目文件夹
  - ✅ 无需 Git 操作
- **限制**：无法享受自动 CI/CD

### 4. 从 Docker 镜像部署
- **适用场景**：使用容器化应用
- **支持来源**：Docker Hub、GitHub Container Registry 等
- **优势**：
  - ✅ 环境完全一致
  - ✅ 支持任意语言/框架

### 5. 使用 Zeabur CLI 部署
- **适用场景**：开发者偏好命令行操作
- **优势**：
  - ✅ 一条命令完成部署
  - ✅ 无需离开终端
- **安装**：`npx zeabur@latest deploy`

### 6. 使用 AI 助理部署 🤖
- **适用场景**：不熟悉部署配置的开发者
- **优势**：
  - ✅ 用自然语言描述需求
  - ✅ AI 自动配置环境
- **使用方式**：点击导航栏的 "Agent"

### 7. 使用函数（Serverless）
- **适用场景**：简单脚本、API 端点
- **支持语言**：JavaScript、Python
- **优势**：
  - ✅ 在线编写代码
  - ✅ 即时部署

### 8. 从 IDE 部署
- **适用场景**：使用 Cursor IDE
- **优势**：
  - ✅ 无缝集成开发流程
  - ✅ 直接从编辑器部署

---

## 部署方案选择

### 方案一：前后端分离部署（推荐）

**优势：**
- ✅ 前后端独立部署和扩展
- ✅ 前端静态托管免费
- ✅ 便于团队协作

**架构：**
- 前端：静态网站服务（免费）
- 后端：Python 容器服务
- 数据库：Zeabur MySQL（256MB 免费）

### 方案二：一体化部署

**优势：**
- ✅ 只需一个服务
- ✅ 只需一个域名
- ✅ 无跨域问题

**架构：**
- 前端：构建后由 FastAPI 托管
- 后端：Python 容器服务
- 数据库：Zeabur MySQL

---

## 方案一：前后端分离部署（详细步骤）

### 步骤 1：准备后端配置

#### 1.1 修改 `backend/app/config.py`

确保配置支持 Zeabur 的 MySQL 环境变量：

```python
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
```

#### 1.2 修改 `backend/app/database.py`

确保使用正确的数据库 URL：

```python
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
```

#### 1.3 创建 `backend/main.py`（如果不存在或需要更新）

```python
"""
FastAPI 应用入口
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine
from app.models import Base
from app.routers import auth, categories, tags, notes

# 创建 FastAPI 应用
app = FastAPI(
    title=settings.APP_NAME,
    description="个人知识库 API",
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

# 注册路由
app.include_router(auth.router, prefix="/api/auth", tags=["认证"])
app.include_router(categories.router, prefix="/api/categories", tags=["分类"])
app.include_router(tags.router, prefix="/api/tags", tags=["标签"])
app.include_router(notes.router, prefix="/api/notes", tags=["笔记"])


@app.on_event("startup")
async def startup_event():
    """应用启动时创建数据库表"""
    Base.metadata.create_all(bind=engine)


@app.get("/api/health")
def health_check():
    """健康检查接口"""
    return {"status": "ok", "message": "服务运行正常"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
```

### 步骤 2：准备前端配置

#### 2.1 创建 `frontend/.env.production`

```bash
# API 地址（部署后需要更新为实际的后端 URL）
VITE_API_URL=https://your-backend.zeabur.app
```

#### 2.2 检查 `frontend/vite.config.js`

确保配置正确：

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8096,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // 代码分割优化
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'antd-vendor': ['antd', 'antd-mobile'],
          'editor-vendor': ['@wangeditor/editor', '@wangeditor/editor-for-react']
        }
      }
    }
  }
})
```

### 步骤 3：Zeabur 部署流程

#### 3.1 注册 Zeabur 账号

1. 访问 [Zeabur 官网](https://zeabur.com)
2. 点击右上角 **"登录"** 或 **"Sign Up"**
3. 选择登录方式：
   - **邮箱注册**（推荐新手）：
     - 输入邮箱地址
     - 点击"通过电子邮件继续"
     - 查收邮件，点击"登录"链接
   - **GitHub 登录**（推荐开发者）：
     - 点击"Continue with GitHub"
     - 授权 Zeabur 访问你的 GitHub
   - **Google 登录**：
     - 使用 Google 账号快速登录

4. **账户验证**（首次创建项目时需要）
   - 选择以下任一方式完成验证：
     1. **手机号验证**：支持大部分国家/地区
     2. **预存额度**：预存一定金额（未使用不会扣除）
     3. **绑定信用卡**：仅用于验证，不自动扣费

> **注意**：验证是创建项目的必要步骤，确保服务安全和防止滥用。

#### 3.2 推送代码到 GitHub

确保你的项目已经推送到 GitHub：

```bash
# 在项目根目录
git init
git add .
git commit -m "准备 Zeabur 部署"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

#### 3.3 在 Zeabur 创建项目

1. 登录后进入 **Dashboard**（控制台）
2. 点击左上角 **"Create New Project"** 或页面中央的 **"New Project"**
3. 选择 **Region**（区域）：
   - **Hong Kong, China** - 国内访问快
   - **Singapore** - 东南亚访问快
   - **Tokyo, Japan** - 东亚访问快
   - 其他区域根据你的用户群体选择
4. 点击 **"Create"**，项目会自动创建并生成随机名称
5. 项目创建后自动跳转到项目页面

> **提示**：项目可以重命名，点击项目设置即可修改名称。

#### 3.4 部署 MySQL 数据库

1. 在项目中点击 **"Add Service"**（或按 `/` 键打开命令面板）
2. 选择 **"Marketplace"**（市场）
3. 搜索并选择 **"MySQL"**
4. 选择免费计划（256MB 存储）
5. 点击 **"Deploy"** 开始部署
6. 等待 1-2 分钟，状态变为 **"Running"**

**重要特性：**
- Zeabur 会自动注入 MySQL 连接信息到环境变量
- 自动提供 SSL 加密连接
- 支持自动备份（免费版可能有限制）

#### 3.5 部署后端服务

**方式一：从 GitHub 部署（推荐）**

1. 在项目中点击 **"Add Service"**
2. 选择 **"Git"** → 选择你的 GitHub 仓库
3. 如果首次使用，点击 **"Configure GitHub App"** 授权
4. 选择你的仓库后，配置服务：
   - **Service Name**（服务名称）：`backend`
   - **Root Directory**（根目录）：`backend`
   - **Branch**（分支）：`main`
5. Zeabur 会自动检测到 Python 项目并显示配置
6. 点击 **"Environment Variables"** 添加环境变量：

```bash
# 应用配置
APP_ENV=production
DEBUG=False
SECRET_KEY=你的随机密钥

# JWT 配置
JWT_SECRET_KEY=你的JWT密钥

# 数据库配置（Zeabur 会自动注入以下变量，无需手动设置）
# MYSQLHOST, MYSQLPORT, MYSQLDATABASE, MYSQLUSER, MYSQLPASSWORD
```

7. 连接 MySQL 服务：
   - 点击服务卡片上的 **"Dependencies"**（依赖）
   - 点击 **"Add Dependency"**
   - 选择 MySQL 服务并连接
   - Zeabur 会自动注入 MySQL 环境变量

8. 设置启动命令（如果未自动检测）：
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

9. 点击 **"Deploy"** 开始部署

10. 部署完成后，获取后端 URL（例如：`https://your-backend.zeabur.app`）

**方式二：使用 CLI 部署**

```bash
# 安装 Zeabur CLI
npm install -g @zeabur/cli

# 登录
zeabur login

# 在 backend 目录中部署
cd backend
zeabur deploy

# 按提示选择或创建项目
```

#### 3.6 部署前端服务

1. 点击 **"Add Service"**
2. 选择 **"Git"** → 选择同一 GitHub 仓库
3. 配置服务：
   - **Service Name**（服务名称）：`frontend`
   - **Root Directory**（根目录）：`frontend`
   - **Branch**（分支）：`main`

4. Zeabur 会自动检测到 Vite + React 项目

5. 点击 **"Environment Variables"** 添加：
   ```bash
   VITE_API_URL=https://your-backend.zeabur.app
   ```
   （使用步骤 3.5 获取的实际后端 URL）

6. 点击 **"Deploy"**

7. Zeabur 会自动执行：
   - `npm install` - 安装依赖
   - `npm run build` - 构建前端
   - 将 `dist` 目录部署为静态网站

8. 部署完成后，获取前端 URL

**方式二：使用本地项目部署**

如果不想使用 Git：

1. 点击 **"Add Service"**
2. 选择 **"Local Project"**（本地项目）
3. 拖放 `frontend` 文件夹到上传区域
4. Zeabur 会自动分析并部署

#### 3.7 更新后端 CORS 配置

**方式一：在 Zeabur 控制台配置（推荐）**

1. 进入后端服务页面
2. 点击 **"Environment Variables"**（环境变量）
3. 点击 **"Add Variable"**
4. 添加 CORS 配置：
   - **Name**：`CORS_ORIGINS`
   - **Value**：`https://your-frontend.zeabur.app`
5. 点击 **"Save"**，后端会自动重新部署

**方式二：修改代码并推送**

1. 在本地编辑 `backend/app/config.py`
2. 找到 `CORS_ORIGINS` 列表，添加前端 URL：
   ```python
   CORS_ORIGINS: List[str] = [
       "http://localhost:8096",
       "http://localhost:3000",
       "https://your-frontend.zeabur.app",  # 添加这一行
   ]
   ```
3. 保存并推送到 GitHub：
   ```bash
   git add backend/app/config.py
   git commit -m "配置 CORS：添加前端域名"
   git push origin main
   ```
4. Zeabur 会自动检测到更新并重新部署

---

## 使用 Zeabur AI 助理部署 🤖

Zeabur 提供 AI 助理，可以用自然语言描述需求来部署服务。

### 如何使用 AI 助理

1. 登录 Zeabur Dashboard
2. 点击导航栏的 **"Agent"** 按钮
3. 用自然语言描述你的需求，例如：
   - "帮我部署一个 MySQL 数据库"
   - "从 GitHub 部署我的 Python 后端，目录是 backend"
   - "创建一个前端服务，使用 Vite 和 React"
   - "连接后端到 MySQL 数据库"

4. AI 会自动：
   - 分析你的需求
   - 配置服务参数
   - 创建必要的连接
   - 开始部署

### 优势
- ✅ 无需了解详细配置
- ✅ 适合部署新手
- ✅ 快速完成部署
- ✅ 自动处理复杂依赖

---

## 使用 Zeabur CLI 部署 💻

对于喜欢命令行的开发者，Zeabur 提供了强大的 CLI 工具。

### 安装 CLI

```bash
# 使用 npm 安装
npm install -g @zeabur/cli

# 或使用 npx（无需安装）
npx zeabur@latest deploy
```

### 登录

```bash
zeabur login
# 按提示打开浏览器登录
```

### 部署服务

```bash
# 在项目目录中
zeabur deploy

# 按提示选择或创建项目
# 选择项目类型和配置
```

### 常用命令

```bash
# 查看服务列表
zeabur list

# 查看服务日志
zeabur logs <service-name>

# 查看服务状态
zeabur status

# 打开服务在浏览器中
zeabur open <service-name>
```

### 优势
- ✅ 无需离开终端
- ✅ 快速部署
- ✅ 适合自动化脚本

---

## 方案二：一体化部署（详细步骤）

### 步骤 1：创建项目根目录的 Dockerfile

在项目根目录创建 `Dockerfile`：

```dockerfile
# ============================================
# 前端构建阶段
# ============================================
FROM node:18-alpine AS frontend-builder

WORKDIR /frontend

# 复制前端依赖文件
COPY frontend/package*.json ./

# 安装依赖
RUN npm install

# 复制前端源代码
COPY frontend/ ./

# 构建前端
RUN npm run build


# ============================================
# 后端运行阶段
# ============================================
FROM python:3.10-slim

WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# 复制后端依赖文件
COPY backend/requirements.txt .

# 安装 Python 依赖
RUN pip install --no-cache-dir -r requirements.txt

# 复制后端代码
COPY backend/ ./

# 从前端构建阶段复制静态文件
COPY --from=frontend-builder /frontend/dist ./static

# 暴露端口
EXPOSE 8000

# 启动应用
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 步骤 2：修改后端以支持静态文件服务

修改 `backend/main.py`：

```python
"""
FastAPI 应用入口
"""
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine
from app.models import Base
from app.routers import auth, categories, tags, notes
import os

# 创建 FastAPI 应用
app = FastAPI(
    title=settings.APP_NAME,
    description="个人知识库 API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# 配置 CORS（可选，因为前后端在一起）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境建议限制具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(auth.router, prefix="/api/auth", tags=["认证"])
app.include_router(categories.router, prefix="/api/categories", tags=["分类"])
app.include_router(tags.router, prefix="/api/tags", tags=["标签"])
app.include_router(notes.router, prefix="/api/notes", tags=["笔记"])

# 挂载前端静态文件
static_path = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_path):
    app.mount("/", StaticFiles(directory=static_path, html=True), name="static")


@app.on_event("startup")
async def startup_event():
    """应用启动时创建数据库表"""
    Base.metadata.create_all(bind=engine)


@app.get("/api/health")
def health_check():
    """健康检查接口"""
    return {"status": "ok", "message": "服务运行正常"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
```

### 步骤 3：前端修改 API 地址

修改 `frontend/src/services/api.js`（或你的 API 配置文件）：

```javascript
// 使用相对路径，因为前后端在同一服务
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// 或者
const API_BASE_URL = '/api';  // 生产环境
```

### 步骤 4：Zeabur 部署

1. 按照"方案一"的步骤 3.1-3.3 创建项目和部署 MySQL
2. 部署应用服务：
   - 选择 "Git" → 你的仓库
   - **Root Directory**: `/`（项目根目录）
   - Zeabur 会检测 Dockerfile 并自动构建
3. 配置环境变量（同方案一）
4. 连接 MySQL 服务
5. 部署

---

## 数据库初始化

### 方法 1：自动初始化（推荐）

在 `backend/main.py` 中已经包含了启动时自动创建表的代码：

```python
@app.on_event("startup")
async def startup_event():
    """应用启动时创建数据库表"""
    Base.metadata.create_all(bind=engine)
```

### 方法 2：手动初始化脚本

创建 `backend/init_db.py`：

```python
"""
数据库初始化脚本
"""
from app.database import engine, Base
from app.models import User, Category, Tag, Note


def init_db():
    """初始化数据库表"""
    print("开始创建数据库表...")
    Base.metadata.create_all(bind=engine)
    print("数据库表创建完成！")


if __name__ == "__main__":
    init_db()
```

在 Zeabur 控制台的 "Console" 中运行：

```bash
cd /app && python init_db.py
```

---

## 生成安全密钥

使用以下方法生成随机密钥：

### Python 方法

```python
import secrets
print("SECRET_KEY:", secrets.token_urlsafe(32))
print("JWT_SECRET_KEY:", secrets.token_urlsafe(32))
```

### 在线工具

访问：https://randomkeygen.com/

---

## 环境变量完整清单

### 后端服务环境变量

```bash
# ==================== 应用配置 ====================
APP_ENV=production
DEBUG=False
SECRET_KEY=your-generated-secret-key-here

# ==================== JWT 配置 ====================
JWT_SECRET_KEY=your-generated-jwt-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# ==================== 数据库配置 ====================
# 以下变量由 Zeabur MySQL 服务自动注入，无需手动设置
# MYSQLHOST=internal-mysql-host
# MYSQLPORT=3306
# MYSQLDATABASE=personal_kb
# MYSQLUSER=xxxxxxxx
# MYSQLPASSWORD=xxxxxxxx

# ==================== CORS 配置 ====================
# 如需在控制台设置，使用逗号分隔多个域名
# CORS_ORIGINS=https://your-frontend.zeabur.app,https://your-custom-domain.com
```

### 前端服务环境变量

```bash
# ==================== API 配置 ====================
VITE_API_URL=https://your-backend.zeabur.app
```

---

## 自定义域名配置（可选）

### 绑定自定义域名

1. 在 Zeabur 项目中
2. 选择服务（前端/后端）
3. 点击 "Networking" → "Custom Domain"
4. 添加你的域名
5. 配置 DNS 记录

### DNS 配置示例

假设你有域名 `example.com`：

```
# 前端
CNAME    www         your-frontend.zeabur.app
CNAME    @           your-frontend.zeabur.app

# 后端（如果分离部署）
CNAME    api         your-backend.zeabur.app
```

或使用 A 记录（如果 Zeabur 提供 IP）：

```
A        @           your-ip-address
A        www         your-ip-address
A        api         your-ip-address
```

配置后更新环境变量：
- `VITE_API_URL=https://api.example.com`
- `CORS_ORIGINS=https://www.example.com,https://example.com`

---

## 成本估算

### Zeabur 免费额度

| 服务 | 免费额度 | 说明 |
|------|---------|------|
| **MySQL** | 256MB 存储 | 适合小型个人项目 |
| **容器服务** | $5/月额度 | 约 512MB-1GB RAM |
| **静态托管** | 完全免费 | 无限带宽 |

### 实际成本估算

**个人项目（免费）**
- 前端：$0（静态托管）
- 后端：$0（在 $5 免费额度内）
- 数据库：$0（256MB MySQL）
- **总计：$0/月**

**小型生产项目**
- 前端：$0
- 后端：约 $3-5/月（超出免费额度）
- 数据库：$0（在免费额度内）
- **总计：$3-5/月**

---

## 监控和日志

### Zeabur 控制台功能

1. **实时日志**
   - 点击服务 → "Logs"
   - 查看实时输出日志

2. **资源监控**
   - CPU、内存、网络使用情况
   - 请求响应时间

3. **告警设置**
   - 配置 CPU/内存使用率告警
   - 服务异常通知

### 本地查看远程日志

```bash
# 安装 Zeabur CLI
npm install -g @zeabur/cli

# 登录
zeabur login

# 查看日志
zeabur logs backend
```

---

## 备份和恢复

### 自动备份

Zeabur MySQL 提供自动备份功能（免费版可能有限制）：
1. 进入 MySQL 服务设置
2. 启用自动备份
3. 设置备份保留时间

### 手动备份

在 Zeabur 控制台的 "Console" 中：

```bash
# 导出数据库
mysqldump -h $MYSQLHOST -P $MYSQLPORT -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE > backup.sql

# 或使用 Python
python -c "
from app.config import settings
import subprocess
import os
cmd = f'mysqldump -h {settings.MYSQL_HOST} -P {settings.MYSQL_PORT} -u {settings.MYSQL_USER} -p{settings.MYSQL_PASSWORD} {settings.MYSQL_DB} > backup.sql'
subprocess.run(cmd, shell=True)
"
```

### 恢复备份

```bash
mysql -h $MYSQLHOST -P $MYSQLPORT -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE < backup.sql
```

---

## 故障排查

### 常见问题及解决方案

#### 1. 数据库连接失败

**症状：**
```
sqlalchemy.exc.OperationalError: (pymysql.err.OperationalError) (2003, "Can't connect to MySQL server")
```

**解决方案：**
1. 确认后端服务已连接到 MySQL 服务（Dependencies）
2. 检查环境变量是否正确注入
3. 在 Console 中测试连接：
   ```bash
   python -c "from app.config import settings; print(settings.database_url)"
   ```

#### 2. CORS 错误

**症状：**
```
Access to XMLHttpRequest at 'https://your-backend.zeabur.app' from origin 'https://your-frontend.zeabur.app' has been blocked by CORS policy
```

**解决方案：**
1. 将前端 URL 添加到 `CORS_ORIGINS`
2. 确认前端 `VITE_API_URL` 正确
3. 重新部署后端服务

#### 3. 静态文件 404

**症状：**
前端页面空白，控制台显示资源 404

**解决方案：**
1. 确认前端已正确构建
2. 检查 `dist` 目录是否存在
3. 清除缓存重新部署

#### 4. 依赖安装失败

**症状：**
```
ERROR: Could not build wheels for pymysql
```

**解决方案：**
1. 确保 `requirements.txt` 正确
2. 检查 Python 版本（需要 3.10+）
3. 添加系统依赖到 Dockerfile

#### 5. 端口冲突

**症状：**
服务启动失败

**解决方案：**
1. 确认使用 `0.0.0.0:8000`
2. 不要绑定 `localhost` 或 `127.0.0.1`

---

## 安全建议

### 1. 密钥管理

- ✅ 使用环境变量存储密钥
- ❌ 不要将密钥提交到 Git
- 🔄 定期轮换密钥
- 📝 使用密钥管理工具（如 1Password）

### 2. 数据库安全

- 🔒 使用强密码（Zeabur 自动生成）
- 🔐 启用 SSL 连接（Zeabur 自动配置）
- 💾 定期备份数据
- 🚫 不要暴露数据库端口到公网

### 3. API 安全

- 🔑 启用 JWT 认证
- ⏱️ 实施 rate limiting
- ✔️ 验证所有用户输入
- 🛡️ 使用 HTTPS（Zeabur 自动提供）

### 4. 依赖安全

```bash
# 检查 Python 依赖漏洞
pip install pip-audit
pip-audit

# 检查 JavaScript 依赖
npm audit
```

---

## 性能优化

### 后端优化

1. **数据库连接池**
   - 已在 `database.py` 中配置
   - 根据负载调整 `pool_size`

2. **启用缓存**
   ```python
   from fastapi_cache2 import FastAPICache
   from fastapi_cache2.backends.redis import RedisBackend

   @app.get("/api/notes")
   @cache(expire=60)  # 缓存 60 秒
   async def get_notes():
       ...
   ```

3. **异步处理**
   - 将数据库查询改为异步
   - 使用 `asyncpg` 或 `aiomysql`

### 前端优化

1. **代码分割**：已在 `vite.config.js` 中配置
2. **图片优化**：使用 WebP 格式
3. **CDN**：Zeabur 自动提供 CDN 加速

---

## 部署检查清单

### 部署前

- [ ] 代码已推送到 GitHub
- [ ] `.gitignore` 已正确配置（排除敏感文件）
- [ ] 生成了安全密钥
- [ ] 测试了本地构建

### 部署中

- [ ] 创建了 Zeabur 项目
- [ ] 部署了 MySQL 服务
- [ ] 配置了后端环境变量
- [ ] 连接了后端到 MySQL
- [ ] 部署了后端服务
- [ ] 配置了前端环境变量
- [ ] 部署了前端服务
- [ ] 更新了 CORS 配置

### 部署后

- [ ] 测试了后端健康检查（`/api/health`）
- [ ] 测试了前端访问
- [ ] 测试了 API 调用
- [ ] 测试了用户登录
- [ ] 测试了数据库操作
- [ ] 配置了自定义域名（可选）
- [ ] 设置了监控和告警
- [ ] 配置了自动备份

---

## 快速部署命令（总结）

```bash
# 1. 推送代码到 GitHub
git add .
git commit -m "Zeabur 部署准备"
git push origin main

# 2. 在 Zeabur 控制台执行：
#    - 创建项目
#    - 部署 MySQL（Marketplace）
#    - 部署后端（Git, root: backend）
#    - 连接后端到 MySQL
#    - 部署前端（Git, root: frontend）

# 3. 生成密钥
python -c "import secrets; print('SECRET_KEY:', secrets.token_urlsafe(32)); print('JWT_SECRET_KEY:', secrets.token_urlsafe(32))"

# 4. 配置环境变量（在 Zeabur 控制台）
#    后端：SECRET_KEY, JWT_SECRET_KEY
#    前端：VITE_API_URL

# 5. 测试部署
curl https://your-backend.zeabur.app/api/health
```

---

## 参考资料

- [Zeabur 官方文档](https://zeabur.com/docs)
- [Zeabur MySQL 部署指南](https://zeabur.com/docs/marketplace/mysql)
- [Zeabur 从 Git 部署](https://zeabur.com/docs/deploy/git-deployment)
- [FastAPI 生产部署](https://fastapi.tiangolo.com/deployment/)
- [Vite 生产构建](https://vitejs.dev/guide/build.html)
- [PyMySQL 文档](https://pymysql.readthedocs.io/)

---

## 支持

遇到问题？

1. 查看 [Zeabur 常见问题](https://zeabur.com/docs/faq)
2. 加入 [Zeabur Discord](https://discord.gg/zeabur)
3. 提交 [GitHub Issue](https://github.com/zeabur/zeabur/issues)
