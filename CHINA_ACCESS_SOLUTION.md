# 中国访问解决方案

## 问题原因

Vercel 在中国大陆被网络封锁，导致 https://atech-travel-system.vercel.app 无法访问。

## 解决方案：使用 GitHub Pages

### 方案 1：启用 GitHub Pages（推荐）

1. 访问 GitHub 仓库设置：https://github.com/ruonuanlianyi/atech-travel-system/settings/pages

2. 在 "Source" 部分：
   - Branch: 选择 `gh-pages`
   - Folder: 选择 `/ (root)`
   - 点击 "Save"

3. 等待 1-2 分钟后，访问：
   - **https://ruonuanlianyi.github.io/atech-travel-system/**

### 方案 2：使用国内云服务商

如果 GitHub Pages 在中国访问也不稳定，可以考虑：

1. **阿里云 OSS + CDN**
   - 上传 `frontend/build` 目录到 OSS
   - 配置 CDN 加速
   - 绑定自定义域名

2. **腾讯云 COS + CDN**
   - 类似阿里云方案

3. **Cloudflare Pages**
   - 在中国的可访问性较好
   - 需要 Cloudflare 账号

## 当前部署状态

- ✅ **后端 (Railway)**: https://atech-travel-system-production.up.railway.app/api
  - 状态：正常运行，可以从中国访问
  
- ❌ **前端 (Vercel)**: https://atech-travel-system.vercel.app
  - 状态：被墙，无法从中国访问
  
- ⏳ **前端 (GitHub Pages)**: https://ruonuanlianyi.github.io/atech-travel-system/
  - 状态：已部署，需要在 GitHub 设置中启用

## 测试账号

所有账号密码都是：`123456`

- 管理员：`admin` / `123456`
- 销售：`sales1` / `123456`
- 运营：`ops1` / `123456`
- 供应商：`supplier1` / `123456`

## 技术细节

### 为什么 Vercel 被墙？

从网络诊断可以看到：
- DNS 解析正常
- 数据包在中国电信网络的第 9 跳超时
- 这是典型的 GFW（防火墙）封锁特征

### GitHub Pages 的优势

- 在中国大陆通常可以访问（虽然速度可能较慢）
- 免费且稳定
- 自动 HTTPS
- 与 GitHub 仓库集成

### 如果 GitHub Pages 也慢怎么办？

可以使用国内的镜像加速服务，或者直接部署到国内云服务商。
