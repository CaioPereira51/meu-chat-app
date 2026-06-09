import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ensureDirectories, loadConfig, scanModels } from "@/lib/tauri";
import { useAppStore } from "@/store/useAppStore";

const STEPS = [
  "Carregando configurações...",
  "Verificando modelos...",
  "Preparando ambiente...",
] as const;

export function useAppBootstrap() {
  const navigate = useNavigate();
  const { setConfig, setModels } = useAppStore();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>(STEPS[0]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        setStatus(STEPS[0]);
        setProgress(10);
        const config = await loadConfig();
        if (cancelled) return;
        setConfig(config);
        document.documentElement.classList.toggle("dark", config.theme === "dark");

        setStatus(STEPS[1]);
        setProgress(45);
        const models = await scanModels();
        if (cancelled) return;
        setModels(models);

        setStatus(STEPS[2]);
        setProgress(75);
        await ensureDirectories();
        if (cancelled) return;

        setProgress(100);
        setDone(true);
        setTimeout(() => {
          if (!cancelled) navigate("/models");
        }, 600);
      } catch (err) {
        console.error("Bootstrap failed:", err);
        setStatus("Erro ao inicializar. Continuando...");
        setProgress(100);
        setDone(true);
        setTimeout(() => {
          if (!cancelled) navigate("/models");
        }, 1000);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [navigate, setConfig, setModels]);

  return { progress, status, done };
}
