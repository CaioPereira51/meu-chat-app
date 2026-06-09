import type { GgufModel } from "@/lib/types";
import { Icon } from "@/components/layout/Icon";

interface ChatTopBarProps {
  model: GgufModel | null;
  latencyMs?: number;
  onMenuToggle: () => void;
  onSettingsClick?: () => void;
  metricsText?: string;
}

export function ChatTopBar({
  model,
  latencyMs,
  onMenuToggle,
  onSettingsClick,
  metricsText,
}: ChatTopBarProps) {
  return (
    <header className="bg-background/80 backdrop-blur-md sticky top-0 z-40 flex justify-between items-center w-full px-lg md:px-margin-desktop h-16 border-b border-outline-variant/10">
      <div className="flex items-center gap-md">
        <button
          type="button"
          className="md:hidden text-on-surface-variant p-sm"
          onClick={onMenuToggle}
        >
          <Icon name="menu" />
        </button>
        <div className="flex items-center gap-sm">
          <span className="font-label-mono text-primary text-[11px] bg-primary/10 px-sm py-0.5 rounded border border-primary/20">
            LOCAL
          </span>
          <h2 className="font-headline-md text-lg text-on-background">
            {model?.displayName ?? "Nenhum modelo"}
          </h2>
        </div>
      </div>
      <div className="flex items-center gap-md">
        {metricsText && (
          <div className="hidden lg:flex items-center gap-xs px-md py-1.5 bg-surface-container-low rounded-full border border-outline-variant/20 text-on-surface-variant text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{metricsText}</span>
          </div>
        )}
        {latencyMs != null && (
          <div className="hidden sm:flex items-center gap-xs px-md py-1.5 bg-surface-container-low rounded-full border border-outline-variant/20 text-on-surface-variant text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Latência: {latencyMs}ms</span>
          </div>
        )}
        <button
          type="button"
          onClick={onSettingsClick}
          className="p-md text-on-surface-variant hover:bg-surface-variant transition-colors rounded-full"
        >
          <Icon name="settings" />
        </button>
      </div>
    </header>
  );
}
