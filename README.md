# 个人知识库管理系统

基于 React + FastAPI + MySQL 的全栈个人知识库应用，支持明暗主题切换和移动端适配。

## 技术栈

### 前端

- **React 18** - 用户界面框架
- **Vite 5** - 前端构建工具
- **Ant Design 5.x** - UI 组件库
- **Ant Design Mobile 5.x** - 移动端组件
- **React Router v6** - 路由管理
- **Axios** - HTTP 客户端
- **dayjs** - 日期处理

### 后端

- **FastAPI 0.104** - Web 框架
- **SQLAlchemy 2.0** - ORM
- **PyMySQL** - MySQL 驱动
- **python-jose** - JWT 认证
- **passlib** - 密码加密
- **pydantic** - 数据验证

### 数据库

- **MySQL 8.0** - 关系型数据库

## 项目结构

```
personal-project/
├── backend/                 # 后端项目
│   ├── app/
│   │   ├── models/         # 数据库模型
│   │   │   ├── user.py     # 用户模型
│   │   │   ├── category.py # 分类模型
│   │   │   ├── tag.py      # 标签模型
│   │   │   └── note.py     # 笔记模型
│   │   ├── schemas/        # Pydantic 数据模型
│   │   ├── routers/        # API 路由
│   │   │   ├── auth.py     # 认证接口
│   │   │   ├── categories.py
│   │   │   ├── tags.py
│   │   │   └── notes.py
│   │   ├── utils/          # 工具函数
│   │   │   ├── jwt.py      # JWT 生成和验证
│   │   │   └── security.py # 密码加密
│   │   ├── database.py     # 数据库配置
│   │   ├── config.py       # 应用配置
│   │   └── dependencies.py # 依赖注入
│   ├── main.py             # 应用入口
│   └── requirements.txt    # Python 依赖
│
└── frontend/               # 前端项目
    ├── src/
    │   ├── components/
    │   │   └── layout/     # 布局组件
    │   │       ├── Header.jsx
    │   │       ├── Sidebar.jsx
    │   │       └── MobileNavigation.jsx
    │   ├── contexts/
    │   │   └── ThemeContext.jsx  # 主题上下文
    │   ├── pages/
    │   │   ├── IndexPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── NoteListPage.jsx
    │   │   └── NoteDetailPage.jsx
    │   ├── services/
    │   │   └── api.js      # API 服务封装
    │   ├── hooks/
    │   │   └── useBreakpoint.js  # 响应式断点 Hook
    │   ├── App.jsx         # 应用主组件
    │   └── main.jsx        # 应用入口
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 快速开始

### 环境要求

- Python 3.10+
- Node.js 18+
- MySQL 8.0+

### 1. 数据库准备

```sql
-- 创建数据库
CREATE DATABASE personal_kb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. 后端启动

```bash
cd backend

# 安装依赖
pip install -r requirements.txt

# 配置环境变量（可选，使用默认配置即可）
# 如需自定义，创建 .env 文件并修改配置

# 启动开发服务器
python main.py
```

后端将在 http://localhost:8000 启动

API 文档访问：

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 3. 前端启动

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端将在 http://localhost:8096 启动

### 4. 构建生产版本

```bash
cd frontend
npm run build
```

构建产物在 `dist/` 目录

## 主要功能

### 用户认证

- 用户注册和登录
- JWT Token 认证
- 个人信息管理

### 笔记管理

- 创建、编辑、删除笔记
- Markdown 格式支持
- 分类组织（树形结构）
- 标签管理
- 收藏功能
- 全文搜索
- 分页查询

### 主题系统

- 明暗主题切换
- 主色调自定义
- 系统主题自动跟随
- 本地持久化存储

### 响应式设计

- 桌面端：侧边栏导航
- 移动端：底部导航栏
- 安全区域适配（刘海屏）
- 触摸优化

## 配置说明

### 后端配置 ([`backend/app/config.py`](backend/app/config.py))

```python
# 应用基础配置
APP_NAME: str = "Personal Knowledge Base"
DEBUG: bool = True
SECRET_KEY: str = "your-secret-key-change-this"

# 数据库配置
DATABASE_URL: str = "mysql+pymysql://root:password@localhost:3306/personal_kb"

# JWT 配置
JWT_SECRET_KEY: str = "your-jwt-secret-key-change-this"
ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

# CORS 配置
CORS_ORIGINS: List[str] = ["http://localhost:8096"]
```

### 前端 API 配置

在 frontend 目录创建 `.env` 文件：

```bash
VITE_API_URL=http://localhost:8000
```

## API 端点

### 认证接口

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/profile` - 获取个人信息
- `PUT /api/auth/profile` - 更新个人信息
- `POST /api/auth/logout` - 用户登出

### 分类接口

- `GET /api/categories` - 获取分类列表
- `POST /api/categories` - 创建分类
- `GET /api/categories/{id}` - 获取分类详情
- `PUT /api/categories/{id}` - 更新分类
- `DELETE /api/categories/{id}` - 删除分类

### 标签接口

- `GET /api/tags` - 获取标签列表
- `POST /api/tags` - 创建标签
- `GET /api/tags/{id}` - 获取标签详情
- `PUT /api/tags/{id}` - 更新标签
- `DELETE /api/tags/{id}` - 删除标签

### 笔记接口

- `GET /api/notes` - 获取笔记列表（支持分页、筛选、搜索）
- `POST /api/notes` - 创建笔记
- `GET /api/notes/{id}` - 获取笔记详情
- `PUT /api/notes/{id}` - 更新笔记
- `DELETE /api/notes/{id}` - 删除笔记

## 优化建议

### 性能优化

- **代码分割** - 使用动态导入减少初始加载体积
- **请求缓存** - 集成 React Query 进行请求缓存和状态管理
- **虚拟列表** - 长列表使用 react-window 优化渲染

### 功能增强

- **状态管理** - 考虑添加 Redux 或 Zustand 进行全局状态管理
- **表单验证** - 完善表单验证规则
- **富文本编辑器** - 集成 TinyMCE 或 TipTap
- **图片上传** - 支持笔记中的图片上传和管理

### 开发体验

- **错误边界** - 添加 React Error Boundary 提升错误处理
- **单元测试** - 添加 Jest + React Testing Library
- **E2E 测试** - 添加 Playwright 进行端到端测试

## 部署

详细部署方案请参考 [`deployment-solutions.md`](deployment-solutions.md)

推荐使用 Zeabur 进行一键部署。

## 许可证

MIT License
