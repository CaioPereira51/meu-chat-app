import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiBubble } from "@/components/chat/AiBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatTopBar } from "@/components/chat/ChatTopBar";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { UserBubble } from "@/components/chat/UserBubble";
import { SettingsModal } from "@/components/settings/SettingsModal";
import { useChats } from "@/hooks/useChats";
import { getSystemMetrics, openLogsFolder } from "@/lib/tauri";
import { useAppStore } from "@/store/useAppStore";

export default function ChatPage() {
  const navigate = useNavigate();
  const { activeModel, llamafile, metrics, setMetrics } = useAppStore();
  const {
    chats,
    activeChat,
    startNewChat,
    selectChat,
    removeChat,
    renameChatTitle,
    exportChatJson,
    sendMessage,
  } = useChats();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!activeModel || llamafile.status !== "running") {
      navigate("/models");
    }
  }, [activeModel, llamafile.status, navigate]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const m = await getSystemMetrics();
      setMetrics(m);
    }, 3000);
    return () => clearInterval(interval);
  }, [setMetrics]);

  async function handleSend(content: string) {
    setSending(true);
    try {
      await sendMessage(content);
    } finally {
      setSending(false);
    }
  }

  const metricsText = metrics
    ? `RAM ${metrics.ramUsedGb.toFixed(1)}/${metrics.ramTotalGb.toFixed(0)}GB • CPU ${metrics.cpuPercent.toFixed(0)}%`
    : undefined;

  const messages = activeChat?.messages ?? [];
  const lastMessage = messages[messages.length - 1];
  const showTyping =
    sending && lastMessage?.role === "assistant" && !lastMessage.content;

  return (
    <div className="flex h-screen w-full relative bg-background text-on-background font-body-md overflow-hidden">
      <ChatSidebar
        chats={chats}
        activeChatId={activeChat?.id}
        onNewChat={startNewChat}
        onSelectChat={selectChat}
        onDeleteChat={(id) => {
          if (window.confirm("Excluir esta conversa?")) removeChat(id);
        }}
        onExportChat={exportChatJson}
        onRenameChat={renameChatTitle}
        onOpenLogs={openLogsFolder}
        onSettingsClick={() => setSettingsOpen(true)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <main className="flex-1 flex flex-col relative md:ml-sidebar-width h-full">
        <ChatTopBar
          model={activeModel}
          latencyMs={llamafile.latencyMs}
          onMenuToggle={() => setMobileOpen(true)}
          onSettingsClick={() => setSettingsOpen(true)}
          metricsText={metricsText}
        />

        <div className="flex-1 overflow-y-auto custom-scrollbar p-md md:p-lg lg:p-xl space-y-xl pb-32">
          {messages.length === 0 && (
            <div className="max-w-4xl mx-auto text-center py-2xl opacity-60">
              <p className="font-label-mono text-primary mb-md">MeuChat</p>
              <h3 className="font-headline-lg text-3xl mb-lg">
                Como posso ajudar você hoje?
              </h3>
            </div>
          )}

          {messages.map((msg) =>
            msg.role === "user" ? (
              <UserBubble key={msg.id} message={msg} />
            ) : (
              <AiBubble key={msg.id} message={msg} />
            )
          )}

          {showTyping && <TypingIndicator />}
        </div>

        <ChatInput onSend={handleSend} disabled={sending} />
      </main>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
