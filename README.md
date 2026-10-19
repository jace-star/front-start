# front-start

Vue 3 + TypeScript + Vite 前端脚手架。

## 技术栈

- Vue 3 / Vue Router（文件路由）/ Pinia
- Vite + UnoCSS + Element Plus
- markstream-vue + KaTeX（AI 对话 Markdown / 公式渲染）
- Axios 请求封装（`src/utils/request.ts`）

## 开始

```bash
pnpm install
pnpm dev
```

```bash
pnpm build
pnpm preview
```

## 目录

- `src/pages` — 页面（约定式路由，History 模式）
- `src/layouts` — 布局（`vite-plugin-vue-layouts`，默认 `default`）
- `src/components` / `src/composables` — 可复用组件与组合式逻辑（含 `ChatMarkdown`）
- `src/utils/request.ts` — HTTP 封装；业务接口可按需新建 `src/service`
- `src/store` — 状态（Pinia）
- `src/config.ts` — 应用默认配置

## 路由说明

- History 模式：`createWebHistory`；生产环境需将未知路径回退到 `index.html`
- 页面放在 `src/pages`；可用 `<route lang="yaml">` 配置 `meta.title` / `meta.redirect`
- `meta.title` 会同步到浏览器标签；未匹配路径由 `src/pages/[...path].vue` 承接
