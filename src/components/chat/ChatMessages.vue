<script setup lang="ts">
import type { ChatMessage } from "@/composables/useChat";
import { nextTick, ref, watch } from "vue";
import ChatMarkdown from "@/components/ChatMarkdown.vue";

defineOptions({ name: "ChatMessages" });

const props = defineProps<{
  messages: ChatMessage[];
  streaming?: boolean;
}>();

const scrollerRef = ref<HTMLElement | null>(null);

watch(
  () => [props.messages.length, props.messages.at(-1)?.content],
  async () => {
    await nextTick();
    const el = scrollerRef.value;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  },
);
</script>

<template>
  <div ref="scrollerRef" class="chat-messages">
    <div class="chat-messages__inner">
      <article
        v-for="message in messages"
        :key="message.id"
        class="chat-message"
        :class="`is-${message.role}`"
      >
        <div class="chat-message__body">
          <template v-if="message.role === 'assistant'">
            <ChatMarkdown
              :text="message.content"
              :loading="streaming && !message.content"
            />
          </template>
          <p v-else class="chat-message__text">
            {{ message.content }}
          </p>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.chat-messages {
  flex: 1;
  overflow: auto;
  padding: 24px 20px 12px;
}

.chat-messages__inner {
  display: flex;
  width: min(760px, 100%);
  flex-direction: column;
  gap: 18px;
  margin: 0 auto;
}

.chat-message {
  display: flex;
  max-width: 85%;
  flex-direction: column;
}

.chat-message.is-user {
  align-self: flex-end;
}

.chat-message.is-assistant {
  align-self: flex-start;
}

.chat-message.is-user .chat-message__body {
  border-radius: 14px;
  background: rgb(37 99 235);
  color: rgb(255 255 255);
  padding: 10px 14px;
}

.chat-message.is-assistant .chat-message__body {
  background: transparent;
  color: rgb(15 23 42);
}

.chat-message__text {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
