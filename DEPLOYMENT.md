# 免费部署指南

本指南将帮助您将个人知识库系统完全免费部署到生产环境。

## 📋 部署架构

```
┌─────────────┐
│  Vercel     │ ← 前端 (免费 100GB/月)
└──────┬──────┘
       │
       ↓ API 请求
┌─────────────┐
│  Railway    │ ← 后端 (免费 $5/月)
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ PlanetScale │ ← 数据库 (免费 10GB)
└─────────────┘
```

## 🚀 部署步骤

### 准备工作

1. **GitHub 仓库**
   - 将代码推送到 GitHub
   - 确保仓库是公开的或私有的

2. **域名（可选）**
   - 如有自定义域名，提前准备好
   - 没有域名可使用平台提供的子域名

---

## 步骤 1️⃣：配置数据库 (PlanetScale)

### 1.1 注册 PlanetScale
1. 访问 [https://planetscale.com/](https://planetscale.com/)
2. 点击 "Sign up" 使用 GitHub 账号登录

### 1.2 创建数据库
1. 点击 "New database"
2. 填写数据库信息：
   - **Database name**: `knowledge_db`
   - **Region**: 选择 `AWS ap-southeast-1` (新加坡，亚洲访问快)
   - **Plan**: 选择 `Free` (免费计划)
3. 点击 "Create database"

### 1.3 获取连接字符串
1. 在数据库页面点击 "Connect"
2. 选择 "@planetcale Connect" 或 "Prisma"
3. 选择 "Python" 语言
4. 复制连接字符串，格式类似：
   ```
   mysql+aiomysql://xxx:xxx@aws.connect.psdb.cloud/knowledge_db?sslaccept=strict
   ```
5. **保存此字符串**，部署后端时需要用到

---

## 步骤 2️⃣：部署后端 (Railway)

### 2.1 注册 Railway
1. 访问 [https://railway.app/](https://railway.app/)
2. 点击 "Login with GitHub"

### 2.2 创建项目
1. 点击 "New Project"
2. 输入项目名称：`personal-knowledge`
3. 点击 "Create New Project"

### 2.3 部署后端服务
1. 在项目中点击 "New Service"
2. 选择 "Deploy from GitHub repo"
3. 授权 Railway 访问您的 GitHub
4. 选择您的项目仓库
5. Railway 会自动检测并配置

### 2.4 配置环境变量
1. 点击后端 service
2. 切换到 "Variables" 标签
3. 点击 "New Variable" 添加以下变量：

| 变量名 | 值 |
|--------|---|
| `DATABASE_URL` | `<粘贴 PlanetScale 连接字符串>` |
| `SECRET_KEY` | 访问 https://randomkeygen.com/ 生成，例如：`abc123def456` |
| `CORS_ORIGINS` | `["https://your-frontend.vercel.app"]` |
| `DEBUG` | `False` |

### 2.5 启动部署
1. 配置完成后，点击 "Deploy"
2. 等待部署完成（约 2-3 分钟）
3. 部署成功后，获取后端 URL：
   ```
   https://your-backend.up.railway.app
   ```
4. 保存此 URL

### 2.6 执行数据库迁移
1. 在 Railway 项目中，点击后端 service
2. 打开 "Console" 标签
3. 执行命令：
   ```bash
   python scripts/migrate_production.py
   ```
4. 看到输出 "数据库迁移完成" 即成功

### 2.7 获取 Railway Token 和 Project ID
1. **获取 Token**:
   - Railway 右上角点击头像 → "Account"
   - 滚动到 "API Tokens"
   - 点击 "New Token"
   - 权限选择：`Read-Only` 即可
   - 复制 Token

2. **获取 Project ID**:
   - Railway 项目页面的 URL 格式为：
     ```
     https://railway.app/p/PROJECT_ID/...
     ```
   - PROJECT_ID 就是 URL 中的那部分
   - 例如：`abc123-4567def`

---

## 步骤 3️⃣：部署前端 (Vercel)

### 3.1 注册 Vercel
1. 访问 [https://vercel.com/](https://vercel.com/)
2. 点击 "Sign Up" 使用 GitHub 账号登录

### 3.2 导入项目
1. 登录后点击 "Add New Project"
2. 点击 "Import Git Repository"
3. 输入您的 GitHub 仓库地址
4. 或直接从列表中选择

### 3.3 配置前端项目
1. **Project Settings**:
   - Project Name: `personal-knowledge-frontend`
   - Framework Preset: `Vite`
   - Root Directory: `frontend`

2. **Build & Development Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Node Version: `18.x`

3. **Environment Variables**:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.up.railway.app`
   - (使用步骤 2 获取的后端 URL)

### 3.4 开始部署
1. 点击 "Deploy"
2. 等待部署完成（约 1-2 分钟）
3. 部署成功后，获取前端 URL：
   ```
   https://your-frontend.vercel.app
   ```

### 3.5 获取 Vercel Token
1. Vercel 右上角头像 → "Settings"
2. 左侧菜单选择 "Tokens"
3. 点击 "Create"
4. Scope 选择：`Full Account`
5. 复制 Token

---

## 步骤 4️⃣：配置 GitHub Secrets

### 4.1 添加 Secrets
1. 进入 GitHub 仓库页面
2. 点击 "Settings" → "Secrets and variables" → "Actions"
3. 点击 "New repository secret"
4. 添加以下 3 个 secrets：

| Name | Secret |
|------|--------|
| `RAILWAY_TOKEN` | `<Railway Token>` |
| `RAILWAY_PROJECT_ID` | `<Railway Project ID>` |
| `VERCEL_TOKEN` | `<Vercel Token>` |

### 4.2 保存 Secrets
- 添加完成后，每次 push 到 main 分支都会自动部署

---

## 步骤 5️⃣：更新配置并推送代码

### 5.1 更新环境变量

**`frontend/.env.production`**:
```bash
VITE_API_URL=https://your-backend.up.railway.app
```

**`frontend/vercel.json`**:
将 `your-backend` 替换为实际的后端 URL。

### 5.2 提交代码
```bash
git add .
git commit -m "chore: add production deployment config"
git push origin main
```

### 5.3 验证自动部署
1. 在 GitHub 仓库查看 "Actions" 标签
2. 应该可以看到 "Deploy to Production" 工作流正在运行
3. 等待部署完成（约 3-5 分钟）

---

## 步骤 6️⃣：设置自定义域名（可选）

### 6.1 配置前端域名
1. 在 Vercel 项目中
2. 点击 "Settings" → "Domains"
3. 点击 "Add Domain"
4. 输入您的域名：`www.your-domain.com`
5. Vercel 会显示 DNS 配置信息

### 6.2 配置 DNS
在您的域名注册商处添加 CNAME 记录：
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 6.2 配置后端域名
1. 在 Railway 项目中
2. 点击后端 service → "Settings"
3. 在 "Domains" 中添加域名
4. 按提示配置 DNS

### 6.3 更新 CORS 配置
将以下内容添加到 Railway 的 `CORS_ORIGINS` 环境变量：
```json
["https://www.your-domain.com", "https://your-frontend.vercel.app"]
```

---

## 🔍 故障排查

### 问题 1: CORS 错误
**症状**: 前端无法访问后端 API

**解决方案**:
1. 检查 Railway 环境变量 `CORS_ORIGINS`
2. 确保包含前端域名（包括 https://）
3. 保存后重新部署

### 问题 2: 数据库连接失败
**症状**: 后端无法连接数据库

**解决方案**:
1. 检查 `DATABASE_URL` 格式
2. 确保是 `mysql+aiomysql://` 开头
3. 在 PlanetScale 检查数据库是否启用

### 问题 3: 文件上传失败
**症状**: 上传头像返回 500 错误

**解决方案**:
1. 确保 Railway 服务的 `uploads` 目录有写权限
2. 检查文件大小是否超过 2MB

### 问题 4: 自动部署失败
**症状**: GitHub Actions 报错

**解决方案**:
1. 检查 Secrets 是否正确配置
2. 确认 Token 有足够的权限
3. 在 GitHub Actions 日志中查看详细错误

---

## 📊 监控和维护

### 查看日志

**Railway 后端日志**:
1. 打开 Railway 项目
2. 点击后端 service
3. 查看 "Logs" 标签

**Vercel 前端日志**:
1. 打开 Vercel 项目
2. 点击 "Deployments"
3. 选择部署记录查看日志

### 数据库备份

**手动备份**:
1. 在 PlanetScale 数据库页面
2. 点击 "Backups"
3. 点击 "Create backup"

**自动备份**:
1. PlanetScale 免费计划每小时自动备份

---

## 💰 成本估算

| 服务 | 免费额度 | 预计费用 |
|------|---------|---------|
| Vercel 前端 | 100GB 带宽/月 | $0 |
| Railway 后端 | $5/月 | $0 |
| PlanetScale DB | 10GB 存储 + 50亿读取/月 | $0 |
| 域名 | - | $10-15/年 |
| **总计** | - | **$0 - $2/月** |

---

## 🎉 完成！

部署完成后，您可以：
- ✅ 通过前端 URL 访问应用
- ✅ 注册、登录、创建笔记
- ✅ 上传头像、管理分类标签
- ✅ 所有功能完全免费使用

祝您使用愉快！
