import { Icon } from "@/components/layout/Icon";

interface AddModelCardProps {
  onClick: () => void;
  loading?: boolean;
}

export function AddModelCard({ onClick, loading }: AddModelCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="glass-card rounded-xl p-lg flex flex-col items-center justify-center min-h-[280px] border-2 border-dashed border-outline-variant hover:border-primary transition-all group disabled:opacity-50"
    >
      <div className="p-lg bg-surface-container-high rounded-full mb-md group-hover:bg-primary/10 transition-colors">
        <Icon
          name="add_circle"
          className="text-4xl text-on-surface-variant group-hover:text-primary transition-colors"
        />
      </div>
      <h3 className="font-headline-md text-headline-md mb-xs">Adicionar Modelo</h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant text-center max-w-xs">
        Importe um arquivo .gguf para a pasta de modelos
      </p>
      {loading && (
        <p className="font-label-mono text-[11px] text-primary mt-md">Importando...</p>
      )}
    </button>
  );
}
