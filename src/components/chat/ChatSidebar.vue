<script setup lang="ts">
import type { ChatSession } from "@/composables/useChat";
import { computed, ref } from "vue";
import plusIcon from "@/assets/icons/plus.svg";
import sidebarIcon from "@/assets/icons/sidebar.svg";

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

function showTip(key: "fab" | "toggle" | "new") {
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

  <ElTooltip
    v-if="narrow && collapsed"
    content="展开侧栏"
    placement="right"
    trigger="manual"
    :visible="openTip === 'fab'"
  >
    <button
      type="button"
      class="chat-sidebar__fab"
      aria-label="展开侧栏"
      @mouseenter="showTip('fab')"
      @mouseleave="hideTip('fab')"
      @click="clearTip(); emit('toggle')"
    >
      <img :src="sidebarIcon" alt="" class="chat-sidebar__glyph" width="18" height="18">
    </button>
  </ElTooltip>

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
      <ElTooltip
        content="新建会话"
        placement="right"
        trigger="manual"
        :visible="openTip === 'new'"
      >
        <button
          type="button"
          class="chat-sidebar__icon-btn chat-sidebar__new-icon"
          :class="{ 'is-text': !railCollapsed }"
          aria-label="新建会话"
          @mouseenter="showTip('new')"
          @mouseleave="hideTip('new')"
          @click="clearTip(); emit('newChat')"
        >
          <img
            v-if="railCollapsed"
            :src="plusIcon"
            alt=""
            class="chat-sidebar__glyph"
            width="18"
            height="18"
          >
          <span v-else>新对话</span>
        </button>
      </ElTooltip>

      <ElTooltip
        :content="collapsed ? '展开侧栏' : '折叠侧栏'"
        placement="right"
        trigger="manual"
        :visible="openTip === 'toggle'"
      >
        <button
          type="button"
          class="chat-sidebar__icon-btn"
          :aria-label="collapsed ? '展开侧栏' : '折叠侧栏'"
          :aria-expanded="!collapsed"
          @mouseenter="showTip('toggle')"
          @mouseleave="hideTip('toggle')"
          @click="clearTip(); emit('toggle')"
        >
          <img :src="sidebarIcon" alt="" class="chat-sidebar__glyph" width="18" height="18">
        </button>
      </ElTooltip>
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
</template>

<style scoped>
.chat-sidebar-mask {
  display: none;
}

.chat-sidebar__fab {
  position: fixed;
  top: 14px;
  left: 14px;
  z-index: 35;
  display: inline-flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(203 213 225);
  border-radius: 10px;
  background: white;
  color: rgb(51 65 85);
  cursor: pointer;
  box-shadow: 0 4px 14px rgb(15 23 42 / 8%);
  padding: 0;
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
  width: 18px;
  height: 18px;
}

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
