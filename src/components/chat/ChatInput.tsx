import { useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/layout/Icon";

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }

  function handleSend() {
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <footer className="absolute bottom-0 left-0 right-0 p-md md:p-lg lg:px-xl bg-gradient-to-t from-background via-background to-transparent">
      <div className="max-w-4xl mx-auto">
        <div className="glass-panel rounded-2xl p-sm flex items-end gap-sm shadow-2xl">
          <textarea
            ref={textareaRef}
            id="chat-input"
            rows={1}
            value={value}
            disabled={disabled}
            onChange={(e) => {
              setValue(e.target.value);
              autoResize();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 py-md px-md max-h-[200px] custom-scrollbar disabled:opacity-50"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={disabled || !value.trim()}
            className="bg-primary text-on-primary-container p-md rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Icon name="send" />
          </button>
        </div>
        <p className="text-center font-label-mono text-[10px] text-on-surface-variant mt-sm opacity-60">
          MeuChat pode cometer erros. Verifique informações importantes.
        </p>
      </div>
    </footer>
  );
}
