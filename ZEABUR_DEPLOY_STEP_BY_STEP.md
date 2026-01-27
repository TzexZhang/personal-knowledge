# Zeabur 部署详细操作指南

本指南提供从零开始部署个人知识库到 Zeabur 的完整步骤，每个操作都包含中英文对照。

**最后更新：2026-01-27** | 基于 Zeabur 最新文档

---

## 目录

1. [准备工作](#准备工作)
2. [代码推送到 GitHub](#代码推送到-github)
3. [注册 Zeabur 账号](#注册-zeabur-账号)
4. [账户验证](#账户验证)
5. [创建 Zeabur 项目](#创建-zeabur-项目)
6. [选择部署方式](#选择部署方式)
7. [部署 MySQL 数据库](#部署-mysql-数据库)
8. [部署后端服务](#部署后端服务)
9. [部署前端服务](#部署前端服务)
10. [配置 CORS](#配置-cors)
11. [测试部署](#测试部署)
12. [配置自定义域名（可选）](#配置自定义域名可选)
13. [使用 Zeabur AI 助理（新功能）](#使用-zeabur-ai-助理新功能)
14. [使用 Zeabur CLI（新功能）](#使用-zeabur-cli新功能)

---

## 准备工作

### 1.1 确认本地环境

确保你已经安装了以下工具：

- [x] Git
- [x] Python 3.10+
- [x] Node.js 18+
- [x] 一个 GitHub 账号

### 1.2 检查项目结构

确保你的项目结构如下：

```
personal-knowledge/
├── backend/                 # 后端目录
│   ├── app/
│   │   ├── config.py
│   │   ├── database.py
│   │   └── ...
│   ├── main.py
│   └── requirements.txt
├── frontend/                # 前端目录
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

### 1.3 测试本地运行

在部署前，确保项目在本地可以正常运行：

```bash
# 测试后端
cd backend
pip install -r requirements.txt
python main.py

# 测试前端
cd ../frontend
npm install
npm run dev
```

---

## 代码推送到 GitHub

### 步骤 1：初始化 Git 仓库

如果你的项目还没有初始化 Git，执行以下命令：

```bash
# 在项目根目录
cd D:\web\project\personal-knowledge

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "初始化项目：准备部署到 Zeabur"
```

### 步骤 2：在 GitHub 创建仓库

1. 打开浏览器，访问 [GitHub](https://github.com)

2. 登录你的账号

3. 点击右上角的 **"+"** 图标

   中文：点击右上角的 **"+"** 图标
   English: Click the **"+"** icon in the top right corner

4. 选择 **"New repository"**（新建仓库）

   中文：选择 "New repository"（新建仓库）
   English: Select **"New repository"**

5. 填写仓库信息：

   - **Repository name**（仓库名称）：`personal-knowledge`（或你喜欢的名称）
   - **Description**（描述）：`个人知识库管理系统 - React + FastAPI + MySQL`
   - **Public/Private**（公开/私有）：选择 **Private**（私有）或 **Public**（公开）
   - **Initialize this repository with**：❌ 不要勾选任何选项

   中文：
   - Repository name：`personal-knowledge`
   - Description：`个人知识库管理系统`
   - 可见性：选择 Private（私有）或 Public（公开）
   - 不要勾选 "Add a README file" 等选项

   English:
   - **Repository name**: `personal-knowledge`
   - **Description**: `Personal Knowledge Base - React + FastAPI + MySQL`
   - **Public/Private**: Choose **Private** or **Public**
   - ❌ Uncheck all options under "Initialize this repository"

6. 点击底部的 **"Create repository"**（创建仓库）按钮

   中文：点击绿色按钮 "Create repository"
   English: Click the green **"Create repository"** button

### 步骤 3：推送代码到 GitHub

GitHub 会显示一个新的页面，包含快速设置页面的命令。按照以下步骤操作：

1. 在页面顶部，确认你选择了 **"HTTPS"** 标签

   中文：确认选中了 "HTTPS" 标签
   English: Make sure the **"HTTPS"** tab is selected

2. 复制第二部分的命令，将本地仓库推送到 GitHub：

   ```bash
   # 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
   git remote add origin https://github.com/YOUR_USERNAME/personal-knowledge.git

   # 重命名主分支为 main（如果还不是 main）
   git branch -M main

   # 推送代码到 GitHub
   git push -u origin main
   ```

   中文：复制并运行上述命令，将 YOUR_USERNAME 替换为你的 GitHub 用户名
   English: Copy and run the commands above, replace `YOUR_USERNAME` with your GitHub username

3. 如果提示输入用户名和密码：
   - **Username**（用户名）：你的 GitHub 用户名
   - **Password**（密码）：使用 **Personal Access Token**（不是 GitHub 密码）

   中文：密码需要使用 Personal Access Token，而不是 GitHub 登录密码
   English: Use a Personal Access Token for password, not your GitHub password

   **获取 Personal Access Token：**
   - 访问：https://github.com/settings/tokens
   - 点击 **"Generate new token"** → **"Generate new token (classic)"**
   - 勾选 **`repo`** 权限
   - 点击 **"Generate token"**
   - 复制生成的 token（只显示一次）

### 步骤 4：验证推送成功

1. 刷新 GitHub 仓库页面
2. 你应该能看到所有的项目文件

   中文：刷新页面，应该能看到所有项目文件
   English: Refresh the page, you should see all project files

---

## 注册 Zeabur 账号

### 步骤 1：访问 Zeabur

1. 打开浏览器，访问 [Zeabur 官网](https://zeabur.com)

   中文：访问 https://zeabur.com
   English: Visit https://zeabur.com

2. 点击右上角的 **"登录"** 或 **"Sign Up"** 按钮

   中文：点击右上角的 "登录" 或 "Sign Up" 按钮
   English: Click the **"Login"** or **"Sign Up"** button in the top right corner

### 步骤 2：选择登录方式

Zeabur 支持多种登录方式：

#### 方式 1：邮箱注册（推荐新手）

1. 点击 **"通过电子邮件继续"**（Continue with Email）

   中文：点击 "通过电子邮件继续" 按钮
   English: Click **"Continue with Email"** button

2. 输入你的邮箱地址

   中文：输入邮箱地址
   English: Enter your email address

3. 点击 **"发送邮件"**（Send Email）

   中文：点击 "发送邮件" 按钮
   English: Click **"Send Email"** button

4. 你会看到提示："登录链接已发送"

   中文：显示 "登录链接已发送"
   English: You'll see: "Login link has been sent"

5. 打开你的电子邮箱（Gmail、Outlook、Apple Mail 等）

   中文：打开邮箱查看
   English: Open your email inbox

6. 找到来自 Zeabur 的邮件，点击 **"登录"** 按钮

   中文：找到邮件并点击 "登录" 按钮
   English: Find the email from Zeabur and click **"Login"** button

7. 邮箱中的登录链接会打开浏览器并完成登录

   中文：点击链接后自动完成登录
   English: The link will open your browser and complete the login

#### 方式 2：GitHub 登录（推荐开发者）⭐

1. 点击 **"Continue with GitHub"**（使用 GitHub 继续）

   中文：点击 "Continue with GitHub" 按钮
   English: Click the **"Continue with GitHub"** button

2. 如果未授权，会跳转到 GitHub 授权页面

3. 选择要授权的仓库（可以选择所有仓库或特定仓库）

   中文：选择要授权的仓库
   English: Select repositories to authorize

4. 点击 **"Authorize Zeabur"**（授权 Zeabur）

   中文：点击绿色按钮 "Authorize Zeabur"
   English: Click the green **"Authorize Zeabur"** button

#### 方式 3：Google 登录

1. 点击 **"Continue with Google"**（使用 Google 继续）

   中文：点击 "Continue with Google" 按钮
   English: Click the **"Continue with Google"** button

2. 选择你的 Google 账号

   中文：选择 Google 账号
   English: Select your Google account

3. 授权 Zeabur 访问你的基本信息

### 步骤 3：完成登录

登录成功后，会跳转到 Zeabur 的 **Dashboard**（控制台）页面

   中文：登录成功后会自动跳转到控制台页面
   English: You will be redirected to the Dashboard after successful login

**提示**：页面右上角可以切换界面语言（简体中文、繁体中文、英文、日文等）

---

## 账户验证

首次创建项目时，Zeabur 会要求进行账户验证。这是为了确保服务安全和防止滥用。

### 验证方式

Zeabur 提供以下三种验证方式，你可以任选一种：

#### 方式 1：手机号验证（推荐）📱

1. 在账户验证页面，选择 **"手机号验证"**（Phone Verification）

   中文：选择 "手机号验证" 选项
   English: Select **"Phone Verification"** option

2. 选择你的国家/地区代码（如：+86 中国）

   中文：选择国家代码
   English: Select your country code

3. 输入手机号码

   中文：输入手机号
   English: Enter your phone number

4. 点击 **"发送验证码"**（Send Code）

   中文：点击 "发送验证码"
   English: Click **"Send Code"**

5. 等待收到短信验证码

   中文：等待短信验证码
   English: Wait for SMS verification code

6. 输入收到的验证码

   中文：输入验证码
   English: Enter the verification code

7. 点击 **"验证"**（Verify）

   中文：点击 "验证" 按钮
   English: Click **"Verify"**

8. 验证成功后，你将看到成功提示

**注意事项：**
- ✅ 支持大部分国家/地区
- ✅ 可以绑定多个 Zeabur 账户
- ❌ 部分国家/地区可能不支持

#### 方式 2：预存额度 💰

如果你不方便使用手机号验证，可以选择预存一定额度：

1. 在账户验证页面，选择 **"预存额度"**（Predeposit）

   中文：选择 "预存额度" 选项
   English: Select **"Predeposit"** option

2. 选择预存金额（根据页面提示）

   中文：选择预存金额
   English: Select the amount to predeposit

3. 完成支付流程

   中文：完成支付
   English: Complete the payment

**重要说明：**
- ✅ 只要没有订阅 Dev Plan 或服务器，且无滥用行为，不会扣除余额
- ✅ 预存金额可以用于未来的服务消费
- ✅ 适合长期使用 Zeabur 的用户

#### 方式 3：绑定信用卡 💳

绑定信用卡进行验证：

1. 在账户验证页面，选择 **"绑定信用卡"**（Bind Credit Card）

   中文：选择 "绑定信用卡" 选项
   English: Select **"Bind Credit Card"** option

2. 输入信用卡信息

   中文：输入信用卡信息
   English: Enter credit card information

3. 完成验证

   中文：完成验证
   English: Complete verification

**重要说明：**
- ✅ 仅用于验证，不会自动扣费
- ✅ 除非你主动订阅服务，否则不会发起扣款
- ✅ 验证成功后可以随时解绑（不推荐）

### 验证完成

验证成功后，你就可以创建项目了！

1. 点击 **"返回"** 或 **"继续"**（Continue）

   中文：点击返回或继续按钮
   English: Click **"Back"** or **"Continue"**

2. 重新创建项目

   中文：重新创建项目
   English: Create project again

---

## 创建 Zeabur 项目

### 步骤 1：创建新项目

1. 在 Dashboard 页面，点击左上角的 **"Create New Project"**（创建新项目）按钮

   中文：点击左上角的 "Create New Project" 按钮
   English: Click the **"Create New Project"** button in the top left corner

2. 或者点击页面中央的 **"New Project"** 卡片

   中文：也可以点击页面中央的 "New Project" 卡片
   English: Or click the **"New Project"** card in the center of the page

### 步骤 2：选择项目区域

1. 在弹出的对话框中，选择 **Region**（区域）

   中文：选择部署区域
   English: Select deployment region

   推荐选择：
   - **Hong Kong, China** (香港，中国) - 国内访问快
   - **Singapore** (新加坡) - 东南亚访问快
   - **Tokyo, Japan** (日本东京) - 东亚访问快
   - **US West** (美国西部) - 美洲访问快
   - **Europe** (欧洲) - 欧洲访问快

   中文：推荐选择香港或新加坡，国内访问速度更快
   English: Recommend choosing Hong Kong or Singapore for faster access from China

2. 点击 **"Create"**（创建）按钮

   中文：点击 "Create" 按钮
   English: Click the **"Create"** button

### 步骤 3：项目创建成功

1. 项目创建后会自动跳转到项目页面

   中文：项目创建成功后会自动跳转
   English: You will be redirected to the project page automatically

2. 页面标题会显示你的项目名称（例如：`Personal Knowledge Base`）

   中文：页面顶部显示项目名称
   English: Project name is displayed at the top of the page

3. 你会看到 **"部署新服务"**（Deploy New Service）按钮

   中文：显示 "部署新服务" 按钮
   English: You'll see the **"Deploy New Service"** button

---

## 选择部署方式

Zeabur 提供多种部署方式。根据你的项目类型和偏好，选择最适合的方式：

### 部署方式对比

| 部署方式 | 适用场景 | 优势 | 难度 |
|---------|---------|------|------|
| **从 Git 部署** ⭐ | 代码在 GitHub/GitLab | 自动 CI/CD、零配置 | ⭐ 简单 |
| **从模板部署** | 快速部署开源项目 | 一键部署、无需代码 | ⭐ 超简单 |
| **本地项目部署** | 不想用 Git 仓库 | 直接上传 | ⭐⭐ 中等 |
| **Docker 镜像** | 容器化应用 | 环境一致 | ⭐⭐ 中等 |
| **CLI 部署** | 命令行爱好者 | 快速、可脚本化 | ⭐⭐ 中等 |
| **AI 助理** 🤖 | 部署新手 | 自然语言描述 | ⭐ 超简单 |
| **函数（Serverless）** | 简单脚本/API | 在线编写 | ⭐ 简单 |
| **IDE 部署** | Cursor IDE 用户 | 无缝集成 | ⭐ 简单 |

### 推荐部署流程

对于本项目（React + FastAPI + MySQL），推荐使用 **从 Git 部署** 方式：

**优点：**
- ✅ 代码推送即自动部署
- ✅ 自动识别项目类型
- ✅ 零配置 CI/CD
- ✅ 支持团队协作

**接下来的章节将详细介绍使用 Git 方式部署的步骤。**

如果你想使用其他部署方式（如 AI 助理或 CLI），可以跳到文档末尾的相关章节。

---

## 部署 MySQL 数据库

### 步骤 1：添加 MySQL 服务

1. 在项目页面，点击 **"Add Service"**（添加服务）按钮

   中文：点击 "Add Service" 按钮
   English: Click the **"Add Service"** button

2. 在弹出的菜单中，选择 **"Marketplace"**（市场）

   中文：选择 "Marketplace"（市场）
   English: Select **"Marketplace"**

3. 在搜索框中输入 `MySQL` 或 `mysql`

   中文：在搜索框输入 "MySQL"
   English: Type `MySQL` in the search box

4. 在搜索结果中，找到 **"MySQL"** 卡片，点击 **"Deploy"**（部署）按钮

   中文：找到 MySQL 卡片，点击 "Deploy" 按钮
   English: Find the **"MySQL"** card and click the **"Deploy"** button

### 步骤 2：选择计划

1. 在弹出的对话框中，选择 **Plan**（计划）

   中文：选择服务计划
   English: Select service plan

2. 选择 **"Free"**（免费）计划

   中文：选择 "Free" 免费计划（256MB 存储）
   English: Choose **"Free"** plan (256MB storage)

   免费计划包括：
   - 256MB 存储空间
   - 适合小型个人项目

   中文：免费计划包含 256MB 存储空间
   English: Free plan includes 256MB storage

3. 点击 **"Deploy"**（部署）按钮

   中文：点击 "Deploy" 按钮
   English: Click the **"Deploy"** button

### 步骤 3：等待部署完成

1. MySQL 服务开始部署，页面会显示部署进度

   中文：MySQL 开始部署，显示进度条
   English: MySQL deployment starts with progress indicator

2. 等待 1-2 分钟，状态变为 **"Running"**（运行中）

   中文：等待 1-2 分钟，状态变为 "Running"
   English: Wait 1-2 minutes until status changes to **"Running"**

3. 部署成功后，服务卡片会显示绿色的 **"● Running"** 状态

   中文：部署成功后显示绿色 "● Running" 状态
   English: After successful deployment, a green **"● Running"** status is displayed

### 步骤 4：获取 MySQL 连接信息

1. 点击 MySQL 服务卡片，进入详情页

   中文：点击 MySQL 服务卡片查看详情
   English: Click the MySQL service card to view details

2. 在详情页中，点击 **"Environment Variables"**（环境变量）标签

   中文：点击 "Environment Variables" 标签
   English: Click the **"Environment Variables"** tab

3. 这里可以看到 Zeabur 自动生成的 MySQL 连接信息：

   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLDATABASE`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`

   中文：这些变量会自动注入到后端服务
   English: These variables will be automatically injected into the backend service

4. **重要：** 不要关闭这个页面，稍后需要连接后端服务到 MySQL

   中文：不要关闭页面，稍后需要连接后端到 MySQL
   English: Don't close this page, you'll need to connect the backend to MySQL later

5. 返回项目页面（点击面包屑导航的项目名称）

   中文：点击页面顶部的项目名称返回项目页面
   English: Click the project name in the breadcrumb to return to the project page

---

## 部署后端服务

### 步骤 1：添加后端服务

1. 在项目页面，点击 **"Add Service"**（添加服务）按钮

   中文：点击 "Add Service" 按钮
   English: Click the **"Add Service"** button

2. 在弹出的菜单中，选择 **"Git"**（Git 仓库）

   中文：选择 "Git"
   English: Select **"Git"**

### 步骤 2：选择 GitHub 仓库

1. 如果是第一次使用，需要授权 Zeabur 访问你的 GitHub

   中文：首次使用需要授权 Zeabur 访问 GitHub
   English: First-time use requires authorizing Zeabur to access your GitHub

2. 点击 **"Configure GitHub App"**（配置 GitHub 应用）

   中文：点击 "Configure GitHub App"
   English: Click **"Configure GitHub App"**

3. 在 GitHub 授权页面，选择你要部署的仓库

   中文：选择要部署的仓库
   English: Select the repository you want to deploy

4. 勾选你的 `personal-knowledge` 仓库

   中文：勾选 personal-knowledge 仓库
   English: Check the `personal-knowledge` repository

5. 点击页面底部的 **"Install & Authorize"**（安装并授权）按钮

   中文：点击绿色按钮 "Install & Authorize"
   English: Click the green **"Install & Authorize"** button

6. 返回 Zeabur，在仓库列表中选择你的仓库

   中文：返回后在仓库列表中选择你的仓库
   English: Back in Zeabur, select your repository from the list

### 步骤 3：配置后端服务

1. 选择仓库后，会进入服务配置页面

   中文：选择仓库后进入配置页面
   English: After selecting the repository, you'll enter the service configuration page

2. 填写以下配置：

   #### Service Name（服务名称）

   - **Service Name**：`backend`

   中文：服务名称填写 "backend"
   English: Enter **"backend"** as the service name

   #### Root Directory（根目录）

   - **Root Directory**：`backend`

   中文：根目录填写 "backend"（指向后端目录）
   English: Enter **"backend"** as the root directory (points to the backend directory)

   #### Branch（分支）

   - **Branch**：`main`

   中文：分支选择 "main"
   English: Select **"main"** as the branch

3. 确认配置无误后，点击 **"Deploy"**（部署）按钮

   中文：点击 "Deploy" 按钮
   English: Click the **"Deploy"** button

### 步骤 4：配置环境变量

部署开始后，需要配置后端的环境变量。

1. 在服务部署页面，点击 **"Environment Variables"**（环境变量）标签

   中文：点击 "Environment Variables" 标签
   English: Click the **"Environment Variables"** tab

2. 点击 **"Add Variable"**（添加变量）按钮

   中文：点击 "Add Variable" 按钮
   English: Click the **"Add Variable"** button

3. 添加以下环境变量：

   #### 变量 1：APP_ENV

   - **Name**（名称）：`APP_ENV`
   - **Value**（值）：`production`

   中文：
   - 名称：APP_ENV
   - 值：production

   English:
   - **Name**: `APP_ENV`
   - **Value**: `production`

   #### 变量 2：DEBUG

   - **Name**：`DEBUG`
   - **Value**：`False`

   中文：
   - 名称：DEBUG
   - 值：False

   English:
   - **Name**: `DEBUG`
   - **Value**: `False`

   #### 变量 3：SECRET_KEY

   - **Name**：`SECRET_KEY`
   - **Value**：你需要生成的随机密钥

   中文：
   - 名称：SECRET_KEY
   - 值：使用下面的 Python 代码生成

   English:
   - **Name**: `SECRET_KEY`
   - **Value**: Generate using the Python code below

   **生成密钥的方法：**

   打开终端，运行：

   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

   中文：运行上述命令生成密钥，复制输出
   English: Run the command above to generate a key, copy the output

   复制生成的密钥并粘贴到 Value 字段。

   #### 变量 4：JWT_SECRET_KEY

   - **Name**：`JWT_SECRET_KEY`
   - **Value**：生成另一个随机密钥（再次运行上面的命令）

   中文：
   - 名称：JWT_SECRET_KEY
   - 值：生成另一个不同的随机密钥

   English:
   - **Name**: `JWT_SECRET_KEY`
   - **Value**: Generate another different random key

4. 每添加完一个变量，点击 **"Add"** 或 **"Save"**（保存）

   中文：每个变量添加后点击保存
   English: Click **"Save"** after adding each variable

### 步骤 5：连接到 MySQL 服务

1. 在后端服务页面，找到 **"Dependencies"**（依赖）部分

   中文：找到 "Dependencies" 部分
   English: Find the **"Dependencies"** section

2. 点击 **"Add Dependency"**（添加依赖）按钮

   中文：点击 "Add Dependency" 按钮
   English: Click the **"Add Dependency"** button

3. 在弹出的列表中，选择你的 MySQL 服务

   中文：选择之前部署的 MySQL 服务
   English: Select the MySQL service you deployed earlier

4. 点击 **"Connect"**（连接）按钮

   中文：点击 "Connect" 按钮
   English: Click the **"Connect"** button

5. 连接成功后，Zeabur 会自动将 MySQL 的环境变量注入到后端服务

   中文：连接成功后 MySQL 环境变量会自动注入
   English: After successful connection, MySQL environment variables will be automatically injected

   自动注入的变量：
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLDATABASE`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`

### 步骤 6：确认启动命令

1. 在服务配置页面，找到 **"Start Command"**（启动命令）部分

   中文：找到 "Start Command" 部分
   English: Find the **"Start Command"** section

2. 如果 Zeabur 自动检测到命令，应该是：

   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

   中文：确认启动命令为上述命令
   English: Confirm the start command is as shown above

3. 如果没有自动检测，手动添加：

   中文：如果没有自动检测，点击 "Customize" 自定义
   English: If not auto-detected, click **"Customize"**

   - 点击 **"Customize"**（自定义）
   - 输入命令：`uvicorn main:app --host 0.0.0.0 --port 8000`
   - 点击 **"Save"**（保存）

   中文：
   - 点击 "Customize"
   - 输入启动命令
   - 点击 "Save"

   English:
   - Click **"Customize"**
   - Enter the start command
   - Click **"Save"**

### 步骤 7：等待部署完成

1. 保存所有配置后，服务会自动重新部署

   中文：保存配置后自动重新部署
   English: Service will automatically redeploy after saving configuration

2. 查看部署日志：
   - 点击服务页面上的 **"Logs"**（日志）标签

   中文：点击 "Logs" 标签查看日志
   English: Click the **"Logs"** tab to view logs

3. 等待部署完成，日志会显示：

   ```
   Successfully built xxx
   Successfully tagged xxx
   Container started
   ```

   中文：日志显示上述内容表示部署成功
   English: The above messages in logs indicate successful deployment

4. 服务状态变为 **"● Running"**（运行中）

   中文：状态变为绿色 "● Running"
   English: Status changes to green **"● Running"**

### 步骤 8：获取后端 URL

1. 在服务卡片上，找到后端的公开 URL

   中文：在服务卡片上找到后端 URL
   English: Find the backend's public URL on the service card

2. URL 格式类似：`https://your-backend.zeabur.app`

   中文：URL 格式类似上述
   English: URL format similar to above

3. 点击 URL 可以在浏览器中打开

   中文：点击 URL 在浏览器中测试
   English: Click the URL to open it in a browser

4. 测试后端 API：
   - 访问：`https://your-backend.zeabur.app/api/health`
   - 应该看到：`{"status": "ok", "message": "服务运行正常"}`

   中文：访问健康检查接口测试后端
   English: Visit the health check endpoint to test the backend

5. **重要：** 复制这个 URL，稍后配置前端时需要用到

   中文：复制这个 URL，配置前端时需要
   English: Copy this URL, you'll need it when configuring the frontend

---

## 部署前端服务

### 步骤 1：添加前端服务

1. 返回项目页面（点击面包屑导航）

   中文：返回项目页面
   English: Return to the project page

2. 点击 **"Add Service"**（添加服务）按钮

   中文：点击 "Add Service" 按钮
   English: Click the **"Add Service"** button

3. 选择 **"Git"**（Git 仓库）

   中文：选择 "Git"
   English: Select **"Git"**

### 步骤 2：选择仓库

1. 在仓库列表中，选择同一个仓库（`personal-knowledge`）

   中文：选择同一个仓库
   English: Select the same repository

### 步骤 3：配置前端服务

1. 填写以下配置：

   #### Service Name（服务名称）

   - **Service Name**：`frontend`

   中文：服务名称填写 "frontend"
   English: Enter **"frontend"** as the service name

   #### Root Directory（根目录）

   - **Root Directory**：`frontend`

   中文：根目录填写 "frontend"（指向前端目录）
   English: Enter **"frontend"** as the root directory

   #### Branch（分支）

   - **Branch**：`main`

   中文：分支选择 "main"
   English: Select **"main"** as the branch

2. 点击 **"Deploy"**（部署）按钮

   中文：点击 "Deploy" 按钮
   English: Click the **"Deploy"** button

### 步骤 4：配置环境变量

1. 在前端服务页面，点击 **"Environment Variables"**（环境变量）标签

   中文：点击 "Environment Variables" 标签
   English: Click the **"Environment Variables"** tab

2. 点击 **"Add Variable"**（添加变量）按钮

   中文：点击 "Add Variable" 按钮
   English: Click the **"Add Variable"** button

3. 添加以下环境变量：

   #### 变量 1：VITE_API_URL

   - **Name**（名称）：`VITE_API_URL`
   - **Value**（值）：你的后端 URL

   中文：
   - 名称：VITE_API_URL
   - 值：粘贴之前复制的后端 URL

   English:
   - **Name**: `VITE_API_URL`
   - **Value**: Paste the backend URL you copied earlier

   例如：
   ```
   https://your-backend.zeabur.app
   ```

   中文：不要在末尾添加斜杠 /
   English: Do not add a trailing slash `/`

4. 点击 **"Add"** 或 **"Save"**（保存）

   中文：点击保存
   English: Click **"Save"**

### 步骤 5：等待部署完成

1. 保存配置后，服务会自动重新部署

   中文：保存后自动重新部署
   English: Service will automatically redeploy after saving

2. 点击 **"Logs"**（日志）标签查看部署进度

   中文：点击 "Logs" 查看部署进度
   English: Click the **"Logs"** tab to view deployment progress

3. Zeabur 会自动执行以下操作：
   - `npm install` - 安装依赖
   - `npm run build` - 构建前端
   - 部署静态文件

   中文：Zeabur 会自动执行上述步骤
   English: Zeabur will automatically execute the steps above

4. 等待 3-5 分钟，部署完成

   中文：等待 3-5 分钟
   English: Wait 3-5 minutes

5. 服务状态变为 **"● Running"**（运行中）

   中文：状态变为绿色 "● Running"
   English: Status changes to green **"● Running"**

### 步骤 6：获取前端 URL

1. 在服务卡片上，找到前端的公开 URL

   中文：在服务卡片上找到前端 URL
   English: Find the frontend's public URL on the service card

2. URL 格式类似：`https://your-frontend.zeabur.app`

   中文：URL 格式类似上述
   English: URL format similar to above

3. 点击 URL 在浏览器中打开

   中文：点击 URL 在浏览器中打开
   English: Click the URL to open it in a browser

4. 复制这个 URL，下一步配置 CORS 时需要用到

   中文：复制这个 URL，下一步需要使用
   English: Copy this URL, you'll need it in the next step

---

## 配置 CORS

### 步骤 1：更新后端 CORS 配置

现在需要将前端的 URL 添加到后端的 CORS 允许列表中。

有两种方法：

#### 方法 1：在 Zeabur 控制台配置（推荐）

1. 进入后端服务页面

   中文：进入后端服务页面
   English: Go to the backend service page

2. 点击 **"Environment Variables"**（环境变量）标签

   中文：点击 "Environment Variables" 标签
   English: Click the **"Environment Variables"** tab

3. 点击 **"Add Variable"**（添加变量）

   中文：点击 "Add Variable" 按钮
   English: Click the **"Add Variable"** button

4. 添加 CORS 配置：

   - **Name**：`CORS_ORIGINS`
   - **Value**：你的前端 URL

   中文：
   - 名称：CORS_ORIGINS
   - 值：你的前端 URL

   English:
   - **Name**: `CORS_ORIGINS`
   - **Value**: Your frontend URL

   例如：
   ```
   https://your-frontend.zeabur.app
   ```

5. 点击 **"Save"**（保存）

   中文：点击保存
   English: Click **"Save"**

6. 后端服务会自动重新部署

   中文：后端会自动重新部署
   English: Backend service will automatically redeploy

#### 方法 2：修改代码并推送

1. 在本地编辑 `backend/app/config.py`

   中文：本地编辑 config.py 文件
   English: Edit `backend/app/config.py` locally

2. 找到 `CORS_ORIGINS` 列表，添加前端 URL：

   ```python
   CORS_ORIGINS: List[str] = [
       "http://localhost:8096",
       "http://localhost:3000",
       "http://127.0.0.1:8096",
       "http://127.0.0.1:3000",
       "https://your-frontend.zeabur.app",  # 添加这一行
   ]
   ```

   中文：在列表中添加前端 URL
   English: Add your frontend URL to the list

3. 保存文件并推送到 GitHub：

   ```bash
   git add backend/app/config.py
   git commit -m "配置 CORS：添加前端域名"
   git push origin main
   ```

   中文：保存并推送代码
   English: Save and push the code

4. Zeabur 会自动检测到更新并重新部署

   中文：Zeabur 自动检测更新并重新部署
   English: Zeabur will automatically detect the update and redeploy

### 步骤 2：验证 CORS 配置

1. 等待后端重新部署完成

   中文：等待后端重新部署完成
   English: Wait for the backend to finish redeploying

2. 打开浏览器，访问前端 URL

   中文：在浏览器中打开前端 URL
   English: Open the frontend URL in your browser

3. 打开浏览器开发者工具（F12）

   中文：按 F12 打开开发者工具
   English: Open browser developer tools (F12)

4. 切换到 **Console**（控制台）标签

   中文：切换到 Console 标签
   English: Switch to the **Console** tab

5. 如果看到 CORS 错误，说明配置未生效

   中文：如果看到 CORS 错误说明配置有问题
   English: If you see CORS errors, the configuration is not working

6. 如果没有错误，尝试登录或访问 API

   中文：尝试登录或访问 API 测试
   English: Try to login or access the API to test

---

## 测试部署

### 步骤 1：测试后端 API

1. 打开浏览器，访问：
   ```
   https://your-backend.zeabur.app/api/docs
   ```

   中文：访问后端 API 文档页面
   English: Visit the backend API documentation page

2. 你应该看到 Swagger UI 文档页面

   中文：应该能看到 Swagger API 文档
   English: You should see the Swagger UI documentation page

3. 在文档页面测试 API：
   - 找到 `/api/health` 接口
   - 点击 **"Try it out"**
   - 点击 **"Execute"**
   - 查看响应

   中文：在文档中测试健康检查接口
   English: Test the health check endpoint in the documentation

### 步骤 2：测试前端访问

1. 打开浏览器，访问：
   ```
   https://your-frontend.zeabur.app
   ```

   中文：访问前端 URL
   English: Visit the frontend URL

2. 你应该能看到登录页面

   中文：应该能看到登录页面
   English: You should see the login page

3. 测试注册功能：
   - 输入用户名、邮箱、密码
   - 点击注册按钮
   - 检查是否成功

   中文：测试用户注册功能
   English: Test the user registration feature

4. 测试登录功能：
   - 使用注册的账号登录
   - 检查是否能成功登录

   中文：测试用户登录功能
   English: Test the user login feature

### 步骤 3：测试数据库连接

1. 登录后，创建一个测试笔记

   中文：登录后创建一个测试笔记
   English: Create a test note after logging in

2. 检查笔记是否成功保存

   中文：检查笔记是否保存成功
   English: Check if the note is saved successfully

3. 刷新页面，检查笔记是否仍然存在

   中文：刷新页面检查数据持久性
   English: Refresh the page to check data persistence

### 步骤 4：查看服务日志

1. 在 Zeabur 控制台，进入后端服务

   中文：进入后端服务页面
   English: Go to the backend service page

2. 点击 **"Logs"**（日志）标签

   中文：点击 "Logs" 标签
   English: Click the **"Logs"** tab

3. 查看日志是否有错误

   中文：检查日志是否有错误信息
   English: Check if there are any errors in the logs

4. 进入前端服务，同样查看日志

   中文：同样查看前端服务日志
   English: Also check the frontend service logs

---

## 配置自定义域名（可选）

如果你有自己的域名，可以配置自定义域名。

### 步骤 1：添加自定义域名

1. 进入前端服务页面

   中文：进入前端服务页面
   English: Go to the frontend service page

2. 点击 **"Networking"**（网络）标签

   中文：点击 "Networking" 标签
   English: Click the **"Networking"** tab

3. 找到 **"Custom Domain"**（自定义域名）部分

   中文：找到 "Custom Domain" 部分
   English: Find the **"Custom Domain"** section

4. 点击 **"Add Domain"**（添加域名）按钮

   中文：点击 "Add Domain" 按钮
   English: Click the **"Add Domain"** button

5. 输入你的域名：
   - 例如：`www.yourdomain.com` 或 `app.yourdomain.com`

   中文：输入你的域名
   English: Enter your domain name

6. 点击 **"Add"**（添加）

   中文：点击 "Add"
   English: Click **"Add"**

### 步骤 2：配置 DNS

1. Zeabur 会显示 DNS 配置信息

   中文：Zeabur 会显示 DNS 配置
   English: Zeabur will display DNS configuration

2. 记录显示的 CNAME 目标

   中文：记录 CNAME 目标地址
   English: Note down the CNAME target

3. 登录你的域名注册商（如阿里云、腾讯云、GoDaddy 等）

   中文：登录你的域名服务商
   English: Log in to your domain registrar

4. 找到 DNS 管理页面

   中文：找到 DNS 管理页面
   English: Find the DNS management page

5. 添加 CNAME 记录：

   - **Type**（类型）：`CNAME`
   - **Name**（主机记录）：`www` 或 `app`
   - **Value**（记录值）：Zeabur 提供的目标地址

   中文：
   - 类型：CNAME
   - 主机记录：www 或 app
   - 记录值：Zeabur 提供的地址

   English:
   - **Type**: `CNAME`
   - **Name**: `www` or `app`
   - **Value**: The target address provided by Zeabur

6. 保存 DNS 配置

   中文：保存 DNS 配置
   English: Save the DNS configuration

### 步骤 3：等待 DNS 生效

1. DNS 生效需要时间，通常 10 分钟到 24 小时

   中文：DNS 生效需要 10 分钟到 24 小时
   English: DNS propagation takes 10 minutes to 24 hours

2. 在 Zeabur 控制台，等待域名状态变为 **"Active"**（激活）

   中文：等待域名状态变为 "Active"
   English: Wait for the domain status to change to **"Active"**

3. 使用 DNS 检查工具验证：
   - 访问：https://dnschecker.org/
   - 输入你的域名
   - 检查是否指向 Zeabur

   中文：使用 DNS 检查工具验证
   English: Use a DNS checker tool to verify

### 步骤 4：更新环境变量

如果配置了自定义域名，需要更新环境变量：

1. 进入前端服务，修改 `VITE_API_URL`

   中文：进入前端服务修改环境变量
   English: Go to frontend service and modify environment variables

   如果后端也有自定义域名，更新为：
   ```
   https://api.yourdomain.com
   ```

   中文：如果后端也有自定义域名，相应更新
   English: If the backend also has a custom domain, update accordingly

2. 进入后端服务，更新 `CORS_ORIGINS`

   中文：进入后端服务更新 CORS 配置
   English: Go to backend service and update CORS configuration

   添加你的自定义域名：
   ```
   https://www.yourdomain.com
   ```

   中文：添加自定义域名到 CORS 列表
   English: Add your custom domain to the CORS list

---

## 常见问题排查

### 问题 1：部署失败

**症状：** 服务状态显示 **"● Failed"**（失败）

中文：服务状态显示 "● Failed"
English: Service status shows **"● Failed"**

**解决方案：**

1. 点击 **"Logs"**（日志）查看错误信息

   中文：点击 "Logs" 查看错误日志
   English: Click **"Logs"** to view error logs

2. 常见错误：
   - `ModuleNotFoundError`: 检查 `requirements.txt`
   - `SyntaxError`: 检查代码语法
   - `Connection refused`: 检查数据库连接

   中文：检查日志中的错误信息
   English: Check error messages in the logs

### 问题 2：数据库连接失败

**症状：** 后端日志显示 MySQL 连接错误

中文：后端日志显示数据库连接错误
English: Backend logs show MySQL connection errors

**解决方案：**

1. 确认后端已连接到 MySQL 服务

   中文：确认后端服务已连接 MySQL
   English: Confirm the backend is connected to MySQL service

   - 进入后端服务页面
   - 检查 **"Dependencies"** 部分
   - 应该看到 MySQL 服务

   中文：
   - 进入后端服务页面
   - 检查 Dependencies 部分
   - 应该能看到 MySQL

   English:
   - Go to the backend service page
   - Check the **"Dependencies"** section
   - You should see the MySQL service

2. 重新连接依赖：

   中文：重新连接依赖
   English: Reconnect the dependency

   - 移除 MySQL 依赖
   - 重新添加 MySQL 依赖

   中文：
   - 移除 MySQL 依赖
   - 重新添加

   English:
   - Remove the MySQL dependency
   - Add it again

### 问题 3：CORS 错误

**症状：** 浏览器控制台显示 CORS policy 错误

中文：浏览器控制台显示 CORS 策略错误
English: Browser console shows CORS policy errors

**解决方案：**

1. 确认前端 URL 已添加到 CORS_ORIGINS

   中文：确认前端 URL 已添加到 CORS 配置
   English: Confirm the frontend URL is added to CORS configuration

2. 检查 URL 格式：
   - 使用 `https://` 而不是 `http://`
   - 不要有尾部斜杠
   - 完全匹配

   中文：检查 URL 格式是否正确
   English: Check if the URL format is correct

3. 清除浏览器缓存并重试

   中文：清除浏览器缓存重试
   English: Clear browser cache and retry

---

## 部署检查清单

完成部署后，使用以下清单验证：

### 后端检查

- [ ] 后端服务状态为 **"● Running"**
- [ ] 可以访问 `/api/health` 接口
- [ ] 可以访问 `/api/docs` 查看文档
- [ ] 日志中没有错误信息
- [ ] 已连接到 MySQL 服务

中文：
- [ ] 后端服务状态为 "● Running"
- [ ] 可以访问健康检查接口
- [ ] 可以访问 API 文档
- [ ] 日志无错误
- [ ] 已连接 MySQL

English:
- [ ] Backend service status is **"● Running"**
- [ ] Can access `/api/health` endpoint
- [ ] Can access `/api/docs` documentation
- [ ] No errors in logs
- [ ] Connected to MySQL service

### 前端检查

- [ ] 前端服务状态为 **"● Running"**
- [ ] 可以在浏览器中打开前端页面
- [ ] 页面正常显示，没有 404 错误
- [ ] 可以正常注册和登录
- [ ] 可以创建和查看笔记

中文：
- [ ] 前端服务状态为 "● Running"
- [ ] 可以在浏览器打开
- [ ] 页面正常显示
- [ ] 可以注册登录
- [ ] 可以创建笔记

English:
- [ ] Frontend service status is **"● Running"**
- [ ] Can open in browser
- [ ] Page displays correctly
- [ ] Can register and login
- [ ] Can create and view notes

### 配置检查

- [ ] `VITE_API_URL` 配置正确
- [ ] `CORS_ORIGINS` 包含前端 URL
- [ ] `SECRET_KEY` 和 `JWT_SECRET_KEY` 已设置
- [ ] MySQL 服务正常运行

中文：
- [ ] VITE_API_URL 配置正确
- [ ] CORS_ORIGINS 包含前端 URL
- [ ] 密钥已配置
- [ ] MySQL 正常运行

English:
- [ ] `VITE_API_URL` is correctly configured
- [ ] `CORS_ORIGINS` includes frontend URL
- [ ] Secret keys are configured
- [ ] MySQL is running

---

## 下一步

部署完成后，你可以：

1. **监控服务**：在 Zeabur 控制台查看资源使用情况

   中文：查看资源使用情况
   English: Monitor resource usage

2. **设置告警**：配置 CPU/内存告警

   中文：配置性能告警
   English: Set up performance alerts

3. **配置备份**：启用 MySQL 自动备份

   中文：启用数据库自动备份
   English: Enable automatic MySQL backups

4. **优化性能**：根据实际使用情况调整配置

   中文：优化服务性能
   English: Optimize service performance

---

## 获取帮助

如果遇到问题：

1. 查看 [Zeabur 文档](https://zeabur.com/docs)

   中文：查看 Zeabur 官方文档
   English: Check Zeabur documentation

2. 加入 [Zeabur Discord](https://discord.gg/zeabur)

   中文：加入 Zeabur Discord 社区
   English: Join the Zeabur Discord community

3. 查看 [Zeabur FAQ](https://zeabur.com/docs/faq)

   中文：查看常见问题
   English: Check the FAQ

---

恭喜！你已经成功将个人知识库部署到 Zeabur！🎉

中文：恭喜完成部署！
English: Congratulations on your successful deployment!

---

## 使用 Zeabur AI 助理（新功能）🤖

如果你觉得手动配置太复杂，可以使用 Zeabur 的 AI 助理来简化部署流程。

### 什么是 AI 助理？

Zeabur AI 助理是一个智能助手，你可以用自然语言描述你的需求，它会自动：
- 分析你的项目结构
- 配置服务参数
- 创建必要的连接
- 开始部署服务

### 如何使用 AI 助理

#### 步骤 1：打开 AI 助理

1. 登录 Zeabur Dashboard

   中文：登录 Zeabur 控制台
   English: Log in to Zeabur Dashboard

2. 点击导航栏顶部的 **"Agent"** 按钮

   中文：点击导航栏的 "Agent" 按钮
   English: Click the **"Agent"** button in the navigation bar

3. AI 助理聊天窗口会打开

   中文：AI 助理聊天窗口打开
   English: AI Agent chat window opens

#### 步骤 2：描述你的需求

用自然语言告诉 AI 你想做什么。以下是一些示例：

**示例 1：部署 MySQL 数据库**
```
帮我部署一个 MySQL 数据库
```
或
```
Deploy a MySQL database for me
```

**示例 2：部署后端服务**
```
从我的 GitHub 仓库部署后端，仓库是 username/personal-knowledge，后端代码在 backend 目录
```
或
```
Deploy backend from my GitHub repo username/personal-knowledge, the backend code is in the 'backend' directory
```

**示例 3：部署前端服务**
```
部署前端，使用 frontend 目录，是 Vite + React 项目
```
或
```
Deploy frontend from 'frontend' directory, it's a Vite + React project
```

**示例 4：连接服务**
```
把后端连接到 MySQL 数据库
```
或
```
Connect the backend to MySQL database
```

**示例 5：配置环境变量**
```
给后端添加环境变量：APP_ENV=production, DEBUG=False
```
或
```
Add environment variables to backend: APP_ENV=production, DEBUG=False
```

#### 步骤 3：确认并部署

1. AI 会分析你的需求并给出方案

   中文：AI 分析需求并给出方案
   English: AI analyzes your requirements and provides a solution

2. 查看方案，确认无误后点击 **"确认"** 或 **"Confirm"**

   中文：查看方案，确认无误后点击确认
   English: Review the plan and click **Confirm**

3. AI 会自动创建服务并开始部署

   中文：AI 自动创建服务并开始部署
   English: AI will automatically create services and start deployment

4. 在聊天窗口中查看部署进度

   中文：在聊天窗口查看部署进度
   English: View deployment progress in the chat window

#### 步骤 4：查看结果

部署完成后，AI 会告诉你：
- 服务的访问 URL
- 部署状态
- 下一步操作建议

   中文：AI 会告诉你服务 URL、部署状态和下一步建议
   English: AI will tell you the service URL, deployment status, and next steps

### AI 助理的优势

- ✅ **无需学习配置**：不需要了解环境变量、启动命令等技术细节
- ✅ **快速部署**：几句话就能完成复杂配置
- ✅ **智能建议**：AI 会根据你的项目提供最佳实践建议
- ✅ **错误诊断**：如果部署失败，AI 会帮你分析原因并提供解决方案

### AI 助理使用技巧

1. **描述越详细越好**
   - 好的描述：`部署 Python 后端，在 backend 目录，使用 FastAPI 框架，需要连接 MySQL`
   - 不好的描述：`部署后端`

2. **使用自然语言**
   - 不需要专业术语，用日常语言描述即可
   - 中英文都可以

3. **分步进行**
   - 先部署数据库
   - 再部署后端并连接数据库
   - 最后部署前端

4. **询问 AI**
   - 不确定怎么做，可以直接问："我该如何部署 X？"
   - AI 会给出详细的步骤说明

### 何时使用 AI 助理

✅ **推荐使用 AI 助理的场景：**
- 第一次使用 Zeabur
- 不熟悉部署配置
- 快速原型验证
- 不确定如何配置某个服务

❌ **不建议使用 AI 助理的场景：**
- 需要精确控制每个配置项
- 自动化部署脚本
- 批量部署多个相似服务

---

## 使用 Zeabur CLI（新功能）💻

如果你更喜欢命令行操作，Zeabur 提供了强大的 CLI 工具。

### 什么是 Zeabur CLI？

Zeabur CLI 是一个命令行工具，让你可以在终端中完成所有部署操作，无需打开浏览器。

### 安装 Zeabur CLI

#### 方式 1：全局安装（推荐）

1. 打开终端（Terminal、PowerShell、CMD 等）

   中文：打开终端
   English: Open your terminal

2. 运行安装命令：

   ```bash
   npm install -g @zeabur/cli
   ```

   中文：运行上述命令安装 CLI
   English: Run the above command to install CLI

3. 验证安装：

   ```bash
   zeabur --version
   ```

   中文：验证安装是否成功
   English: Verify installation

4. 如果显示版本号，说明安装成功

   中文：显示版本号表示安装成功
   English: Version number displayed means installation successful

#### 方式 2：使用 npx（无需安装）

如果不想全局安装，可以使用 npx 直接运行：

```bash
npx zeabur@latest --help
```

中文：无需安装，直接使用
English: No installation required, use directly

### 登录 Zeabur

#### 步骤 1：运行登录命令

```bash
zeabur login
```

或使用 npx：

```bash
npx zeabur@latest login
```

中文：运行登录命令
English: Run login command

#### 步骤 2：浏览器授权

1. 终端会提示：

   ```
   Press Enter to open browser for login...
   ```

   中文：提示按 Enter 打开浏览器
   English: Press Enter to open browser for login

2. 按 **Enter** 键

   中文：按 Enter 键
   English: Press **Enter**

3. 默认浏览器会自动打开 Zeabur 登录页面

   中文：浏览器自动打开登录页面
   English: Browser opens login page automatically

4. 如果已经登录，点击 **"Confirm"** 或 **"确认"**

   中文：点击确认按钮
   English: Click **Confirm**

5. 返回终端，看到登录成功消息

   中文：返回终端查看登录成功消息
   English: Return to terminal to see success message

### 部署服务

#### 部署后端服务

1. 进入后端目录：

   ```bash
   cd backend
   ```

   中文：进入后端目录
   English: Navigate to backend directory

2. 运行部署命令：

   ```bash
   zeabur deploy
   ```

   中文：运行部署命令
   English: Run deploy command

3. 如果有多个项目，选择或创建项目：

   ```
   ? Select a project:
   > personal-knowledge (existing)
     Create new project
   ```

   中文：选择或创建项目
   English: Select or create a project

4. 选择服务类型（如果自动检测失败）：

   ```
   ? Select service type:
   > Python
     Node.js
     Docker
   ```

   中文：选择服务类型
   English: Select service type

5. 等待部署完成

   中文：等待部署完成
   English: Wait for deployment to complete

6. 部署成功后，终端会显示服务 URL

   中文：终端显示服务 URL
   English: Terminal displays service URL

#### 部署前端服务

1. 进入前端目录：

   ```bash
   cd frontend
   ```

2. 运行部署命令：

   ```bash
   zeabur deploy
   ```

3. 选择同一项目

4. 等待部署完成

### 常用 CLI 命令

#### 查看服务列表

```bash
zeabur list
```

或

```bash
zeabur ls
```

中文：列出所有服务
English: List all services

**输出示例：**
```
Project: personal-knowledge
├── backend (Running)
│   └── https://your-backend.zeabur.app
├── frontend (Running)
│   └── https://your-frontend.zeabur.app
└── mysql (Running)
```

#### 查看服务日志

```bash
zeabur logs backend
```

中文：查看后端服务日志
English: View backend service logs

**选项：**
- `--follow` 或 `-f`：实时跟踪日志
- `--tail 100`：只显示最后 100 行

**示例：**
```bash
# 实时跟踪日志
zeabur logs backend --follow

# 查看最后 50 行
zeabur logs backend --tail 50
```

#### 查看服务状态

```bash
zeabur status backend
```

中文：查看后端服务状态
English: Check backend service status

**输出示例：**
```
Service: backend
Status: Running
URL: https://your-backend.zeabur.app
CPU: 5%
Memory: 128MB / 512MB
Uptime: 2h 30m
```

#### 在浏览器中打开服务

```bash
zeabur open backend
```

中文：在浏览器中打开后端服务
English: Open backend service in browser

#### 查看项目信息

```bash
zeabur project info
```

中文：查看当前项目信息
English: View current project information

#### 设置环境变量

```bash
zeabur env set BACKEND APP_ENV production
```

中文：设置环境变量
English: Set environment variable

**语法：**
```bash
zeabur env set <SERVICE> <KEY> <VALUE>
```

#### 查看环境变量

```bash
zeabur env list backend
```

中文：列出环境变量
English: List environment variables

#### 删除环境变量

```bash
zeabur env remove backend DEBUG
```

中文：删除环境变量
English: Remove environment variable

### CLI 高级用法

#### 使用配置文件

在项目根目录创建 `zeabur.yaml`：

```yaml
project: personal-knowledge

services:
  - name: backend
    path: ./backend
    type: python
    env:
      APP_ENV: production
      DEBUG: "False"

  - name: frontend
    path: ./frontend
    type: nodejs
    env:
      VITE_API_URL: https://your-backend.zeabur.app
```

然后运行：
```bash
zeabur deploy --config zeabur.yaml
```

中文：使用配置文件部署
English: Deploy using config file

#### 批量部署

创建一个部署脚本 `deploy.sh`：

```bash
#!/bin/bash

# 部署后端
echo "Deploying backend..."
cd backend
zeabur deploy

# 部署前端
echo "Deploying frontend..."
cd ../frontend
zeabur deploy

echo "Deployment complete!"
```

运行：
```bash
bash deploy.sh
```

中文：批量部署脚本
English: Batch deployment script

### CLI 优势

- ✅ **快速部署**：一条命令完成部署
- ✅ **可脚本化**：集成到 CI/CD 流程
- ✅ **无 GUI 依赖**：适合服务器环境
- ✅ **高效操作**：熟练后比 Web 更快

### CLI 使用技巧

1. **Tab 自动补全**
   ```bash
   zeabur <TAB>  # 显示所有子命令
   zeabur deploy <TAB>  # 显示部署选项
   ```

2. **查看帮助**
   ```bash
   zeabur --help
   zeabur deploy --help
   ```

3. **使用环境变量**
   ```bash
   export ZEABUR_TOKEN=your-token
   zeabur deploy
   ```

4. **调试模式**
   ```bash
   zeabur deploy --verbose
   ```

### Web 部署 vs CLI 部署

| 特性 | Web 部署 | CLI 部署 |
|------|---------|---------|
| 易用性 | ⭐⭐⭐⭐⭐ 最简单 | ⭐⭐⭐ 需要命令行知识 |
| 速度 | ⭐⭐⭐ 需要点击多次 | ⭐⭐⭐⭐⭐ 一条命令 |
| 自动化 | ⭐⭐ 不易自动化 | ⭐⭐⭐⭐⭐ 易脚本化 |
| 适用场景 | 初学者、一次性部署 | 开发者、持续部署 |

---

## 其他部署方式

除了使用 Git 部署，Zeabur 还支持以下部署方式：

### 从模板部署

Zeabur 提供丰富的模板库，可以一键部署开源项目。

**可用模板：**
- WordPress（博客系统）
- n8n（工作流自动化）
- Ghost（博客平台）
- Discord Bot（Discord 机器人）
- 等等...

**如何使用：**

1. 在项目中点击 **"Add Service"**
2. 选择 **"Marketplace"**（市场）
3. 浏览或搜索你需要的模板
4. 点击模板卡片上的 **"Deploy"**
5. 等待部署完成

### 从本地项目部署

如果不想使用 Git，可以直接上传本地项目。

**如何使用：**

1. 在项目中点击 **"Add Service"**
2. 选择 **"Local Project"**（本地项目）
3. 拖放项目文件夹到上传区域
4. 或点击 **"Browse"** 选择文件夹
5. Zeabur 会自动分析并部署

**限制：**
- ❌ 无法享受自动 CI/CD
- ❌ 更新需要重新上传

### 从 Docker 镜像部署

如果你有 Docker 镜像，可以直接部署。

**如何使用：**

1. 在项目中点击 **"Add Service"**
2. 选择 **"Docker Image"**（Docker 镜像）
3. 输入镜像名称，例如：
   - `nginx:latest`
   - `your-dockerhub-username/your-image:tag`
4. 配置端口和环境变量
5. 点击 **"Deploy"**

**支持来源：**
- Docker Hub
- GitHub Container Registry (ghcr.io)
- GitLab Container Registry
- 其他公共或私有镜像仓库

### 使用函数（Serverless）

对于简单的脚本或 API，可以使用 Zeabur Functions。

**如何使用：**

1. 在项目中点击 **"Add Service"**
2. 选择 **"Function"**（函数）
3. 选择语言：JavaScript 或 Python
4. 在线编写代码
5. 部署后会获得一个 HTTP 端点

**适用场景：**
- 简单的 API 端点
- 数据处理脚本
- Webhook 处理
- 轻量级微服务

### 从 Cursor IDE 部署

如果你使用 Cursor IDE，可以无缝集成 Zeabur。

**如何使用：**

1. 在 Cursor 中打开你的项目
2. 安装 Zeabur 扩展
3. 点击扩展图标
4. 选择部署选项
5. 一键部署

**优势：**
- ✅ 无需离开 IDE
- ✅ 直接部署当前项目
- ✅ 查看部署日志

---

## 进阶功能

### 项目设置

#### 重命名项目

1. 进入项目页面
2. 点击项目名称旁的 **设置** 图标
3. 输入新名称
4. 保存

#### 设置预算

1. 进入项目设置
2. 选择 **"Budget"**（预算）
3. 设置每月最大消费
4. 保存

这样可以防止意外超支。

#### 邀请团队成员

1. 进入项目设置
2. 选择 **"Members"**（成员）
3. 输入成员邮箱
4. 选择权限（Read/Write/Admin）
5. 发送邀请

### 监控和告警

#### 查看资源使用

1. 进入服务页面
2. 点击 **"Monitoring"**（监控）
3. 查看 CPU、内存、网络使用情况

#### 设置告警

1. 进入服务设置
2. 选择 **"Alerts"**（告警）
3. 配置告警规则：
   - CPU 使用率 > 80%
   - 内存使用率 > 90%
   - 服务宕机
4. 设置通知方式（邮件、Discord、Webhook）

### 备份和恢复

#### 自动备份

MySQL 服务支持自动备份：

1. 进入 MySQL 服务
2. 点击 **"Backups"**（备份）
3. 启用 **"Auto Backup"**（自动备份）
4. 设置备份频率和保留时间

#### 手动备份

1. 进入 MySQL 服务
2. 点击 **"Backups"**
3. 点击 **"Create Backup"**（创建备份）
4. 等待备份完成

#### 恢复备份

1. 进入 MySQL 服务
2. 点击 **"Backups"**
3. 选择要恢复的备份
4. 点击 **"Restore"**（恢复）
5. 确认操作

---

## 总结和建议

### 部署方式选择建议

根据不同场景选择合适的部署方式：

| 场景 | 推荐方式 | 原因 |
|------|---------|------|
| **初次部署** | AI 助理 🤖 | 最简单，学习成本低 |
| **日常开发** | Git 部署 ⭐ | 自动 CI/CD，推送即部署 |
| **生产环境** | CLI 部署 💻 | 可脚本化，易于集成 CI/CD |
| **快速原型** | 模板部署 | 一键部署，无需代码 |
| **临时测试** | 本地项目 | 快速上传，无需 Git |

### 最佳实践

1. **使用环境变量管理配置**
   - 不要硬编码配置
   - 敏感信息使用环境变量

2. **启用自动备份**
   - 数据库定期备份
   - 重要数据多份保留

3. **监控服务状态**
   - 设置资源告警
   - 定期查看日志

4. **使用 Git 管理代码**
   - 版本控制
   - 回滚方便

5. **定期更新依赖**
   - 安全补丁
   - 新功能特性

### 学习路径

**新手：**
1. 先使用 AI 助理完成第一次部署
2. 了解基本概念（项目、服务、环境变量）
3. 尝试使用 Web 界面手动部署
4. 学习查看日志和监控

**进阶：**
1. 使用 Git 部署，体验自动 CI/CD
2. 学习配置环境变量和依赖关系
3. 了解自定义域名和 SSL
4. 掌握备份和恢复

**高级：**
1. 使用 CLI 进行日常部署
2. 编写自动化脚本
3. 集成到 CI/CD 流程
4. 优化性能和成本

### 获取帮助

如果遇到问题：

1. **查看文档**
   - [Zeabur 官方文档](https://zeabur.com/docs)
   - [常见问题 FAQ](https://zeabur.com/docs/faq)

2. **加入社区**
   - [Zeabur Discord](https://discord.gg/zeabur)
   - 在 `#help` 频道提问

3. **提交问题**
   - [GitHub Issues](https://github.com/zeabur/zeabur/issues)
   - 描述详细问题和重现步骤

4. **联系支持**
   - Pro 用户可以提交工单
   - 邮件支持：support@zeabur.com

---

恭喜！你已经掌握了 Zeabur 的多种部署方式！🎉

中文：恭喜你完成了 Zeabur 部署指南的学习！
English: Congratulations on completing the Zeabur deployment guide!

**下一步建议：**
- 实践部署你的第一个项目
- 尝试不同的部署方式
- 探索 Zeabur 的高级功能

**Happy Deploying!** 🚀
