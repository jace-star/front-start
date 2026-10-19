<route lang="yaml">
meta:
  title: front-start
</route>

<script setup lang="ts">
defineOptions({
  name: "HomePage",
});
</script>

<template>
  <main class="px-6 text-center flex flex-col gap-4 min-h-screen items-center justify-center">
    <h1 class="text-4xl text-[#0f172a] tracking-tight font-semibold m-0">
      front-start
    </h1>
    <p class="text-base text-[#64748b] leading-relaxed m-0 max-w-xl">
      Vue 3 + TypeScript + Vite 前端脚手架。按需组合 `src/components` 与 `src/composables` 开始业务开发。
    </p>
    <p class="text-sm text-[#94a3b8] m-0">
      开发：`pnpm dev` · 构建：`pnpm build`
    </p>
  </main>
</template>
