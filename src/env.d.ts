/// <reference types="vite/client" />

/** 全局类型增强（仅类型，不参与运行时） */

declare module "vue-router" {
  /** 页面 `<route>` 中的 meta 字段 */
  interface RouteMeta {
    /** 页面标题 → title 守卫 */
    title?: string;
    /** 重定向路径，支持 `:param` → redirect 守卫 */
    redirect?: string;
  }
}

export {};
