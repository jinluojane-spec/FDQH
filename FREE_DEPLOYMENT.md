# FDQH 免费部署方案

## 推荐结论

| 优先级 | 平台 | 适用场景 | 免费限制 |
|--------|------|----------|----------|
| 主选 | Koyeb | 传统 Express 后端，Git 或 Docker 部署 | 1 个 nano 实例，512MB RAM，0.1 CPU |
| 备用 | Render | 生态成熟，Blueprint 配置简单 | 15 分钟无请求休眠，冷启动约 30 到 60 秒 |
| 演示 | Hugging Face Spaces | Docker 一键部署，无需改代码 | 免费 CPU Space 可能休眠，数据盘非持久 |
| 轻量 | Deta Space | 自带 NoSQL 和文件存储 | 仅适合轻量 Node 服务 |
| 简单 | Bonto | 浏览器编辑器，Node 专用 | 75 小时每月，30 分钟休眠 |

## 主选方案：Koyeb + MongoDB Atlas

### 为什么选 Koyeb

1. 免费 nano 实例可以运行 Express 后端。
2. 支持 Git 和 Docker 两种部署方式。
3. 不要求绑定信用卡。
4. 对传统 Node.js 应用友好，不需要改造成 Serverless。

### 数据库

演示阶段可以直接使用 JSON 模式，但 Koyeb 免费实例没有持久磁盘，重新部署后数据会回到种子状态。

需要持久化时，建议使用 MongoDB Atlas 免费层：

1. 注册 MongoDB Atlas。
2. 创建 M0 免费集群。
3. 创建数据库用户并允许网络访问。
4. 将 `MONGODB_URI` 配置到 Koyeb 环境变量。

### Docker 部署步骤

1. 将 `fdqh-app` 推送到 GitHub 或 GitLab。
2. 注册 Koyeb。
3. 选择 Deploy from Git 或 Deploy with Docker。
4. 端口配置为 `3100`。
5. 设置环境变量 `PORT=3100`。
6. 可选设置 `MONGODB_URI`。

## 备用方案：Render

`render.yaml` 已配置 Blueprint：

```text
服务：Web Service
运行环境：Node
构建命令：npm install
启动命令：node server.js
区域：Singapore
健康检查：/
```

部署后免费 Web Service 会在无请求 15 分钟后休眠。可使用 UptimeRobot 定时访问来减少休眠。

## 演示方案：Hugging Face Spaces

`README.md` 已声明 `sdk: docker` 和 `app_port: 3100`，`Dockerfile` 可直接使用。

部署后访问 Space 的公开 URL 即可。适合产品演示、截图和功能验收，不建议作为长期生产数据库。

## 本地运行

```powershell
cd fdqh-app
node server.js
```

访问：`http://localhost:3100`

默认账号：

```text
admin / admin123
qa_manager / qa123
qa_engineer / qa123
```
