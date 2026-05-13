# A-tech 行程管理系统

一个完整的票务申请和行程管理系统，支持销售、运营和供应商三种角色的协同工作流。

## ✨ 功能特性

- 🎯 **完整工作流**：订单创建 → 审核 → 订票 → 完成
- 🔄 **退改签管理**：支持订单的退改签申请和审核
- 👥 **多角色权限**：销售、运营支持、第三方供应商
- 📊 **数据统计**：实时统计面板和数据可视化
- 📝 **操作日志**：完整的操作历史记录
- 🎨 **现代化 UI**：深色主题，流畅动画

## 🚀 快速开始

### 本地运行

**后端：**
```bash
cd backend
npm install
npm run init-db  # 初始化数据库
npm start        # 启动后端服务（端口 5000）
```

**前端：**
```bash
cd frontend
npm install
npm start        # 启动前端服务（端口 3000）
```

访问 http://localhost:3000

### 演示账号

- **销售：** sales1 / 123456
- **运营：** ops1 / 123456
- **供应商：** supplier1 / 123456

## 📦 部署到生产环境

详细部署指南请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

推荐方案：
- **前端：** Vercel（免费）
- **后端：** Railway（免费额度）

## 🛠️ 技术栈

**前端：**
- React 18 + TypeScript
- React Router v6
- Axios
- Framer Motion
- date-fns

**后端：**
- Node.js + Express
- JWT 认证
- bcryptjs 密码加密
- JSON 文件存储

## 📁 项目结构

```
atech-travel-system/
├── frontend/              # 前端项目
│   ├── src/
│   │   ├── components/   # 可复用组件
│   │   ├── pages/        # 页面组件
│   │   ├── contexts/     # React Context
│   │   ├── utils/        # 工具函数
│   │   └── types/        # TypeScript 类型
│   ├── public/
│   └── package.json
│
├── backend/              # 后端项目
│   ├── server.js        # Express 服务器
│   ├── init-db.js       # 数据库初始化
│   ├── database.json    # 数据存储
│   └── package.json
│
├── DEPLOYMENT.md        # 部署指南
└── README.md           # 项目说明
```

## 🔐 权限说明

| 角色 | 权限 |
|------|------|
| 销售 | 创建订单、查看自己的订单、申请退改签 |
| 运营 | 查看所有订单、审核订单、审核退改签申请 |
| 供应商 | 查看所有订单、填写订票信息 |

## 📊 业务流程

### 正向流程
1. 销售创建票务申请
2. 运营审核申请（通过/拒绝）
3. 第三方供应商填写订票信息
4. 订单完成

### 逆向流程（退改签）
1. 销售申请退改签
2. 运营审核退改签申请
3. 供应商处理退改签
4. 完成

## 🔧 开发

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0

### 环境变量

**前端 (.env)：**
```
REACT_APP_API_URL=http://localhost:5000
```

**后端 (.env)：**
```
PORT=5000
JWT_SECRET=your_secret_key
NODE_ENV=development
```

## 📝 API 文档

### 认证
- `POST /api/auth/login` - 用户登录

### 订单
- `GET /api/orders` - 获取订单列表
- `GET /api/orders/:id` - 获取订单详情
- `POST /api/orders` - 创建订单
- `POST /api/orders/:id/review` - 审核订单

### 订票信息
- `POST /api/orders/:id/booking` - 填写订票信息

### 退改签
- `GET /api/change-requests` - 获取退改签列表
- `POST /api/change-requests` - 创建退改签申请
- `POST /api/change-requests/:id/review` - 审核退改签

### 统计
- `GET /api/stats` - 获取统计数据

## 🐛 问题反馈

如遇到问题，请检查：
1. Node.js 版本是否 >= 18
2. 端口 3000 和 5000 是否被占用
3. 环境变量是否正确配置
4. 数据库文件是否已初始化

## 📄 许可证

MIT License
