import type { Message } from "@/lib/types";
import { Icon } from "@/components/layout/Icon";

interface AiBubbleProps {
  message: Message;
}

function renderContent(content: string) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith("```")) {
      const code = part.replace(/^```\w*\n?/, "").replace(/```$/, "");
      return (
        <div
          key={i}
          className="rounded-xl overflow-hidden bg-surface-container-lowest border border-outline-variant/30 my-md"
        >
          <div className="bg-surface-container-high px-lg py-sm flex justify-between items-center">
            <span className="font-label-mono text-[11px] text-on-surface-variant">código</span>
          </div>
          <pre className="p-lg font-label-mono text-[13px] overflow-x-auto custom-scrollbar text-tertiary">
            <code>{code}</code>
          </pre>
        </div>
      );
    }
    return (
      <p key={i} className="mb-md whitespace-pre-wrap last:mb-0">
        {part}
      </p>
    );
  });
}

export function AiBubble({ message }: AiBubbleProps) {
  return (
    <div className="max-w-4xl mx-auto flex flex-col items-start gap-sm group">
      <div className="flex gap-md w-full">
        <div className="w-10 h-10 rounded-xl bg-primary-container flex-shrink-0 flex items-center justify-center text-on-primary-container ai-bubble-glow border border-primary/20">
          <Icon name="auto_awesome" filled />
        </div>
        <div className="flex-1 space-y-lg text-on-surface">
          <div className="p-lg bg-surface-container-low rounded-2xl rounded-tl-none border border-outline-variant/10 shadow-sm leading-relaxed">
            {message.content ? (
              renderContent(message.content)
            ) : (
              <span className="text-on-surface-variant italic">Gerando resposta...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
