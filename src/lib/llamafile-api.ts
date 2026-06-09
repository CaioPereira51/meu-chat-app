import type { Message, ModelConfig } from "./types";

const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 8080;

function baseUrl(host = DEFAULT_HOST, port = DEFAULT_PORT) {
  return `http://${host}:${port}`;
}

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onDone: () => void;
  onError: (error: Error) => void;
}

export async function sendChatCompletion(
  messages: Message[],
  config: ModelConfig,
  host?: string,
  port?: number,
  callbacks?: StreamCallbacks
): Promise<string> {
  const url = `${baseUrl(host, port)}/v1/chat/completions`;
  const body = {
    model: "default",
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    stream: true,
    temperature: config.temperature,
    top_p: config.topP,
    seed: config.seed >= 0 ? config.seed : undefined,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error ${response.status}: ${text}`);
  }

  if (!response.body) {
    throw new Error("Resposta sem corpo");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullContent = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") continue;

      try {
        const parsed = JSON.parse(data);
        const token =
          parsed.choices?.[0]?.delta?.content ??
          parsed.choices?.[0]?.message?.content ??
          "";
        if (token) {
          fullContent += token;
          callbacks?.onToken(token);
        }
      } catch {
        // skip malformed SSE chunks
      }
    }
  }

  callbacks?.onDone();
  return fullContent;
}

export async function measureLatency(host?: string, port?: number): Promise<number> {
  const start = performance.now();
  const res = await fetch(`${baseUrl(host, port)}/health`);
  if (!res.ok) throw new Error("Health check failed");
  return Math.round(performance.now() - start);
}
