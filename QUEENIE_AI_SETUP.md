# Queenie AI V1

## 当前状态
- 已接入首页 `index.html`、备用首页 `index-v2.html`、项目详情 `ai-signal-saas.html`。
- 前端会优先调用 `/api/queenie-ai`。
- 如果接口不可用或 Qwen API Key 未配置，会自动使用本地作品知识库回答，因此不会出现“客服完全不可用”的情况。
- API Key 只在服务端环境变量中读取，不会出现在前端源码里。

## Cloudflare Pages（当前 release 信息中已有项目 queenie-portfolio）
项目包含 `functions/api/queenie-ai.js`，部署到 Cloudflare Pages 时会形成 `/api/queenie-ai`。

需要配置的环境变量：
- `QWEN_API_KEY`：阿里云百炼 / DashScope API Key（可暂时不配；不配时使用本地知识库）
- `QWEN_MODEL`：可选，默认 `qwen-flash`

## 腾讯云静态源
如果 `queeniechu.online` 最终只指向纯静态腾讯云源，则静态页面仍能使用本地知识库回答；要启用 Qwen，需要把 `/api/queenie-ai` 反代到一个服务端函数，或切到支持 Pages Functions 的部署源。

## 安全边界
- 最多接收 500 字问题。
- 只保留最近 8 条对话上下文。
- Qwen 最大输出约 320 tokens。
- System Prompt 限定只回答 Queenie 的作品、经历、能力、合作与联系方式。
- 上游异常时自动降级，不把错误暴露给访客。
