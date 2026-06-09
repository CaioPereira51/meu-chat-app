import type { GgufModel } from "@/lib/types";
import { Icon } from "@/components/layout/Icon";

function formatSize(bytes: number): string {
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) return `${gb.toFixed(1)} GB`;
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(0)} MB`;
}

interface ModelCardProps {
  model: GgufModel;
  isActive?: boolean;
  onSelect: (model: GgufModel) => void;
  onRemove: (model: GgufModel) => void;
  onConfigure: (model: GgufModel) => void;
}

export function ModelCard({
  model,
  isActive,
  onSelect,
  onRemove,
  onConfigure,
}: ModelCardProps) {
  return (
    <div className="glass-card rounded-xl p-lg flex flex-col model-card-hover transition-all group relative overflow-hidden">
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all" />
      <div className="flex justify-between items-start mb-md">
        <div className="p-sm bg-primary/10 rounded-lg">
          <Icon name="neurology" className="text-primary" filled />
        </div>
        <span className="font-label-mono text-label-mono bg-surface-container-highest px-sm py-xs rounded text-primary border border-primary/20">
          GGUF
        </span>
      </div>
      <h3 className="font-headline-md text-headline-md mb-xs">{model.displayName}</h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-md flex-grow leading-relaxed">
        {model.fileName}
      </p>
      <div className="flex items-center gap-xs text-on-surface-variant mb-lg">
        <Icon name="storage" className="text-sm" />
        <span className="font-label-mono text-[10px]">{formatSize(model.sizeBytes)}</span>
        <span className="font-label-mono text-[10px] ml-md">
          ctx {model.config.context.toLocaleString()}
        </span>
      </div>
      <div className="flex items-center justify-between mt-auto gap-sm">
        <div className="flex gap-xs">
          <button
            type="button"
            onClick={() => onConfigure(model)}
            className="p-sm text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-surface-container-high"
            title="Configurar"
          >
            <Icon name="tune" className="text-[18px]" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(model)}
            className="p-sm text-on-surface-variant hover:text-error transition-colors rounded-lg hover:bg-surface-container-high"
            title="Remover"
          >
            <Icon name="delete" className="text-[18px]" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => onSelect(model)}
          disabled={isActive}
          className={`px-lg py-sm rounded-lg font-button text-button active:scale-95 transition-all ${
            isActive
              ? "bg-primary/30 text-primary cursor-wait"
              : "bg-primary text-on-primary-fixed hover:brightness-110"
          }`}
        >
          {isActive ? "Iniciando..." : "Selecionar"}
        </button>
      </div>
    </div>
  );
}
