import { invoke } from "@tauri-apps/api/core";
import type {
  AppConfig,
  ChatSession,
  GgufModel,
  Message,
  ModelConfig,
  SystemMetrics,
} from "./types";

const isTauri = () =>
  typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

export async function loadConfig(): Promise<AppConfig> {
  if (!isTauri()) {
    return {
      theme: "dark",
      language: "pt-BR",
      modelsDirectory: "modelos",
      llamafilePort: 8080,
      llamafileHost: "127.0.0.1",
    };
  }
  return invoke<AppConfig>("load_config");
}

export async function saveConfig(config: AppConfig): Promise<void> {
  if (!isTauri()) return;
  return invoke("save_config", { config });
}

export async function scanModels(): Promise<GgufModel[]> {
  if (!isTauri()) return [];
  return invoke<GgufModel[]>("scan_models");
}

export async function getModelConfig(fileName: string): Promise<ModelConfig> {
  if (!isTauri()) {
    return defaultModelConfig();
  }
  return invoke<ModelConfig>("get_model_config", { fileName });
}

export async function saveModelConfig(
  fileName: string,
  config: ModelConfig
): Promise<void> {
  if (!isTauri()) return;
  return invoke("save_model_config", { fileName, config });
}

export async function importModel(): Promise<GgufModel | null> {
  if (!isTauri()) return null;
  return invoke<GgufModel | null>("import_model");
}

export async function removeModel(fileName: string): Promise<void> {
  if (!isTauri()) return;
  return invoke("remove_model", { fileName });
}

export async function startLlamafile(model: GgufModel): Promise<void> {
  if (!isTauri()) return;
  return invoke("start_llamafile", { model });
}

export async function stopLlamafile(): Promise<void> {
  if (!isTauri()) return;
  return invoke("stop_llamafile");
}

export async function healthCheck(): Promise<boolean> {
  if (!isTauri()) return false;
  return invoke<boolean>("health_check");
}

export async function listChats(): Promise<ChatSession[]> {
  if (!isTauri()) return [];
  return invoke<ChatSession[]>("list_chats");
}

export async function createChat(
  modelId: string,
  title?: string
): Promise<ChatSession> {
  if (!isTauri()) {
    const now = new Date().toISOString();
    return {
      id: crypto.randomUUID(),
      title: title ?? "Nova conversa",
      modelId,
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
  }
  return invoke<ChatSession>("create_chat", { modelId, title });
}

export async function saveChat(chat: ChatSession): Promise<void> {
  if (!isTauri()) return;
  return invoke("save_chat", { chat });
}

export async function deleteChat(chatId: string): Promise<void> {
  if (!isTauri()) return;
  return invoke("delete_chat", { chatId });
}

export async function renameChat(
  chatId: string,
  title: string
): Promise<void> {
  if (!isTauri()) return;
  return invoke("rename_chat", { chatId, title });
}

export async function exportChat(chatId: string): Promise<string> {
  if (!isTauri()) return "";
  return invoke<string>("export_chat", { chatId });
}

export async function getSystemMetrics(): Promise<SystemMetrics> {
  if (!isTauri()) {
    return { ramUsedGb: 0, ramTotalGb: 16, cpuPercent: 0, tokensPerSecond: 0 };
  }
  return invoke<SystemMetrics>("get_system_metrics");
}

export async function ensureDirectories(): Promise<void> {
  if (!isTauri()) return;
  return invoke("ensure_directories");
}

export async function openLogsFolder(): Promise<void> {
  if (!isTauri()) return;
  return invoke("open_logs_folder");
}

function defaultModelConfig(): ModelConfig {
  return {
    context: 40960,
    temperature: 0.7,
    topP: 0.95,
    seed: -1,
    systemPrompt: "",
    gpuEnabled: false,
  };
}

export function createMessage(
  role: Message["role"],
  content: string
): Message {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}
