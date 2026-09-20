# Queenie AI V1

## 当前状态
- 已接入 `index.html`、`index-v2.html`、`ai-signal-saas.html`。
- 前端优先调用 `/api/queenie-ai`。
- API 不可用、或 Qwen 环境变量没配好时，自动切换本地作品知识库，客服仍可正常回答基础问题。
- API Key 只放服务端环境变量，不进入前端源码。

## 推荐部署方式：Cloudflare Pages `_worker.js`
项目根目录现在包含 `_worker.js`。它只拦截 `/api/queenie-ai`，其余请求全部交给 `env.ASSETS.fetch(request)` 返回原静态网站。

Cloudflare 当前支持用 `_worker.js` 做 Pages Advanced Mode；相比 `/functions`，它更适合你的现有静态项目，并且 Direct Upload / drag-and-drop 也支持 `_worker.js`。

### 不配置模型也能用
不配置任何 Qwen 环境变量时：
- 页面右下角客服正常打开；
- 使用本地作品知识库回答；
- 模型 Token 成本为 0。

### 开启 Qwen 智能回答
在 Cloudflare Pages 项目的环境变量里添加：

- `QWEN_API_KEY`：阿里云 Model Studio API Key
- `QWEN_BASE_URL`：OpenAI-compatible base URL，**填到 `/compatible-mode/v1` 为止，不要带 `/chat/completions`**
- `QWEN_MODEL`：可选；代码默认 `qwen3.8-flash`

阿里云当前推荐 workspace-specific endpoint。示例（按你实际地域与 WorkspaceId 替换）：

`https://{WorkspaceId}.cn-beijing.maas.aliyuncs.com/compatible-mode/v1`

代码会自动拼接 `/chat/completions`。

## 安全边界
- 单次问题最多 500 字。
- 仅带最近 8 条对话上下文。
- 单次模型回答最多约 320 tokens。
- System Prompt 限定只回答 Queenie 的公开作品、经历、能力、合作与联系方式。
- 上游 API 出错自动降级，不向访客暴露错误信息。
- 前端不保存 API Key。

## 视觉
Queenie AI 直接继承现有网站的 `--font-en`、`--font-cn` 和 `--accent`，因此会与当前 Portfolio 的米金色视觉系统保持一致。
