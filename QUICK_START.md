# 快速部署指南 🚀

> 30分钟内将您的个人知识库系统免费部署到生产环境

---

## 📋 部署前准备

### ✅ 检查清单
- [ ] GitHub 账号（用于代码托管和 CI/CD）
- [ ] 代码已推送到 GitHub
- [ ] 10-15 分钟时间

---

## 🎯 部署路线图

```
第1步: PlanetScale (数据库) ⏱️ 3分钟
    ↓
第2步: Railway (后端)      ⏱️ 5分钟
    ↓
第3步: Vercel (前端)       ⏱️ 3分钟
    ↓
第4步: GitHub Secrets    ⏱️ 2分钟
    ↓
第5步: 验证部署         ⏱️ 2分钟
```

---

## 第1步：配置数据库 (PlanetScale)

### 🌟 访问 PlanetScale
👉 https://planetscale.com/

### 📝 操作步骤

#### 1.1 注册登录
1. 点击右上角 **"Sign up"**
2. 选择 **"Continue with GitHub"**
3. 授权 GitHub 登录

#### 1.2 创建数据库
1. 登录后点击 **"New database"**
2. 填写表单：
   ```
   Database name: knowledge_db
   Region: AWS ap-southeast-1 (新加坡)
   Plan: Free (免费计划)
   ```
3. 点击 **"Create database"**

#### 1.3 获取连接字符串
1. 创建完成后，进入数据库页面
2. 点击右上角 **"Connect"**
3. 选择 **"@PlanetScale Connect"** 标签
4. 选择 **"Python"** 语言
5. 复制连接字符串：
   ```
   mysql+aiomysql://xxx:xxx@aws.connect.psdb.cloud/knowledge_db?sslaccept=strict
   ```

⚠️ **保存此字符串**，后续步骤需要用到

---

## 第2步：部署后端 (Railway)

### 🌟 访问 Railway
👉 https://railway.app/

### 📝 操作步骤

#### 2.1 创建项目
1. 登录后点击 **"New Project"**
2. 项目名称：`personal-knowledge`
3. 点击 **"Create New Project"**

#### 2.2 部署后端服务
1. 在项目中点击 **"New Service"**
2. 点击 **"Deploy from GitHub repo"**
3. 授权 Railway 访问 GitHub
4. 从列表中选择您的项目仓库
5. Railway 自动检测后端配置

#### 2.3 配置环境变量
1. 点击后端 service
2. 切换到 **"Variables"** 标签
3. 点击 **"New Variable"**，添加以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DATABASE_URL` | `<粘贴 PlanetScale 连接字符串>` | 数据库连接 |
| `SECRET_KEY` | `随机生成 32 位字符串` | JWT 密钥 |
| `CORS_ORIGINS` | `["https://your-frontend.vercel.app"]` | 跨域配置 |
| `DEBUG` | `False` | 生产环境 |

**生成 SECRET_KEY**：
- 访问：https://randomkeygen.com/
- 点击生成，复制 32 位字符串

#### 2.4 启动部署
- 点击 **"Deploy"** 按钮
- 等待部署完成（约 2-3 分钟）

#### 2.5 执行数据库迁移
1. 部署成功后，点击后端 service
2. 打开 **"Console"** 标签
3. 执行命令：
   ```bash
   python scripts/migrate_production.py
   ```
4. 看到输出以下内容表示成功：
   ```
   ============================================
   数据库迁移开始
   ============================================

   1. 创建数据库表...
   ✅ 数据库表创建成功！

   2. 验证表结构...
   ✅ 当前数据库表: ['users', 'categories', 'tags', 'notes', 'note_tags']

   ✅ 数据库迁移完成！
   ```

#### 2.6 保存后端信息
- 后端 URL：`https://xxx.up.railway.app`
- 保存此 URL 供前端使用

---

## 第3步：部署前端 (Vercel)

### 🌟 访问 Vercel
👉 https://vercel.com/

### 📝 操作步骤

#### 3.1 导入项目
1. 登录后点击 **"Add New..."** → **"Project"**
2. 点击 **"Import Git Repository"**
3. 输入您的 GitHub 仓库地址
4. 或从列表中选择

#### 3.2 配置项目
在项目配置页面填写：

**Basic Settings:**
- **Project Name**: `personal-knowledge-frontend`
- **Framework Preset**: `Vite`
- **Root Directory**: `frontend`

**Build & Development Settings:**
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

**Environment Variables:**
- Key: `VITE_API_URL`
- Value: `https://your-backend.up.railway.app`

#### 3.3 开始部署
- 点击 **"Deploy"** 按钮
- 等待部署完成（约 1-2 分钟）

#### 3.4 保存前端信息
- 前端 URL：`https://your-frontend.vercel.app`

---

## 第4步：配置 GitHub Secrets

### 📝 操作步骤

#### 4.1 获取 Railway Token
1. 在 Railway 点击右上角头像 → **"Account"**
2. 滚动到 **"API Tokens"**
3. 点击 **"New Token"**
4. 勾选：`Read-Only`
5. 复制 Token

#### 4.2 获取 Railway Project ID
- 查看 Railway 项目 URL
- 格式：`https://railway.app/p/PROJECT_ID/...`
- PROJECT_ID 就是 URL 中的那部分

#### 4.3 获取 Vercel Token
1. 在 Vercel 点击右上角头像 → **"Settings"**
2. 左侧菜单 → **"Tokens"**
3. 点击 **"Create"**
4. Scope 选择：**"Full Account"**
5. 复制 Token

#### 4.4 添加到 GitHub Secrets
1. 进入 GitHub 仓库页面
2. **Settings** → **Secrets and variables** → **Actions**
3. 点击 **"New repository secret"**
4. 添加以下 3 个 secrets：

| Name | Secret |
|------|--------|
| `RAILWAY_TOKEN` | Railway Token |
| `RAILWAY_PROJECT_ID` | Railway Project ID |
| `VERCEL_TOKEN` | Vercel Token |

---

## 第5步：验证部署

### ✅ 验证清单

#### 5.1 测试前端
1. 访问前端 URL：`https://your-frontend.vercel.app`
2. 应该看到登录页面

#### 5.2 测试注册
1. 点击"注册"
2. 填写用户名、邮箱、密码
3. 提交注册

#### 5.3 测试登录
1. 使用刚注册的账号登录
2. 应该能看到仪表板

#### 5.4 测试创建笔记
1. 点击"新建笔记"
2. 输入标题和内容
3. 保存

#### 5.5 测试上传头像
1. 进入"设置"页面
2. 上传头像
3. 验证右上角头像是否更新

---

## 🎉 部署完成！

### 📌 保存重要信息

```bash
# 数据库
PlanetScale: https://planetscale.com
数据库: knowledge_db

# 后端
Railway: https://railway.app
后端URL: https://xxx.up.railway.app

# 前端
Vercel: https://vercel.com
前端URL: https://your-frontend.vercel.app
```

---

## 🔄 自动部署配置

配置完成后，以后更新代码只需：

```bash
git add .
git commit -m "your commit message"
git push origin main
```

GitHub Actions 会自动：
1. 部署后端到 Railway
2. 执行数据库迁移
3. 构建并部署前端到 Vercel

---

## 🆘 遇到问题？

### 常见错误

**CORS 错误**:
```
Access to fetch at 'xxx' has been blocked by CORS policy
```
**解决**: 检查 Railway `CORS_ORIGINS` 环境变量

**数据库连接失败**:
```
Can't connect to MySQL server
```
**解决**: 检查 `DATABASE_URL` 格式是否正确

**404 错误**:
```
404 Not Found
```
**解决**: 检查 API URL 是否正确配置

---

## 📞 需要帮助？

- 查看 `DEPLOYMENT.md` 详细文档
- 检查 `deploy.sh` 脚本

祝部署顺利！🎊
