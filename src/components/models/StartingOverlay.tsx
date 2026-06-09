interface StartingOverlayProps {
  modelName: string;
}

export function StartingOverlay({ modelName }: StartingOverlayProps) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-background/80 backdrop-blur-md">
      <div className="glass-panel rounded-xl p-2xl text-center space-y-lg max-w-md">
        <div className="flex justify-center gap-xs">
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
        <h3 className="font-headline-md text-headline-md text-primary">Iniciando modelo</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Carregando <strong className="text-on-surface">{modelName}</strong> via Llamafile...
        </p>
        <p className="font-label-mono text-[11px] text-on-surface-variant">
          Aguardando health check em localhost:8080
        </p>
      </div>
    </div>
  );
}
