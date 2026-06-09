import { useCallback, useEffect } from "react";
import {
  createChat,
  createMessage,
  deleteChat,
  exportChat,
  listChats,
  renameChat,
  saveChat,
} from "@/lib/tauri";
import { sendChatCompletion } from "@/lib/llamafile-api";
import type { ChatSession, Message } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";

export function useChats() {
  const {
    chats,
    setChats,
    activeChat,
    setActiveChat,
    activeModel,
    config,
    setLlamafile,
  } = useAppStore();

  const refreshChats = useCallback(async () => {
    const list = await listChats();
    setChats(list);
    return list;
  }, [setChats]);

  useEffect(() => {
    refreshChats();
  }, [refreshChats]);

  const startNewChat = useCallback(async () => {
    if (!activeModel) return null;
    const chat = await createChat(activeModel.id);
    setActiveChat(chat);
    setChats([chat, ...chats]);
    return chat;
  }, [activeModel, chats, setActiveChat, setChats]);

  const selectChat = useCallback(
    (chat: ChatSession) => {
      setActiveChat(chat);
    },
    [setActiveChat]
  );

  const removeChat = useCallback(
    async (chatId: string) => {
      await deleteChat(chatId);
      const updated = chats.filter((c) => c.id !== chatId);
      setChats(updated);
      if (activeChat?.id === chatId) {
        setActiveChat(updated[0] ?? null);
      }
    },
    [chats, activeChat, setChats, setActiveChat]
  );

  const renameChatTitle = useCallback(
    async (chatId: string, title: string) => {
      await renameChat(chatId, title);
      const updated = chats.map((c) =>
        c.id === chatId ? { ...c, title, updatedAt: new Date().toISOString() } : c
      );
      setChats(updated);
      if (activeChat?.id === chatId) {
        setActiveChat({ ...activeChat, title });
      }
    },
    [chats, activeChat, setChats, setActiveChat]
  );

  const exportChatJson = useCallback(async (chatId: string) => {
    const json = await exportChat(chatId);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat_${chatId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const sendMessage = useCallback(
    async (content: string, onStream?: (partial: string) => void): Promise<void> => {
      if (!activeModel || !content.trim()) return;

      let chat = activeChat;
      if (!chat) {
        chat = await createChat(activeModel.id);
        setActiveChat(chat);
        setChats([chat, ...chats]);
      }

      const userMessage = createMessage("user", content.trim());
      const assistantMessage = createMessage("assistant", "");
      const messagesWithUser: Message[] = [...chat.messages, userMessage];

      const title =
        chat.messages.length === 0
          ? content.trim().slice(0, 48) + (content.length > 48 ? "..." : "")
          : chat.title;

      let updatedChat: ChatSession = {
        ...chat,
        title,
        messages: [...messagesWithUser, assistantMessage],
        updatedAt: new Date().toISOString(),
      };
      setActiveChat(updatedChat);
      setChats([updatedChat, ...chats.filter((c) => c.id !== chat!.id)]);

      let streamed = "";
      try {
        const host = config?.llamafileHost ?? "127.0.0.1";
        const port = config?.llamafilePort ?? 8080;

        const apiMessages: Message[] = activeModel.config.systemPrompt
          ? [
              createMessage("system", activeModel.config.systemPrompt),
              ...messagesWithUser,
            ]
          : messagesWithUser;

        const full = await sendChatCompletion(
          apiMessages,
          activeModel.config,
          host,
          port,
          {
            onToken: (token) => {
              streamed += token;
              onStream?.(streamed);
              updatedChat = {
                ...updatedChat,
                messages: updatedChat.messages.map((m) =>
                  m.id === assistantMessage.id ? { ...m, content: streamed } : m
                ),
              };
              setActiveChat(updatedChat);
            },
            onDone: () => {},
            onError: (err) => console.error(err),
          }
        );

        assistantMessage.content = full || streamed;
        updatedChat = {
          ...updatedChat,
          messages: updatedChat.messages.map((m) =>
            m.id === assistantMessage.id ? { ...m, content: assistantMessage.content } : m
          ),
          updatedAt: new Date().toISOString(),
        };
        await saveChat(updatedChat);
        setActiveChat(updatedChat);
        setChats([updatedChat, ...chats.filter((c) => c.id !== chat!.id)]);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Erro ao enviar mensagem";
        setLlamafile({ status: "error", error: errorMsg });
        updatedChat = {
          ...updatedChat,
          messages: updatedChat.messages.map((m) =>
            m.id === assistantMessage.id
              ? { ...m, content: `Erro: ${errorMsg}` }
              : m
          ),
        };
        setActiveChat(updatedChat);
      }
    },
    [activeChat, activeModel, chats, config, setActiveChat, setChats, setLlamafile]
  );

  return {
    chats,
    activeChat,
    refreshChats,
    startNewChat,
    selectChat,
    removeChat,
    renameChatTitle,
    exportChatJson,
    sendMessage,
  };
}
