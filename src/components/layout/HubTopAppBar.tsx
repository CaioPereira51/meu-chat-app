import { Icon } from "./Icon";

interface HubTopAppBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSettingsClick?: () => void;
}

export function HubTopAppBar({
  searchQuery,
  onSearchChange,
  onSettingsClick,
}: HubTopAppBarProps) {
  return (
    <header className="flex justify-between items-center w-full px-margin-desktop h-16 bg-surface-container-low sticky top-0 z-40">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full group">
          <Icon
            name="search"
            className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors"
          />
          <input
            className="w-full bg-surface-container-highest/30 border border-outline-variant focus:border-primary focus:ring-0 rounded-full pl-xl pr-md py-sm font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant/50 transition-all"
            placeholder="Buscar modelos..."
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-lg ml-xl">
        <button
          type="button"
          onClick={onSettingsClick}
          className="p-base rounded-full hover:bg-surface-variant transition-colors text-on-surface-variant active:scale-95 duration-200"
        >
          <Icon name="settings" />
        </button>
        <div className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant hover:border-primary transition-colors cursor-pointer bg-primary/20 flex items-center justify-center">
          <Icon name="person" className="text-primary text-sm" />
        </div>
      </div>
    </header>
  );
}
