export interface AppConfig {
  theme: "dark" | "light";
  language: string;
  modelsDirectory: string;
  llamafilePort: number;
  llamafileHost: string;
}

export interface ModelConfig {
  context: number;
  temperature: number;
  topP: number;
  seed: number;
  systemPrompt: string;
  gpuEnabled: boolean;
}

export interface GgufModel {
  id: string;
  fileName: string;
  displayName: string;
  sizeBytes: number;
  config: ModelConfig;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  title: string;
  modelId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface SystemMetrics {
  ramUsedGb: number;
  ramTotalGb: number;
  cpuPercent: number;
  tokensPerSecond: number;
}

export type LlamafileStatus = "stopped" | "starting" | "running" | "error";

export interface LlamafileState {
  status: LlamafileStatus;
  error?: string;
  latencyMs?: number;
}
