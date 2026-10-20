function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function buildMockReply(prompt: string) {
  const topic = prompt.trim().slice(0, 48) || "这个问题";
  return [
    `收到，关于 **${topic}**：`,
    "",
    "这是脚手架里的本地假回复，用来演示流式输出与 Markdown 渲染。",
    "",
    "### 下一步",
    "",
    "1. 把 `mockChatStream` 换成真实流式接口",
    "2. 会话持久化与多会话同步可接后端",
    "",
    "```ts",
    "await sendMessage(prompt)",
    "```",
    "",
    "公式示例：$E = mc^2$",
  ].join("\n");
}

/** 可替换为真实 SSE / 流式客户端 */
export async function* mockChatStream(prompt: string): AsyncGenerator<string> {
  const reply = buildMockReply(prompt);
  for (const char of reply) {
    await sleep(12);
    yield char;
  }
}
