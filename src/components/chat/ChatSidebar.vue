<script setup lang="ts">
import type { ChatSession } from "@/composables/useChat";
import { PanelLeft, Plus } from "@lucide/vue";
import { computed, ref } from "vue";

defineOptions({ name: "ChatSidebar" });

const props = defineProps<{
  sessions: ChatSession[];
  activeSessionId: string | null;
  collapsed: boolean;
  narrow: boolean;
}>();

const emit = defineEmits<{
  newChat: [];
  select: [id: string];
  close: [];
  toggle: [];
}>();

const railCollapsed = computed(() => props.collapsed && !props.narrow);
/** 同一时间只展示一个提示，避免快速划过时叠出多个 */
const openTip = ref<"fab" | "toggle" | "new" | null>(null);
const tipStyle = ref<Record<string, string>>({});

const tipLabel = computed(() => {
  switch (openTip.value) {
    case "fab":
      return "展开侧栏";
    case "new":
      return "新建会话";
    case "toggle":
      return props.collapsed ? "展开侧栏" : "折叠侧栏";
    default:
      return "";
  }
});

function showTip(key: "fab" | "toggle" | "new", event: MouseEvent) {
  // 展开态下「新对话」已是文案按钮，无需 tip
  if (key === "new" && !railCollapsed.value) {
    return;
  }
  const el = event.currentTarget as HTMLElement | null;
  if (!el) {
    return;
  }
  const rect = el.getBoundingClientRect();
  tipStyle.value = {
    top: `${rect.top + rect.height / 2}px`,
    left: `${rect.right + 8}px`,
  };
  openTip.value = key;
}

function hideTip(key: "fab" | "toggle" | "new") {
  if (openTip.value === key) {
    openTip.value = null;
  }
}

function clearTip() {
  openTip.value = null;
}
</script>

<template>
  <div
    class="chat-sidebar-mask"
    :class="{ 'is-open': narrow && !collapsed }"
    @click="emit('close')"
  />

  <button
    v-if="narrow && collapsed"
    type="button"
    class="chat-sidebar__fab"
    aria-label="展开侧栏"
    @mouseenter="showTip('fab', $event)"
    @mouseleave="hideTip('fab')"
    @click="clearTip(); emit('toggle')"
  >
    <PanelLeft class="chat-sidebar__glyph" :size="18" aria-hidden="true" />
  </button>

  <aside
    class="chat-sidebar"
    :class="{
      'is-collapsed': collapsed,
      'is-overlay': narrow,
    }"
  >
    <div
      class="chat-sidebar__top"
      :class="{ 'is-rail': railCollapsed }"
    >
      <button
        type="button"
        class="chat-sidebar__icon-btn chat-sidebar__new-icon"
        :class="{ 'is-text': !railCollapsed }"
        aria-label="新建会话"
        @mouseenter="showTip('new', $event)"
        @mouseleave="hideTip('new')"
        @click="clearTip(); emit('newChat')"
      >
        <Plus
          v-if="railCollapsed"
          class="chat-sidebar__glyph"
          :size="18"
          aria-hidden="true"
        />
        <span v-else>新对话</span>
      </button>

      <button
        type="button"
        class="chat-sidebar__icon-btn"
        :aria-label="collapsed ? '展开侧栏' : '折叠侧栏'"
        :aria-expanded="!collapsed"
        @mouseenter="showTip('toggle', $event)"
        @mouseleave="hideTip('toggle')"
        @click="clearTip(); emit('toggle')"
      >
        <PanelLeft class="chat-sidebar__glyph" :size="18" aria-hidden="true" />
      </button>
    </div>

    <div v-if="!collapsed" class="chat-sidebar__list">
      <button
        v-for="session in sessions"
        :key="session.id"
        type="button"
        class="chat-sidebar__item"
        :class="{ 'is-active': session.id === activeSessionId }"
        @click="emit('select', session.id)"
      >
        {{ session.title }}
      </button>
      <p v-if="sessions.length === 0" class="chat-sidebar__empty">
        发送第一条消息后，当前会话会出现在这里
      </p>
    </div>
  </aside>

  <Teleport to="body">
    <span
      v-if="openTip && tipLabel"
      class="chat-sidebar__tip"
      role="tooltip"
      :style="tipStyle"
    >{{ tipLabel }}</span>
  </Teleport>
</template>

<style scoped>
.chat-sidebar-mask {
  display: none;
}

.chat-sidebar__fab,
.chat-sidebar__icon-btn {
  display: inline-flex;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(203 213 225);
  border-radius: 10px;
  background: white;
  color: rgb(51 65 85);
  cursor: pointer;
  padding: 0;
}

.chat-sidebar__fab {
  position: fixed;
  top: 14px;
  left: 14px;
  z-index: 35;
  box-shadow: 0 4px 14px rgb(15 23 42 / 8%);
}

.chat-sidebar {
  display: flex;
  width: 260px;
  flex-shrink: 0;
  flex-direction: column;
  overflow: hidden;
  border-right: 1px solid rgb(226 232 240);
  background: rgb(248 250 252);
  transition:
    width 0.2s ease,
    transform 0.2s ease,
    border-color 0.2s ease;
}

.chat-sidebar.is-collapsed:not(.is-overlay) {
  width: 56px;
}

.chat-sidebar__top {
  display: flex;
  min-width: 260px;
  align-items: center;
  gap: 8px;
  padding: 14px 12px 12px;
}

.chat-sidebar__top.is-rail {
  min-width: 56px;
  flex-direction: column;
  justify-content: flex-start;
  gap: 14px;
  padding: 14px 10px;
}

.chat-sidebar__glyph {
  display: block;
  flex-shrink: 0;
}

.chat-sidebar__icon-btn:hover {
  background: rgb(241 245 249);
  color: rgb(15 23 42);
}

.chat-sidebar__new-icon.is-text {
  width: auto;
  flex: 1;
  border-color: rgb(191 219 254);
  background: rgb(239 246 255);
  color: rgb(29 78 216);
  font-size: 13px;
  font-weight: 600;
}

.chat-sidebar__new-icon.is-text:hover {
  background: rgb(219 234 254);
}

.chat-sidebar__new-icon:not(.is-text) {
  border-color: rgb(191 219 254);
  background: rgb(239 246 255);
  color: rgb(29 78 216);
}

.chat-sidebar__new-icon:not(.is-text):hover {
  background: rgb(219 234 254);
}

.chat-sidebar__list {
  display: flex;
  min-width: 260px;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  overflow: auto;
  padding: 8px 10px 16px;
}

.chat-sidebar__item {
  width: 100%;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: rgb(51 65 85);
  cursor: pointer;
  font-size: 13px;
  line-height: 1.4;
  padding: 10px 12px;
  text-align: left;
}

.chat-sidebar__item:hover {
  background: rgb(241 245 249);
}

.chat-sidebar__item.is-active {
  background: rgb(226 232 240);
  color: rgb(15 23 42);
  font-weight: 600;
}

.chat-sidebar__empty {
  margin: 12px 8px 0;
  color: rgb(148 163 184);
  font-size: 12px;
  line-height: 1.5;
}

.chat-sidebar.is-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 40;
  width: 260px;
  transform: translateX(0);
}

.chat-sidebar.is-overlay.is-collapsed {
  transform: translateX(-100%);
  border-right-color: rgb(226 232 240);
}

.chat-sidebar-mask.is-open {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: block;
  background: rgb(15 23 42 / 28%);
}
</style>

<style>
/* Teleport 到 body，不能用 scoped */
.chat-sidebar__tip {
  position: fixed;
  z-index: 1000;
  transform: translateY(-50%);
  white-space: nowrap;
  border-radius: 6px;
  background: rgb(15 23 42);
  color: rgb(248 250 252);
  font-size: 12px;
  line-height: 1.2;
  padding: 6px 8px;
  pointer-events: none;
}
</style>
