<script setup lang="ts">
defineOptions({
  name: "DefaultLayout",
});
</script>

<template>
  <div class="text-[#0f172a] bg-[#f8fafc] h-screen min-h-screen w-full overflow-hidden">
    <RouterView />
  </div>
</template>
