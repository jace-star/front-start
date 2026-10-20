import { useMediaQuery } from "@vueuse/core";
import { computed, ref, watch } from "vue";
import { mockChatStream } from "@/utils/mockChatStream";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
}

function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function titleFromPrompt(prompt: string) {
  const text = prompt.trim().replace(/\s+/g, " ");
  if (!text) {
    return "新对话";
  }
  return text.length > 18 ? `${text.slice(0, 18)}…` : text;
}

const sessions = ref<ChatSession[]>([]);
const activeSessionId = ref<string | null>(null);
const isStreaming = ref(false);
let streamAbort: AbortController | null = null;
/** 侧栏是否折叠；窄屏下折叠表示关闭抽屉 */
const sidebarCollapsed = ref(false);
/** 宽屏下用户是否主动折叠；为 true 时屏幕恢复也不自动展开 */
const userCollapsed = ref(false);
const isNarrowScreen = useMediaQuery("(max-width: 860px)");

watch(
  isNarrowScreen,
  (narrow) => {
    if (narrow) {
      sidebarCollapsed.value = true;
      return;
    }
    if (!userCollapsed.value) {
      sidebarCollapsed.value = false;
    }
  },
  { immediate: true },
);

const activeSession = computed(() =>
  sessions.value.find((session) => session.id === activeSessionId.value) ?? null,
);

const messages = computed(() => activeSession.value?.messages ?? []);
const hasStarted = computed(() => messages.value.length > 0);
const sidebarOpen = computed(() => !sidebarCollapsed.value);

function toggleSidebar() {
  const next = !sidebarCollapsed.value;
  sidebarCollapsed.value = next;
  if (!isNarrowScreen.value) {
    userCollapsed.value = next;
  }
}

function collapseSidebar() {
  sidebarCollapsed.value = true;
}

function ensureSession() {
  if (activeSession.value) {
    return activeSession.value;
  }
  const session: ChatSession = {
    id: createId(),
    title: "新对话",
    messages: [],
  };
  sessions.value = [session, ...sessions.value];
  activeSessionId.value = session.id;
  return session;
}

function newChat() {
  if (isStreaming.value) {
    return;
  }
  const session: ChatSession = {
    id: createId(),
    title: "新对话",
    messages: [],
  };
  sessions.value = [session, ...sessions.value.filter((item) => item.messages.length > 0)];
  activeSessionId.value = session.id;
  if (isNarrowScreen.value) {
    collapseSidebar();
  }
}

function selectSession(id: string) {
  if (isStreaming.value) {
    return;
  }
  activeSessionId.value = id;
  if (isNarrowScreen.value) {
    collapseSidebar();
  }
}

function stop() {
  streamAbort?.abort();
  streamAbort = null;
  isStreaming.value = false;
}

async function send(prompt: string) {
  const text = prompt.trim();
  if (!text || isStreaming.value) {
    return;
  }

  const session = ensureSession();
  if (session.messages.length === 0) {
    session.title = titleFromPrompt(text);
  }

  session.messages.push({
    id: createId(),
    role: "user",
    content: text,
  });

  const assistant: ChatMessage = {
    id: createId(),
    role: "assistant",
    content: "",
  };
  session.messages.push(assistant);

  streamAbort?.abort();
  streamAbort = new AbortController();
  const { signal } = streamAbort;
  isStreaming.value = true;

  try {
    for await (const chunk of mockChatStream(text, signal)) {
      if (signal.aborted) {
        break;
      }
      assistant.content += chunk;
    }
  } catch (error) {
    if (!(error instanceof DOMException && error.name === "AbortError")) {
      assistant.content = assistant.content || "回复失败，请稍后重试。";
    }
  } finally {
    if (streamAbort?.signal === signal) {
      streamAbort = null;
      isStreaming.value = false;
    }
  }
}

export function useChat() {
  return {
    sessions,
    activeSessionId,
    activeSession,
    messages,
    hasStarted,
    isStreaming,
    sidebarCollapsed,
    sidebarOpen,
    isNarrowScreen,
    toggleSidebar,
    collapseSidebar,
    newChat,
    selectSession,
    send,
    stop,
  };
}
