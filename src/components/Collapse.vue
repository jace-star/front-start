<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import { useId } from "vue";
import chevronDownIcon from "@/assets/icons/chevron-down.svg";

defineOptions({ name: "Collapse" });

const props = withDefaults(
  defineProps<{
    /** 标题文案；也可用 `#title` 插槽覆盖 */
    title?: string;
    titleIcon?: string;
    titleLoading?: boolean;
    /** 是否展开 */
    modelValue?: boolean;
    hideChevron?: boolean;
  }>(),
  {
    title: "",
    titleIcon: "",
    titleLoading: false,
    modelValue: false,
    hideChevron: false,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const expanded = useVModel(props, "modelValue", emit, { passive: true });
const panelId = useId();

function toggle() {
  expanded.value = !expanded.value;
}
</script>

<template>
  <div class="collapse">
    <button
      type="button"
      class="collapse__trigger"
      :aria-expanded="expanded"
      :aria-controls="panelId"
      @click="toggle"
    >
      <span class="collapse__title">
        <slot name="title">
          <span
            v-if="titleLoading"
            class="collapse__spinner"
            aria-hidden="true"
          />
          <img
            v-else-if="titleIcon"
            :src="titleIcon"
            alt=""
            aria-hidden="true"
            class="collapse__icon"
          >
          <span v-if="title">{{ title }}</span>
        </slot>
      </span>

      <span
        v-if="!hideChevron"
        class="collapse__chevron"
        :class="{ 'collapse__chevron--open': expanded }"
        aria-hidden="true"
      >
        <img :src="chevronDownIcon" alt="" class="collapse__chevron-img">
      </span>
    </button>

    <div
      :id="panelId"
      class="collapse__panel"
      :class="{ 'collapse__panel--open': expanded }"
      role="region"
    >
      <div class="collapse__panel-inner">
        <div class="collapse__body">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.collapse {
  box-sizing: border-box;
}

.collapse__trigger {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem;
  border: none;
  background: transparent;
  font-size: 1rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  color: inherit;
}

.collapse__trigger:focus-visible {
  outline: 2px solid #117c68;
  outline-offset: 2px;
  border-radius: 0.375rem;
}

.collapse__title {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 0.25rem;
  color: #334155;
}

.collapse__icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.collapse__chevron {
  display: inline-flex;
  align-items: center;
  color: #909399;
  transition: transform 0.25s ease;
  transform: rotate(-90deg);
}

.collapse__chevron--open {
  transform: rotate(0deg);
}

.collapse__chevron-img {
  width: 1.25rem;
  height: 1.25rem;
}

.collapse__panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.25s ease;
}

.collapse__panel--open {
  grid-template-rows: 1fr;
}

.collapse__panel-inner {
  overflow: hidden;
  min-height: 0;
}

.collapse__body {
  margin-top: 0.75rem;
}

.collapse__spinner {
  width: 14px;
  height: 14px;
  flex: 0 0 14px;
  border: 2px solid rgba(17, 124, 104, 0.18);
  border-top-color: #117c68;
  border-radius: 999px;
  box-sizing: border-box;
  animation: collapse-spin 0.72s linear infinite;
}

@keyframes collapse-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .collapse__chevron,
  .collapse__panel {
    transition: none;
  }

  .collapse__spinner {
    animation: none;
  }
}
</style>
