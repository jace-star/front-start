<script setup lang="ts">
import { computed } from "vue";

defineOptions({ name: "Flex" });

const props = withDefaults(
  defineProps<{
    /** 主轴方向 */
    direction?: "row" | "column";
    /** 交叉轴对齐 */
    align?: "start" | "center" | "end" | "stretch" | "baseline";
    /** 主轴对齐 */
    justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
    /** 是否换行；`reverse` 为反向换行 */
    wrap?: boolean | "reverse";
    /** 间距；数字按 px */
    gap?: number | string;
    /** 使用 inline-flex */
    inline?: boolean;
    /** 根节点标签 */
    tag?: string;
  }>(),
  {
    direction: "row",
    align: "stretch",
    justify: "start",
    wrap: false,
    inline: false,
    tag: "div",
  },
);

const rootClass = computed(() => [
  props.inline ? "inline-flex" : "flex",
  props.direction === "column" ? "flex-col" : "flex-row",
  `items-${props.align}`,
  `justify-${props.justify}`,
  props.wrap === "reverse" ? "flex-wrap-reverse" : props.wrap ? "flex-wrap" : "flex-nowrap",
]);

const gapStyle = computed(() => {
  if (props.gap === undefined || props.gap === "") {
    return undefined;
  }
  return { gap: typeof props.gap === "number" ? `${props.gap}px` : props.gap };
});
</script>

<template>
  <component :is="tag" :class="rootClass" :style="gapStyle">
    <slot />
  </component>
</template>
