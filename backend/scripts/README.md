# 数据库初始化和测试

本目录包含数据库初始化和测试的辅助脚本。

## 脚本说明

### 1. init_db.py - 数据库初始化脚本
初始化数据库，创建所有表并验证结构。

```bash
python scripts/init_db.py
```

**功能：**
- 创建所有数据库表
- 验证表结构
- 显示表关系
- 检查字段完整性
- 测试数据库连接

### 2. create_test_user.py - 创建测试用户
创建测试用户和演示数据。

```bash
python scripts/create_test_user.py
```

**功能：**
- 创建测试用户 (username: `test`, password: `test123`)
- 创建演示分类（技术笔记、生活记录、工作文档）
- 创建演示标签（Python、JavaScript、React、FastAPI、SQL）

### 3. test_database.py - 数据库功能测试
测试所有数据库 CRUD 功能。

```bash
python scripts/test_database.py
```

**功能：**
- 测试所有模型的 CRUD 操作
- 验证表关系（一对一、一对多、多对多）
- 测试级联删除
- 显示数据库统计信息

## 使用流程

### 首次使用

1. **启动 MySQL 服务**
   ```bash
   # Windows
   net start MySQL
   ```

2. **初始化数据库**
   ```bash
   cd backend
   python scripts/init_db.py
   ```

3. **创建测试用户**
   ```bash
   python scripts/create_test_user.py
   ```

4. **启动后端服务**
   ```bash
   python main.py
   ```

5. **测试功能**
   - 打开浏览器访问 http://localhost:8000/docs
   - 使用测试用户登录:
     - 用户名: `test`
     - 密码: `test123`

### 验证数据库

运行数据库测试脚本验证所有功能：
```bash
python scripts/test_database.py
```

## 数据库表结构

### users (用户表)
- id: 主键
- username: 用户名（唯一）
- email: 邮箱（唯一）
- password_hash: 密码哈希
- avatar: 头像URL
- theme_preference: 主题偏好
- primary_color: 主色调
- created_at: 创建时间
- updated_at: 更新时间

### categories (分类表)
- id: 主键
- user_id: 用户ID（外键）
- name: 分类名称
- description: 分类描述
- parent_id: 父分类ID（支持树形结构）
- color: 分类颜色
- sort_order: 排序顺序
- created_at: 创建时间

### tags (标签表)
- id: 主键
- user_id: 用户ID（外键）
- name: 标签名称
- color: 标签颜色
- created_at: 创建时间

### notes (笔记表)
- id: 主键
- user_id: 用户ID（外键）
- category_id: 分类ID（外键）
- title: 标题
- content: 内容
- is_favorite: 是否收藏
- view_count: 浏览次数
- created_at: 创建时间
- updated_at: 更新时间

### note_tags (笔记标签关联表)
- id: 主键
- note_id: 笔记ID（外键）
- tag_id: 标签ID（外键）
- created_at: 创建时间

## 表关系

- **User 1:N Category**: 一个用户可以有多个分类
- **User 1:N Tag**: 一个用户可以有多个标签
- **User 1:N Note**: 一个用户可以有多篇笔记
- **Category 1:N Note**: 一个分类可以包含多篇笔记
- **Note M:N Tag**: 笔记和标签是多对多关系

## 级联删除规则

- 删除用户时，级联删除其所有分类、标签和笔记
- 删除分类时，级联删除其所有子分类和笔记
- 删除标签时，解除与所有笔记的关联
- 删除笔记时，解除与所有标签的关联
