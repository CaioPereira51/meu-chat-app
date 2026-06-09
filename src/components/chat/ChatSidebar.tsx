import { Link, useNavigate } from "react-router-dom";
import type { ChatSession } from "@/lib/types";
import { stopLlamafile } from "@/lib/tauri";
import { Icon } from "@/components/layout/Icon";

interface ChatSidebarProps {
  chats: ChatSession[];
  activeChatId?: string;
  onNewChat: () => void;
  onSelectChat: (chat: ChatSession) => void;
  onDeleteChat?: (chatId: string) => void;
  onExportChat?: (chatId: string) => void;
  onRenameChat?: (chatId: string, title: string) => void;
  onSettingsClick?: () => void;
  onOpenLogs?: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function ChatSidebar({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onExportChat,
  onRenameChat,
  onSettingsClick,
  onOpenLogs,
  mobileOpen,
  onMobileClose,
}: ChatSidebarProps) {
  const navigate = useNavigate();

  async function handleChangeModel() {
    await stopLlamafile();
    navigate("/models");
  }

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={`bg-surface-container fixed left-0 top-0 h-full w-sidebar-width flex flex-col py-xl border-r border-outline-variant/20 z-50 transition-transform md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-lg mb-xl">
          <div className="flex items-center gap-md mb-md">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary shadow-lg">
              <Icon name="bolt" filled />
            </div>
            <div>
              <h1 className="font-headline-md text-[20px] text-primary tracking-tight">MeuChat</h1>
              <p className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
                Modelos Locais
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onNewChat}
            className="w-full bg-primary text-on-primary-container font-button py-md px-lg rounded-xl flex items-center justify-center gap-sm hover:opacity-90 active:scale-95 transition-all shadow-md"
          >
            <Icon name="add" />
            Novo Chat
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar px-md space-y-xs">
          <p className="px-sm mb-xs font-label-mono text-on-surface-variant text-[11px] uppercase py-md">
            Conversas Recentes
          </p>
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`group flex items-center gap-xs rounded-lg ${
                chat.id === activeChatId
                  ? "bg-primary/5 border-l-2 border-primary"
                  : "hover:bg-surface-container-high"
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  onSelectChat(chat);
                  onMobileClose();
                }}
                onDoubleClick={() => {
                  if (!onRenameChat) return;
                  const title = window.prompt("Renomear conversa:", chat.title);
                  if (title?.trim()) onRenameChat(chat.id, title.trim());
                }}
                className={`flex-1 flex items-center gap-md px-lg py-md transition-all text-left ${
                  chat.id === activeChatId ? "text-primary" : "text-on-surface-variant"
                }`}
              >
                <Icon name={chat.id === activeChatId ? "chat" : "history"} className="text-[20px]" />
                <span className="truncate font-medium">{chat.title}</span>
              </button>
              <div className="hidden group-hover:flex items-center pr-sm gap-xs">
                {onExportChat && (
                  <button
                    type="button"
                    title="Exportar"
                    onClick={() => onExportChat(chat.id)}
                    className="p-xs text-on-surface-variant hover:text-primary"
                  >
                    <Icon name="download" className="text-[16px]" />
                  </button>
                )}
                {onDeleteChat && (
                  <button
                    type="button"
                    title="Excluir"
                    onClick={() => onDeleteChat(chat.id)}
                    className="p-xs text-on-surface-variant hover:text-error"
                  >
                    <Icon name="delete" className="text-[16px]" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {chats.length === 0 && (
            <p className="px-lg font-body-sm text-body-sm text-on-surface-variant">
              Nenhuma conversa ainda
            </p>
          )}
        </nav>

        <div className="mt-auto px-md pt-lg border-t border-outline-variant/10">
          <button
            type="button"
            onClick={handleChangeModel}
            className="w-full flex items-center gap-md text-on-surface-variant px-lg py-md hover:bg-surface-container-high transition-all rounded-lg"
          >
            <Icon name="grid_view" className="text-[20px]" />
            <span>Trocar Modelo</span>
          </button>
          {onOpenLogs && (
            <button
              type="button"
              onClick={onOpenLogs}
              className="w-full flex items-center gap-md text-on-surface-variant px-lg py-md hover:bg-surface-container-high transition-all rounded-lg"
            >
              <Icon name="description" className="text-[20px]" />
              <span>Logs</span>
            </button>
          )}
          <button
            type="button"
            onClick={onSettingsClick}
            className="w-full flex items-center gap-md text-on-surface-variant px-lg py-md hover:bg-surface-container-high transition-all rounded-lg"
          >
            <Icon name="settings" className="text-[20px]" />
            <span>Configurações</span>
          </button>
          <Link
            to="/models"
            className="mt-md p-md bg-surface-container-low rounded-xl flex items-center gap-md"
          >
            <div className="w-8 h-8 rounded-full border border-outline-variant/20 bg-primary/20 flex items-center justify-center">
              <Icon name="person" className="text-primary text-sm" />
            </div>
            <div className="flex-1 truncate">
              <p className="text-on-surface text-sm font-semibold truncate">Usuário Local</p>
              <p className="text-on-surface-variant text-[11px] truncate">Execução offline</p>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}
