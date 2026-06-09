import { create } from "zustand";
import type {
  AppConfig,
  ChatSession,
  GgufModel,
  LlamafileState,
  SystemMetrics,
} from "@/lib/types";

interface AppState {
  config: AppConfig | null;
  models: GgufModel[];
  activeModel: GgufModel | null;
  llamafile: LlamafileState;
  chats: ChatSession[];
  activeChat: ChatSession | null;
  metrics: SystemMetrics | null;
  searchQuery: string;

  setConfig: (config: AppConfig) => void;
  setModels: (models: GgufModel[]) => void;
  setActiveModel: (model: GgufModel | null) => void;
  setLlamafile: (state: Partial<LlamafileState>) => void;
  setChats: (chats: ChatSession[]) => void;
  setActiveChat: (chat: ChatSession | null) => void;
  setMetrics: (metrics: SystemMetrics | null) => void;
  setSearchQuery: (query: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  config: null,
  models: [],
  activeModel: null,
  llamafile: { status: "stopped" },
  chats: [],
  activeChat: null,
  metrics: null,
  searchQuery: "",

  setConfig: (config) => set({ config }),
  setModels: (models) => set({ models }),
  setActiveModel: (activeModel) => set({ activeModel }),
  setLlamafile: (state) =>
    set((s) => ({ llamafile: { ...s.llamafile, ...state } })),
  setChats: (chats) => set({ chats }),
  setActiveChat: (activeChat) => set({ activeChat }),
  setMetrics: (metrics) => set({ metrics }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
