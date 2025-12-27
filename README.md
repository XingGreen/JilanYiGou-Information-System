# 霁岚忆构信息系统

一个现代化的创意管理平台，用于收集、组织和分享创意想法。

## 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **状态管理**: React Context API
- **HTTP客户端**: Axios (通过api服务封装)

### 后端
- **框架**: Node.js + Express
- **ORM**: Sequelize
- **数据库**: SQLite
- **认证**: JWT (JSON Web Tokens)
- **密码加密**: bcryptjs

## 项目结构

```
霁岚忆构信息系统/
├── backend/                # 后端应用
│   ├── config/            # 配置文件
│   ├── controllers/       # 控制器
│   ├── middleware/        # 中间件
│   ├── models/            # 数据模型
│   ├── routes/            # 路由
│   ├── app.js             # 应用入口
│   └── package.json       # 后端依赖
├── frontend/              # 前端应用
│   ├── src/
│   │   ├── components/    # React组件
│   │   ├── context/       # 上下文管理
│   │   ├── hooks/         # 自定义钩子
│   │   ├── pages/         # 页面组件
│   │   ├── services/      # API服务
│   │   └── types/         # TypeScript类型定义
│   ├── package.json       # 前端依赖
│   └── vite.config.ts     # Vite配置
└── README.md              # 项目说明文档
```

## 功能特性

### 用户管理
- 注册新用户
- 用户登录/注销
- JWT认证保护

### 创意管理
- 创建新创意
- 查看创意列表
- 编辑现有创意
- 删除创意
- 为创意添加标签

### 标签系统
- 创建标签
- 为创意关联多个标签
- 通过标签筛选创意

## 快速开始

### 环境要求
- Node.js (v16或更高版本)
- npm (v8或更高版本)

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone <repository-url>
   cd 霁岚忆构信息系统
   ```

2. **安装后端依赖**
   ```bash
   cd backend
   npm install
   ```

3. **配置后端环境**
   ```bash
   # 复制并编辑环境变量文件
   cp .env.example .env
   ```
   在.env文件中配置以下变量：
   ```
   PORT=3001
   JWT_SECRET=your_jwt_secret_key_here
   DB_PATH=./database.sqlite
   NODE_ENV=development
   ```

4. **安装前端依赖**
   ```bash
   cd ../frontend
   npm install
   ```

5. **配置前端API地址**
   在`frontend/src/services/api.ts`中确保API基础URL正确：
   ```typescript
   const API_BASE_URL = 'http://localhost:3000';
   ```

### 运行应用

1. **启动后端服务器**
   ```bash
   cd backend
   npm start
   ```
   后端将在 http://localhost:3001 运行

2. **启动前端开发服务器**
   ```bash
   cd frontend
   npm run dev
   ```
   前端将在 http://localhost:5173 运行

## API 接口文档

### 用户接口

| 方法 | 路径 | 功能 | 认证 |
|------|------|------|------|
| POST | /api/users/register | 注册新用户 | 否 |
| POST | /api/users/login | 用户登录 | 否 |
| GET | /api/users/me | 获取当前用户信息 | 是 |

### 创意接口

| 方法 | 路径 | 功能 | 认证 |
|------|------|------|------|
| GET | /api/ideas | 获取所有创意 | 是 |
| POST | /api/ideas | 创建新创意 | 是 |
| GET | /api/ideas/:id | 获取单个创意 | 是 |
| PUT | /api/ideas/:id | 更新创意 | 是 |
| DELETE | /api/ideas/:id | 删除创意 | 是 |

### 标签接口

| 方法 | 路径 | 功能 | 认证 |
|------|------|------|------|
| GET | /api/ideas/tags/all | 获取所有标签 | 是 |

## 数据库模型

### User
- id: 主键
- username: 用户名
- email: 邮箱
- password: 加密密码
- createdAt: 创建时间
- updatedAt: 更新时间

### Idea
- id: 主键
- title: 标题
- content: 内容
- userId: 用户ID (外键)
- createdAt: 创建时间
- updatedAt: 更新时间

### Tag
- id: 主键
- name: 标签名称
- createdAt: 创建时间
- updatedAt: 更新时间

### IdeaTag
- ideaId: 创意ID (外键)
- tagId: 标签ID (外键)

## 前端页面

- **登录页面**: /login
- **注册页面**: /register
- **创意列表**: /ideas
- **创意表单**: /ideas/new (创建)
- **创意表单**: /ideas/:id/edit (编辑)

## 开发流程

### 后端开发
1. 在`models/`中定义数据模型
2. 在`controllers/`中实现业务逻辑
3. 在`routes/`中配置API路由
4. 使用`middleware/`添加认证和授权

### 前端开发
1. 在`components/`中创建可复用组件
2. 在`pages/`中实现页面组件
3. 在`services/`中封装API请求
4. 使用`context/`管理全局状态
5. 使用`hooks/`创建自定义钩子

## 部署

### 生产环境构建

1. **构建前端**
   ```bash
   cd frontend
   npm run build
   ```
   构建后的文件将在`frontend/dist/`目录中

2. **配置后端**
   - 设置适当的JWT密钥
   - 配置CORS以允许前端访问
   - 考虑使用更强大的数据库(如PostgreSQL或MySQL)

3. **部署**
   - 可以使用PM2管理后端进程
   - 可以使用Nginx或Apache作为Web服务器
   - 可以部署到AWS、Heroku或Vercel等云平台

## 注意事项

- 开发环境中使用SQLite数据库，生产环境建议使用更可靠的数据库
- 确保JWT密钥的安全性，不要在代码中硬编码
- 定期更新依赖包以修复安全漏洞

## 许可证

ISC
