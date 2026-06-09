import { useEffect, useState } from "react";
import type { AppConfig } from "@/lib/types";
import { loadConfig, saveConfig } from "@/lib/tauri";
import { useAppStore } from "@/store/useAppStore";
import { Icon } from "@/components/layout/Icon";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { setConfig } = useAppStore();
  const [local, setLocal] = useState<AppConfig | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      loadConfig().then((c) => {
        setLocal(c);
        setConfig(c);
      });
    }
  }, [open, setConfig]);

  if (!open || !local) return null;

  async function handleSave() {
    if (!local) return;
    setSaving(true);
    try {
      await saveConfig(local);
      setConfig(local);
      document.documentElement.classList.toggle("dark", local.theme === "dark");
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-md">
      <div className="glass-panel rounded-xl w-full max-w-lg p-xl space-y-lg">
        <div className="flex justify-between items-center">
          <h2 className="font-headline-md text-headline-md text-primary">Configurações</h2>
          <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-primary">
            <Icon name="close" />
          </button>
        </div>

        <div className="space-y-md">
          <label className="block space-y-xs">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Tema</span>
            <select
              className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-md py-sm text-on-surface"
              value={local.theme}
              onChange={(e) =>
                setLocal({ ...local, theme: e.target.value as "dark" | "light" })
              }
            >
              <option value="dark">Escuro</option>
              <option value="light">Claro</option>
            </select>
          </label>
          <label className="block space-y-xs">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Idioma</span>
            <select
              className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-md py-sm text-on-surface"
              value={local.language}
              onChange={(e) => setLocal({ ...local, language: e.target.value })}
            >
              <option value="pt-BR">Português (BR)</option>
              <option value="en-US">English (US)</option>
            </select>
          </label>
          <label className="block space-y-xs">
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Diretório de modelos
            </span>
            <input
              type="text"
              className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-md py-sm text-on-surface"
              value={local.modelsDirectory}
              onChange={(e) => setLocal({ ...local, modelsDirectory: e.target.value })}
            />
          </label>
          <label className="block space-y-xs">
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Porta Llamafile
            </span>
            <input
              type="number"
              className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-md py-sm text-on-surface"
              value={local.llamafilePort}
              onChange={(e) =>
                setLocal({ ...local, llamafilePort: Number(e.target.value) })
              }
            />
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
