<script setup lang="ts">
import { nextTick, ref, watch } from "vue";

defineOptions({ name: "ChatComposer" });

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    compact?: boolean;
    placeholder?: string;
  }>(),
  {
    disabled: false,
    compact: false,
    placeholder: "问问 AI…",
  },
);

const emit = defineEmits<{
  submit: [value: string];
}>();

const value = ref("");
const textareaRef = ref<HTMLTextAreaElement | null>(null);

function resize() {
  const el = textareaRef.value;
  if (!el) {
    return;
  }
  el.style.height = "auto";
  el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
}

watch(value, async () => {
  await nextTick();
  resize();
});

function submit() {
  const text = value.value.trim();
  if (!text || props.disabled) {
    return;
  }
  emit("submit", text);
  value.value = "";
  nextTick(resize);
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    submit();
  }
}
</script>

<template>
  <form
    class="chat-composer"
    :class="{ 'is-compact': compact }"
    @submit.prevent="submit"
  >
    <textarea
      ref="textareaRef"
      v-model="value"
      class="chat-composer__input"
      rows="1"
      :disabled="disabled"
      :placeholder="placeholder"
      @keydown="onKeydown"
    />
    <button
      type="submit"
      class="chat-composer__send"
      :disabled="disabled || !value.trim()"
    >
      发送
    </button>
  </form>
</template>

<style scoped>
.chat-composer {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  width: min(720px, 100%);
  border: 1px solid rgb(203 213 225);
  border-radius: 16px;
  background: rgb(255 255 255);
  box-shadow: 0 10px 30px rgb(15 23 42 / 6%);
  padding: 10px 10px 10px 14px;
}

.chat-composer.is-compact {
  box-shadow: 0 4px 16px rgb(15 23 42 / 5%);
}

.chat-composer__input {
  flex: 1;
  min-height: 24px;
  max-height: 160px;
  border: 0;
  outline: none;
  resize: none;
  background: transparent;
  color: rgb(15 23 42);
  font: inherit;
  font-size: 14px;
  line-height: 1.5;
  padding: 8px 0;
}

.chat-composer__input::placeholder {
  color: rgb(148 163 184);
}

.chat-composer__send {
  height: 36px;
  flex-shrink: 0;
  border: 0;
  border-radius: 10px;
  background: rgb(37 99 235);
  color: white;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  padding: 0 14px;
}

.chat-composer__send:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.chat-composer__send:not(:disabled):hover {
  background: rgb(29 78 216);
}
</style>
