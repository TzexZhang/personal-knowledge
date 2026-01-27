# 自定义域名配置指南

> 将您的域名绑定到部署的应用，提升专业度

---

## 📋 准备工作

### 需要准备的资源
- [ ] 已注册的域名（阿里云、腾讯云、Cloudflare 等）
- [ ] 部署完成的应用（Railway + Vercel）

---

## 🎨 方案一：使用 Cloudflare（推荐）

### 优势
- ✅ 完全免费
- ✅ 全球 CDN
- ✅ 免费 SSL 证书
- ✅ DDoS 防护

### 操作步骤

#### 1. 添加域名到 Cloudflare
1. 访问 [https://dash.cloudflare.com/](https://dash.cloudflare.com/)
2. 登录后点击 **"Add a Site"**
3. 输入您的域名：`your-domain.com`
4. 点击 **"Add Site"**

#### 2. 配置 DNS 记录
1. 在 Cloudflare DNS 页面
2. 删除默认的 `@` 和 `www` A 记录
3. 添加新的 CNAME 记录：

**记录 1 - 根域名**:
```
Type: CNAME
Name: @
Target: your-frontend.vercel.app
Proxy: ✅ (橙色云朵图标)
```

**记录 2 - www 子域名**:
```
Type: CNAME
Name: www
Target: your-frontend.vercel.app
Proxy: ✅
```

#### 3. 配置 SSL
1. Cloudflare 会自动提供免费 SSL 证书
2. 在 SSL/TLS 页面确认 **"Full"** 模式已启用

#### 4. 更新 DNS 服务器
到您的域名注册商（阿里云/腾讯云等）：
```
主 DNS: ada.ns.cloudflare.com
备用 DNS: kate.ns.cloudflare.com
```

#### 5. 更新 CORS 配置
在 Railway 后端环境变量中添加您的域名：
```json
["https://your-domain.com", "https://www.your-domain.com", "https://your-frontend.vercel.app"]
```

#### 6. 更新前端 API 配置
修改 `frontend/.env.production`：
```bash
VITE_API_URL=https://your-backend.up.railway.app
```

#### 7. 重新部署
```bash
git add frontend/.env.production
git commit -m "chore: update production config"
git push origin main
```

---

## 🎨 方案二：直接配置（适合 Vercel + Railway）

### 前端域名配置 (Vercel)

#### 1. 在 Vercel 添加域名
1. 进入 Vercel 项目
2. 点击 **"Settings"** → **"Domains"**
3. 点击 **"Add Domain"**
4. 输入域名：`www.your-domain.com`

#### 2. 配置 DNS
Vercel 会显示需要添加的 DNS 记录：
```
Type: CNAME
Name: www
Target: cname.vercel-dns.com
```

#### 3. 在域名注册商添加 DNS
到您的域名注册商添加上述 CNAME 记录

#### 4. 验证
1. 等待 DNS 传播（可能需要几分钟到几小时）
2. 在 Vercel 点击 **"Verify"**

### 后端域名配置 (Railway)

#### 1. 在 Railway 添加域名
1. 进入 Railway 项目
2. 点击后端 service
3. 点击 **"Settings"** → **"Domains"**
4. 点击 **"Add Domain"**
5. 输入域名：`api.your-domain.com`

#### 2. 配置 DNS
Railway 会显示需要的配置：
```
Type: CNAME
Name: api
Target: railway.app
```

#### 3. 添加 DNS 记录
到您的域名注册商或 Cloudflare 添加上述记录

#### 4. 更新 CORS 配置
在 Railway 环境变量中添加：
```json
["https://api.your-domain.com", "https://your-domain.com"]
```

#### 5. 重新部署后端

---

## 🔧 配置文件更新

### 更新 vercel.json（支持自定义域名）

将 `frontend/vercel.json` 中的域名替换为您的域名：

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-backend.railway.app/api/$1"
    },
    {
      "src": "/uploads/(.*)",
      "dest": "https://your-backend.railway.app/uploads/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 更新 .env.production

```bash
# 如果配置了自定义域名，可以改为
VITE_API_URL=https://api.your-domain.com
```

---

## 🌐 域名注册商配置指南

### 阿里云
1. 登录阿里云控制台
2. 进入 **"域名"** → **"域名列表"**
3. 点击您的域名 → **"解析设置"**
4. 添加解析记录：
   ```
   记录类型: CNAME
   主机记录: @
   记录值: your-frontend.vercel.app

   记录类型: CNAME
   主机记录: www
   记录值: your-frontend.vercel.app
   ```

### 腾讯云
1. 登录腾讯云 DNS 控制台
2. 选择您的域名 → **"DNS 解析"**
3. 添加记录：
   ```
   主机记录: @
   记录类型: CNAME
   记录值: your-frontend.vercel.app

   主机记录: www
   记录类型: CNAME
   记录值: your-frontend.vercel.app
   ```

### Cloudflare
如上面方案一所述

---

## ✅ 验证配置

### 1. 检查 DNS 传播
```bash
# Windows
nslookup your-domain.com

# Linux/Mac
dig your-domain.com
```

### 2. 访问测试
1. 浏览器访问：`https://your-domain.com`
2. 测试登录功能
3. 测试 API 调用
4. 检查浏览器控制台是否有错误

### 3. SSL 证书验证
- 浏览器地址栏应显示 🔒 图标
- 点击锁图标查看证书信息

---

## 🎁 高级配置（可选）

### 配置 API 子域名

```
前端: www.your-domain.com
后端: api.your-domain.com
```

#### 操作步骤：

1. **添加 api 子域名**
   - Vercel 项目添加域名：`api.your-domain.com`
   - 按提示配置 DNS

2. **配置后端**
   - Railway 添加域名：`api.your-domain.com`
   - 按提示配置 DNS

3. **更新前端配置**
   ```bash
   VITE_API_URL=https://api.your-domain.com
   ```

4. **更新 CORS**
   ```json
   ["https://www.your-domain.com", "https://api.your-domain.com"]
   ```

---

## ⚠️ 常见问题

### Q1: DNS 传播需要多久？
**A**: 通常 10 分钟到 48 小时不等，取决于 DNS 服务器

### Q2: 如何验证 DNS 配置正确？
**A**: 使用 `nslookup` 或 `dig` 命令查询

### Q3: SSL 证书多久生效？
**A**:
- Cloudflare: 自动配置，立即生效
- Vercel: 自动配置，立即生效
- 其他: 可能需要几天时间

### Q4: 配置自定义域名后无法访问？
**A**:
1. 检查 DNS 记录是否正确
2. 等待 DNS 传播
3. 清除浏览器缓存
4. 检查 CORS 配置

---

## 📋 配置清单

- [ ] 购买域名
- [ ] 添加域名到 Vercel
- [ ] 添加域名到 Railway
- [ ] 配置 DNS 记录
- [ ] 更新 CORS 配置
- [ ] 更新前端 API URL
- [ ] 重新部署应用
- [ ] 验证功能正常
- [ ] 配置 SSL 证书

---

## 🎉 完成！

配置完成后，您的应用将可以通过自定义域名访问：
- 前端：`https://your-domain.com`
- API：`https://your-domain.com/api`

所有功能完全免费，SSL 证书自动续期！
