# 🚀 A-tech 行程管理系统 - 快速部署指南

## 📋 部署前准备

你的代码已经准备好了，位置在：
```
/Users/Min/.claude/skills/frontend-design/atech-travel-system
```

Git 仓库已初始化并提交完成 ✅

---

## 第一步：上传到 GitHub（5分钟）

### 1. 创建 GitHub 仓库

1. 打开浏览器，访问：https://github.com/new
2. 填写仓库信息：
   - **Repository name:** `atech-travel-system`（或你喜欢的名字）
   - **Description:** A-tech 行程管理系统
   - **Public/Private:** 选择 Public（公开）或 Private（私有）都可以
   - ⚠️ **不要勾选** "Add a README file"（我们已经有了）
3. 点击 **"Create repository"**

### 2. 推送代码到 GitHub

创建完仓库后，GitHub 会显示一个页面，复制你的仓库 URL（类似 `https://github.com/你的用户名/atech-travel-system.git`）

然后在终端执行：

```bash
cd /Users/Min/.claude/skills/frontend-design/atech-travel-system

# 关联远程仓库（替换成你的仓库 URL）
git remote add origin https://github.com/你的用户名/atech-travel-system.git

# 推送代码
git push -u origin main
```

如果推送失败，可能需要先登录 GitHub：
```bash
# 如果没有配置 Git 用户信息
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"

# 如果需要认证，使用 Personal Access Token
# 在 GitHub Settings > Developer settings > Personal access tokens 创建
```

✅ 完成后，刷新 GitHub 页面，应该能看到所有代码文件

---

## 第二步：部署后端到 Railway（10分钟）

### 1. 注册/登录 Railway

1. 访问：https://railway.app/
2. 点击右上角 **"Login"**
3. 选择 **"Login with GitHub"**（用你的 GitHub 账号登录）
4. 授权 Railway 访问你的 GitHub

### 2. 创建新项目

1. 登录后，点击 **"New Project"**
2. 选择 **"Deploy from GitHub repo"**
3. 如果是第一次使用，需要点击 **"Configure GitHub App"** 授权访问仓库
4. 选择你刚才创建的仓库：`atech-travel-system`
5. Railway 会自动检测到项目

### 3. 配置后端服务

1. Railway 可能会自动检测到两个目录（frontend 和 backend），选择 **backend** 目录
2. 或者点击项目后，点击 **"Settings"**，设置：
   - **Root Directory:** `backend`
   - **Start Command:** `node server.js`

### 4. 添加环境变量

1. 在项目页面，点击 **"Variables"** 标签
2. 点击 **"New Variable"**，添加以下变量：

```
PORT=5000
JWT_SECRET=atech_2026_super_secret_key_change_this_in_production
NODE_ENV=production
```

⚠️ **重要：** JWT_SECRET 建议改成一个随机的强密码

### 5. 初始化数据库

1. 在 Railway 项目页面，点击 **"Deployments"** 标签
2. 等待部署完成（绿色 ✓）
3. 点击部署记录，找到 **"View Logs"**
4. 在项目页面找到 **"Settings"** > **"Networking"**
5. 点击 **"Generate Domain"** 生成公网域名
6. 复制生成的域名（类似：`atech-backend-production-xxxx.up.railway.app`）

### 6. 初始化演示数据

方式一：通过 Railway CLI（如果安装了）
```bash
railway run npm run init-db
```

方式二：手动上传 database.json
1. 在本地运行：`cd backend && node init-db.js`
2. 会生成 `database.json` 文件
3. 在 Railway 项目中，通过文件管理器上传这个文件

✅ **后端部署完成！** 记下你的后端 URL：`https://你的域名.up.railway.app`

---

## 第三步：部署前端到 Vercel（5分钟）

### 1. 注册/登录 Vercel

1. 访问：https://vercel.com/
2. 点击右上角 **"Sign Up"** 或 **"Login"**
3. 选择 **"Continue with GitHub"**（用你的 GitHub 账号登录）
4. 授权 Vercel 访问你的 GitHub

### 2. 导入项目

1. 登录后，点击 **"Add New..."** > **"Project"**
2. 在 **"Import Git Repository"** 中找到 `atech-travel-system`
3. 点击 **"Import"**

### 3. 配置项目

在配置页面填写：

**Framework Preset:** `Create React App`

**Root Directory:** 点击 **"Edit"**，选择 `frontend` 目录

**Build and Output Settings:**
- Build Command: `npm run build`（默认）
- Output Directory: `build`（默认）
- Install Command: `npm install`（默认）

### 4. 添加环境变量

在 **"Environment Variables"** 部分，添加：

**Key:** `REACT_APP_API_URL`  
**Value:** `https://你的Railway后端域名/api`

⚠️ **重要：** 
- 替换成第二步中获得的 Railway 后端 URL
- 记得加上 `/api` 后缀
- 例如：`https://atech-backend-production-xxxx.up.railway.app/api`

### 5. 部署

1. 点击 **"Deploy"**
2. 等待构建完成（约 2-3 分钟）
3. 构建成功后，Vercel 会显示 **"Congratulations!"**
4. 点击 **"Visit"** 或复制显示的 URL

✅ **前端部署完成！** 你的网站 URL：`https://你的项目名.vercel.app`

---

## 第四步：配置 CORS（重要！）

前端和后端部署完成后，需要配置跨域访问：

### 方式一：通过 Railway 环境变量

1. 回到 Railway 后端项目
2. 在 **"Variables"** 中添加：

```
FRONTEND_URL=https://你的Vercel前端URL
```

3. 保存后，Railway 会自动重新部署

### 方式二：修改代码（如果方式一不生效）

1. 编辑 `backend/server.js`，找到 `app.use(cors());`
2. 改为：
```javascript
app.use(cors({
  origin: 'https://你的Vercel前端URL',
  credentials: true
}));
```
3. 提交并推送代码：
```bash
git add backend/server.js
git commit -m "Update CORS configuration"
git push
```
4. Railway 和 Vercel 会自动重新部署

---

## 🎉 完成！

现在你可以：

1. **访问你的网站：** `https://你的项目名.vercel.app`
2. **分享给任何人使用**
3. **使用演示账号登录：**
   - 销售：sales1 / 123456
   - 运营：ops1 / 123456
   - 供应商：supplier1 / 123456

---

## 📊 部署信息汇总

| 项目 | 平台 | URL | 费用 |
|------|------|-----|------|
| 前端 | Vercel | https://你的项目名.vercel.app | 免费 |
| 后端 | Railway | https://你的域名.up.railway.app | $5/月免费额度 |

---

## 🔧 后续维护

### 更新代码

每次修改代码后：
```bash
cd /Users/Min/.claude/skills/frontend-design/atech-travel-system
git add .
git commit -m "描述你的修改"
git push
```

推送后，Vercel 和 Railway 会**自动重新部署**（约 2-3 分钟）

### 查看日志

- **Vercel 日志：** 项目页面 > Deployments > 点击部署记录 > View Function Logs
- **Railway 日志：** 项目页面 > Deployments > 点击部署记录 > View Logs

### 绑定自定义域名

- **Vercel：** 项目 Settings > Domains > Add Domain
- **Railway：** 项目 Settings > Networking > Custom Domain

---

## ❓ 常见问题

### Q: 前端显示"无法连接到服务器"？
**A:** 检查：
1. Railway 后端是否部署成功
2. Vercel 环境变量 `REACT_APP_API_URL` 是否正确
3. Railway 后端 URL 是否加了 `/api` 后缀
4. CORS 是否配置正确

### Q: 登录后显示 401 错误？
**A:** 检查：
1. Railway 环境变量 `JWT_SECRET` 是否设置
2. 后端数据库是否初始化（是否有 database.json）

### Q: Railway 提示超出免费额度？
**A:** 
- Railway 免费额度是 $5/月
- 小型应用足够使用
- 可以升级到付费计划（$5/月起）
- 或迁移到其他平台（Render, Fly.io）

### Q: 如何添加新用户？
**A:** 
- 目前需要手动修改 database.json
- 或者在后端添加注册接口

---

## 📞 需要帮助？

如果遇到问题：
1. 检查 Railway 和 Vercel 的部署日志
2. 检查浏览器控制台错误信息
3. 确认所有环境变量配置正确
4. 确认 CORS 配置正确

---

**祝部署顺利！🚀**
