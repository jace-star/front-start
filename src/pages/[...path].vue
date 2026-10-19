<route lang="yaml">
meta:
  title: 页面不存在
</route>

<script setup lang="ts">
defineOptions({
  name: "NotFoundPage",
});
</script>

<template>
  <main class="px-6 text-center flex flex-col gap-4 min-h-screen items-center justify-center">
    <p class="text-sm text-[#94a3b8] tracking-wide m-0">
      404
    </p>
    <h1 class="text-3xl text-[#0f172a] tracking-tight font-semibold m-0">
      页面不存在
    </h1>
    <p class="text-base text-[#64748b] leading-relaxed m-0 max-w-md">
      链接可能已失效，或地址输入有误。
    </p>
    <RouterLink
      to="/"
      class="text-sm text-[#2563eb] mt-2 no-underline hover:underline"
    >
      返回首页
    </RouterLink>
  </main>
</template>
