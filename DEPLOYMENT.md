# A-tech 行程管理系统 - 部署指南

## 📦 部署架构

- **前端：** Vercel（免费）
- **后端：** Railway（免费额度 $5/月，足够小型应用使用）

---

## 🚀 部署步骤

### 第一步：准备 Git 仓库

1. 在 GitHub 创建一个新仓库（公开或私有都可以）

2. 初始化并推送代码：

```bash
cd /Users/Min/.claude/skills/frontend-design/atech-travel-system

# 初始化 git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: A-tech Travel System"

# 关联远程仓库（替换成你的仓库地址）
git remote add origin https://github.com/你的用户名/atech-travel-system.git

# 推送
git push -u origin main
```

---

### 第二步：部署后端到 Railway

1. **访问 Railway**
   - 打开 https://railway.app/
   - 使用 GitHub 账号登录

2. **创建新项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择你刚才创建的仓库
   - 选择 `backend` 目录

3. **配置环境变量**
   在 Railway 项目设置中添加以下环境变量：
   ```
   PORT=5000
   JWT_SECRET=你的随机密钥（建议使用强密码生成器）
   NODE_ENV=production
   ```

4. **获取后端 URL**
   - Railway 会自动生成一个 URL，类似：`https://你的项目名.up.railway.app`
   - 复制这个 URL，后面会用到

5. **初始化数据库**
   - 在 Railway 控制台中运行：`npm run init-db`
   - 或者手动上传 database.json 文件

---

### 第三步：部署前端到 Vercel

1. **访问 Vercel**
   - 打开 https://vercel.com/
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New..." → "Project"
   - 选择你的 GitHub 仓库
   - 选择 `frontend` 目录作为根目录

3. **配置构建设置**
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

4. **配置环境变量**
   在 Vercel 项目设置中添加：
   ```
   REACT_APP_API_URL=https://你的Railway后端URL/api
   ```
   ⚠️ 注意：替换成第二步中获取的 Railway URL，并加上 `/api` 后缀

5. **部署**
   - 点击 "Deploy"
   - 等待构建完成（约 2-3 分钟）

6. **获取前端 URL**
   - Vercel 会生成一个 URL，类似：`https://你的项目名.vercel.app`

---

### 第四步：配置 CORS

回到 Railway 后端项目，需要更新 CORS 配置：

1. 在 Railway 环境变量中添加：
   ```
   FRONTEND_URL=https://你的Vercel前端URL
   ```

2. 或者直接修改 `backend/server.js` 中的 CORS 配置：
   ```javascript
   app.use(cors({
     origin: 'https://你的Vercel前端URL',
     credentials: true
   }));
   ```

---

## ✅ 完成！

现在你可以：
- 访问前端 URL：`https://你的项目名.vercel.app`
- 分享给任何人使用
- 每次推送代码到 GitHub，Vercel 和 Railway 会自动重新部署

---

## 📊 演示账号

系统已预置以下账号：

- **销售：** sales1 / 123456
- **运营：** ops1 / 123456
- **供应商：** supplier1 / 123456

---

## 💰 费用说明

- **Vercel：** 完全免费（个人项目）
- **Railway：** 
  - 免费额度：$5/月
  - 小型应用足够使用
  - 超出后按使用量计费（约 $0.000463/分钟）

---

## 🔧 本地开发

如果需要在本地继续开发：

```bash
# 后端
cd backend
npm install
npm run dev

# 前端
cd frontend
npm install
npm start
```

---

## 📝 注意事项

1. **数据持久化：** Railway 使用文件存储（database.json），重启后数据会保留
2. **安全性：** 记得修改 JWT_SECRET 为强密码
3. **域名：** 可以在 Vercel 和 Railway 中绑定自定义域名
4. **监控：** Railway 提供日志和监控功能
5. **备份：** 定期备份 database.json 文件

---

## 🆘 常见问题

**Q: 前端无法连接后端？**
- 检查 REACT_APP_API_URL 是否正确
- 检查 Railway 后端是否正常运行
- 检查 CORS 配置

**Q: Railway 超出免费额度？**
- 可以升级到付费计划
- 或者迁移到其他平台（Render, Fly.io）

**Q: 如何添加新用户？**
- 目前需要手动修改 database.json
- 或者在后端添加注册接口

---

## 📞 技术支持

如有问题，可以：
1. 查看 Railway 和 Vercel 的部署日志
2. 检查浏览器控制台错误信息
3. 查看后端 API 响应状态
