import { useEffect, useState } from "react";
import type { GgufModel, ModelConfig } from "@/lib/types";
import { Icon } from "@/components/layout/Icon";

interface ModelConfigModalProps {
  model: GgufModel | null;
  onClose: () => void;
  onSave: (fileName: string, config: ModelConfig) => Promise<void>;
}

export function ModelConfigModal({ model, onClose, onSave }: ModelConfigModalProps) {
  const [config, setConfig] = useState<ModelConfig | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (model) setConfig({ ...model.config });
  }, [model]);

  if (!model || !config) return null;

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(model!.fileName, config!);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-md">
      <div className="glass-panel rounded-xl w-full max-w-lg p-xl space-y-lg">
        <div className="flex justify-between items-center">
          <h2 className="font-headline-md text-headline-md text-primary">
            Configurar {model.displayName}
          </h2>
          <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-primary">
            <Icon name="close" />
          </button>
        </div>

        <div className="space-y-md">
          <label className="block space-y-xs">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Contexto</span>
            <input
              type="number"
              className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-md py-sm text-on-surface"
              value={config.context}
              onChange={(e) => setConfig({ ...config, context: Number(e.target.value) })}
            />
          </label>
          <label className="block space-y-xs">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Temperatura</span>
            <input
              type="number"
              step="0.1"
              min="0"
              max="2"
              className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-md py-sm text-on-surface"
              value={config.temperature}
              onChange={(e) => setConfig({ ...config, temperature: Number(e.target.value) })}
            />
          </label>
          <label className="block space-y-xs">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Top-P</span>
            <input
              type="number"
              step="0.05"
              min="0"
              max="1"
              className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-md py-sm text-on-surface"
              value={config.topP}
              onChange={(e) => setConfig({ ...config, topP: Number(e.target.value) })}
            />
          </label>
          <label className="block space-y-xs">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Prompt de sistema</span>
            <textarea
              rows={3}
              className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-md py-sm text-on-surface resize-none"
              value={config.systemPrompt}
              onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
            />
          </label>
          <label className="flex items-center gap-sm">
            <input
              type="checkbox"
              checked={config.gpuEnabled}
              onChange={(e) => setConfig({ ...config, gpuEnabled: e.target.checked })}
            />
            <span className="font-body-sm text-body-sm text-on-surface">Habilitar GPU</span>
          </label>
        </div>

        <div className="flex justify-end gap-md">
          <button
            type="button"
            onClick={onClose}
            className="px-lg py-sm rounded-lg font-button text-button text-on-surface-variant hover:bg-surface-container-high"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-lg py-sm rounded-lg font-button text-button bg-primary text-on-primary-fixed hover:brightness-110 disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
