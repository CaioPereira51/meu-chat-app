import type { Message } from "@/lib/types";

interface UserBubbleProps {
  message: Message;
}

export function UserBubble({ message }: UserBubbleProps) {
  const time = new Date(message.createdAt).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-end gap-sm group">
      <div className="bg-surface-container-highest text-on-surface px-lg py-md rounded-2xl rounded-tr-none max-w-[85%] shadow-sm">
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
      <div className="flex items-center gap-md px-sm opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[11px] font-label-mono text-on-surface-variant">
          ENVIADO {time}
        </span>
      </div>
    </div>
  );
}
