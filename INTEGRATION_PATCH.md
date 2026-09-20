# Integration patch for existing static pages

Apply these two includes to:
- `index.html`
- `index-v2.html`
- `ai-signal-saas.html`

Inside `<head>` before `</head>`:

```html
<link rel="stylesheet" href="css/queenie-ai.css?v=20260919-qai-v1" />
```

Before `</body>`:

```html
<script src="js/queenie-ai.js?v=20260919-qai-v1"></script>
```

Cloudflare Pages function:
- `functions/api/queenie-ai.js`
- endpoint: `/api/queenie-ai`

Optional environment variables:
- `QWEN_API_KEY`
- `QWEN_MODEL=qwen-flash`

Without the API key, the frontend and function both fall back to deterministic portfolio answers, so the assistant still works.
