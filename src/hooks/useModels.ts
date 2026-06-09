import { useCallback } from "react";
import {
  healthCheck,
  importModel,
  removeModel,
  saveModelConfig,
  scanModels,
  startLlamafile,
  stopLlamafile,
} from "@/lib/tauri";
import type { GgufModel, ModelConfig } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";

export function useModels() {
  const {
    models,
    setModels,
    setActiveModel,
    setLlamafile,
    llamafile,
    searchQuery,
    setSearchQuery,
  } = useAppStore();

  const refreshModels = useCallback(async () => {
    const list = await scanModels();
    setModels(list);
    return list;
  }, [setModels]);

  const handleImport = useCallback(async () => {
    const imported = await importModel();
    if (imported) {
      await refreshModels();
    }
    return imported;
  }, [refreshModels]);

  const handleRemove = useCallback(
    async (model: GgufModel) => {
      const confirmed = window.confirm(
        `Remover o modelo "${model.displayName}"? O arquivo será excluído.`
      );
      if (!confirmed) return;
      await removeModel(model.fileName);
      await refreshModels();
    },
    [refreshModels]
  );

  const handleSaveConfig = useCallback(
    async (fileName: string, config: ModelConfig) => {
      await saveModelConfig(fileName, config);
      await refreshModels();
    },
    [refreshModels]
  );

  const handleSelectModel = useCallback(
    async (model: GgufModel): Promise<boolean> => {
      try {
        setActiveModel(model);
        setLlamafile({ status: "starting", error: undefined });

        await stopLlamafile();
        await startLlamafile(model);

        const maxAttempts = 60;
        for (let i = 0; i < maxAttempts; i++) {
          const ok = await healthCheck();
          if (ok) {
            const start = performance.now();
            await healthCheck();
            const latencyMs = Math.round(performance.now() - start);
            setLlamafile({ status: "running", latencyMs });
            return true;
          }
          await new Promise((r) => setTimeout(r, 1000));
        }

        setLlamafile({
          status: "error",
          error: "Llamafile não respondeu no tempo esperado.",
        });
        return false;
      } catch (err) {
        setLlamafile({
          status: "error",
          error: err instanceof Error ? err.message : "Erro ao iniciar Llamafile",
        });
        return false;
      }
    },
    [setActiveModel, setLlamafile]
  );

  const filteredModels = models.filter(
    (m) =>
      m.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    models: filteredModels,
    allModels: models,
    llamafile,
    searchQuery,
    setSearchQuery,
    refreshModels,
    handleImport,
    handleRemove,
    handleSaveConfig,
    handleSelectModel,
  };
}
