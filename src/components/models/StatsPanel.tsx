import type { SystemMetrics } from "@/lib/types";

interface StatsPanelProps {
  modelCount: number;
  metrics: SystemMetrics | null;
  latencyMs?: number;
}

export function StatsPanel({ modelCount, metrics, latencyMs }: StatsPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mt-2xl">
      <div className="glass-card rounded-xl p-lg">
        <p className="font-label-mono text-label-mono text-on-surface-variant uppercase mb-sm">
          Modelos Instalados
        </p>
        <p className="font-headline-lg text-headline-lg text-primary">{modelCount}</p>
      </div>
      <div className="glass-card rounded-xl p-lg">
        <p className="font-label-mono text-label-mono text-on-surface-variant uppercase mb-sm">
          Latência Média
        </p>
        <p className="font-headline-lg text-headline-lg text-tertiary">
          {latencyMs != null ? `${latencyMs}ms` : "—"}
        </p>
      </div>
      <div className="glass-card rounded-xl p-lg">
        <p className="font-label-mono text-label-mono text-on-surface-variant uppercase mb-sm">
          RAM em Uso
        </p>
        <p className="font-headline-lg text-headline-lg text-secondary">
          {metrics
            ? `${metrics.ramUsedGb.toFixed(1)} / ${metrics.ramTotalGb.toFixed(0)} GB`
            : "—"}
        </p>
      </div>
    </div>
  );
}
