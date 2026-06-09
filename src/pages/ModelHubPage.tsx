import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HubSideNavBar } from "@/components/layout/HubSideNavBar";
import { HubTopAppBar } from "@/components/layout/HubTopAppBar";
import { AddModelCard } from "@/components/models/AddModelCard";
import { ModelCard } from "@/components/models/ModelCard";
import { ModelConfigModal } from "@/components/models/ModelConfigModal";
import { StartingOverlay } from "@/components/models/StartingOverlay";
import { StatsPanel } from "@/components/models/StatsPanel";
import { SettingsModal } from "@/components/settings/SettingsModal";
import { getSystemMetrics } from "@/lib/tauri";
import type { GgufModel } from "@/lib/types";
import { useModels } from "@/hooks/useModels";
import { useAppStore } from "@/store/useAppStore";

export default function ModelHubPage() {
  const navigate = useNavigate();
  const { metrics, setMetrics } = useAppStore();
  const { activeModel } = useAppStore();
  const {
    models,
    allModels,
    llamafile,
    searchQuery,
    setSearchQuery,
    refreshModels,
    handleImport,
    handleRemove,
    handleSaveConfig,
    handleSelectModel,
  } = useModels();

  const [importing, setImporting] = useState(false);
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [configModel, setConfigModel] = useState<GgufModel | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    refreshModels();
    const interval = setInterval(async () => {
      const m = await getSystemMetrics();
      setMetrics(m);
    }, 3000);
    return () => clearInterval(interval);
  }, [refreshModels, setMetrics]);

  async function onImport() {
    setImporting(true);
    try {
      await handleImport();
    } finally {
      setImporting(false);
    }
  }

  async function onSelect(model: GgufModel) {
    setSelectingId(model.id);
    const ok = await handleSelectModel(model);
    setSelectingId(null);
    if (ok) navigate("/chat");
    else alert(useAppStore.getState().llamafile.error ?? "Falha ao iniciar o modelo.");
  }

  const isStarting = llamafile.status === "starting";

  return (
    <div className="flex min-h-screen">
      <HubSideNavBar activeItem="models" />
      <main className="flex-grow ml-sidebar-width flex flex-col min-h-screen">
        <HubTopAppBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSettingsClick={() => setSettingsOpen(true)}
        />

        <div className="p-margin-desktop flex-1">
          <div className="flex flex-col md:flex-row justify-between items-end gap-lg mb-2xl">
            <div className="space-y-sm">
              <span className="font-label-mono text-label-mono text-primary uppercase tracking-widest">
                Workspace / Modelos
              </span>
              <h2 className="font-headline-lg text-headline-lg">Seleção de Modelos</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                Escolha um modelo GGUF instalado localmente ou importe um novo arquivo.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {models.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                isActive={selectingId === model.id}
                onSelect={onSelect}
                onRemove={handleRemove}
                onConfigure={setConfigModel}
              />
            ))}
            <AddModelCard onClick={onImport} loading={importing} />
          </div>

          {models.length === 0 && (
            <p className="font-body-md text-body-md text-on-surface-variant text-center py-2xl">
              Nenhum modelo encontrado em <code className="text-primary">modelos/</code>.
              Adicione arquivos .gguf para começar.
            </p>
          )}

          <StatsPanel
            modelCount={allModels.length}
            metrics={metrics}
            latencyMs={llamafile.latencyMs}
          />

          <footer className="mt-2xl py-lg text-center font-label-mono text-[11px] text-on-surface-variant">
            MeuChat v0.1.0 • Execução local via Llamafile
          </footer>
        </div>
      </main>

      {isStarting && (
        <StartingOverlay modelName={activeModel?.displayName ?? ""} />
      )}
      <ModelConfigModal
        model={configModel}
        onClose={() => setConfigModel(null)}
        onSave={handleSaveConfig}
      />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
