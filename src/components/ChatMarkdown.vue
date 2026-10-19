<script lang="ts" setup>
import MarkdownRender from "markstream-vue";
import remend from "remend";
import { ref, watch } from "vue";
import "markstream-vue/index.css";

defineOptions({ name: "ChatMarkdown" });

const props = withDefaults(
  defineProps<{
    text: string;
    loading?: boolean;
    contentClass?: string;
  }>(),
  {
    loading: false,
    contentClass: "",
  },
);

const content = ref("");

watch(
  () => props.text,
  (text) => {
    content.value = text ? remend(text) : "";
  },
  { immediate: true },
);
</script>

<template>
  <div
    v-loading="loading && !text"
    class="markdown-container"
    :class="[contentClass, loading && !text ? 'inline-block' : '']"
  >
    <MarkdownRender
      :content="content"
      :render-batch-size="16"
      :render-batch-delay="8"
      :max-live-nodes="0"
    />
  </div>
</template>

<style scoped>
.markdown-container {
  word-wrap: break-word;
}

.markdown-container :deep(body),
.markdown-container :deep(blockquote),
.markdown-container :deep(dl),
.markdown-container :deep(dd),
.markdown-container :deep(h1),
.markdown-container :deep(h2),
.markdown-container :deep(h3),
.markdown-container :deep(h4),
.markdown-container :deep(h5),
.markdown-container :deep(h6),
.markdown-container :deep(hr),
.markdown-container :deep(figure),
.markdown-container :deep(p),
.markdown-container :deep(pre) {
  margin: 0;
}

.markdown-container :deep(ol),
.markdown-container :deep(ul) {
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 1.5em;
}

.markdown-container :deep(li) {
  margin: 0.25em 0;
}
</style>
