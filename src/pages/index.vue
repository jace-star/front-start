<route lang="yaml">
meta:
  title: AI 对话
</route>

<script setup lang="ts">
import ChatComposer from "@/components/chat/ChatComposer.vue";
import ChatMessages from "@/components/chat/ChatMessages.vue";
import ChatSidebar from "@/components/chat/ChatSidebar.vue";
import { useChat } from "@/composables/useChat";

defineOptions({
  name: "HomePage",
});

const {
  sessions,
  activeSessionId,
  messages,
  hasStarted,
  isStreaming,
  sidebarCollapsed,
  isNarrowScreen,
  toggleSidebar,
  collapseSidebar,
  newChat,
  selectSession,
  send,
} = useChat();
</script>

<template>
  <div class="chat-page">
    <ChatSidebar
      :sessions="sessions"
      :active-session-id="activeSessionId"
      :collapsed="sidebarCollapsed"
      :narrow="isNarrowScreen"
      @new-chat="newChat"
      @select="selectSession"
      @close="collapseSidebar"
      @toggle="toggleSidebar"
    />

    <section class="chat-main">
      <div v-if="!hasStarted" class="chat-empty">
        <h2 class="chat-empty__heading">
          从一条消息开始
        </h2>
        <ChatComposer
          :disabled="isStreaming"
          placeholder="随便问点什么…"
          @submit="send"
        />
      </div>

      <template v-else>
        <ChatMessages :messages="messages" :streaming="isStreaming" />
        <div class="chat-main__footer">
          <ChatComposer
            compact
            :disabled="isStreaming"
            @submit="send"
          />
        </div>
      </template>
    </section>
  </div>
</template>

<style scoped>
.chat-page {
  display: flex;
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
  background: rgb(248 250 252);
  color: rgb(15 23 42);
}

.chat-main {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
}

.chat-empty {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px 20px 64px;
  text-align: center;
}

.chat-empty__heading {
  margin: 0;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 650;
  letter-spacing: -0.03em;
  color: rgb(15 23 42);
}

.chat-main__footer {
  display: flex;
  justify-content: center;
  padding: 8px 20px 20px;
}
</style>
