# FDQH 免费部署方案

## 当前部署

| 项目 | 值 |
|------|----|
| 平台 | Bonto |
| 公网地址 | `https://fdqh-quality-hub.bonto.run` |
| 部署方式 | Bonto CLI 文件上传 |
| 运行模式 | Node.js + JSON 文件数据库 |
| 免费限制 | 每月 75 小时，512MB RAM，闲置休眠 |
| 数据策略 | 仅部署通用演示种子数据，不公开内部投诉和产品专用数据 |

应用访问账号和密码保存在本机：

`tools/bonto/access.txt`

## 为什么选择 Bonto

1. 免费提供 Node.js 后端运行环境。
2. 不要求绑定银行卡。
3. 支持浏览器编辑器、CLI 和 Git push-to-deploy。
4. 免费子域名格式为 `fdqh-quality-hub.bonto.run`。

## CLI 部署

安装官方 CLI：

```powershell
pnpm add @sidequestvr/bonto
```

登录：

```powershell
bonto auth login
```

创建应用：

```powershell
bonto apps create "FDQH Digital Quality Platform" fdqh-quality-hub
```

上传文件：

```powershell
bonto files upload fdqh-quality-hub server.js server.js
bonto files upload fdqh-quality-hub package.json package.json
```

重启应用：

```powershell
bonto restart fdqh-quality-hub --hard
```

查看日志：

```powershell
bonto logs fdqh-quality-hub --tail 100
```

## 数据安全

免费公网应用不部署以下内部数据：

```text
data/complaints_2026_import.json
data/qcp_colloidal_gold.json
data/qcp_molecular.json
bowling_chart_data.json
token.txt
```

应用使用 `database/init.js` 中的通用演示数据启动。需要接入正式数据时，应配置独立数据库并完成访问控制、审计追踪和验证。

## 其他平台结论

| 平台 | 当前结论 |
|------|----------|
| Koyeb | 新版控制台已不再提供原 API 令牌入口，不适合当前免费部署流程 |
| Render | 免费 Web Service 在部分账号上要求银行卡验证和 1 美元临时授权 |
| Hugging Face Spaces | Docker/Gradio Space 已变为付费功能，仅静态 Space 免费 |
| Vercel / Netlify | 适合 Serverless，不适合当前长期运行的 Express 服务 |

## 生产化建议

正式环境建议使用：

```text
托管平台：Bonto 付费实例、Render、Koyeb 或其他合规云平台
数据库：MongoDB Atlas、PostgreSQL 或企业数据库
AI 密钥：DASHSCOPE_API_KEY、DEEPSEEK_API_KEY 通过平台环境变量配置
访问控制：应用登录、RBAC、HTTPS、审计追踪
验证：URS、FRS、IQ、OQ、PQ 和 CSV 验证文件
```
