import { Link, useNavigate } from "react-router-dom";
import { Icon } from "./Icon";

interface HubSideNavBarProps {
  activeItem: "models" | "chat";
}

export function HubSideNavBar({ activeItem }: HubSideNavBarProps) {
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-0 h-full w-sidebar-width bg-surface-container flex flex-col py-xl z-50">
      <div className="px-lg mb-2xl">
        <div className="flex items-center gap-md mb-xs">
          <Icon name="dataset" className="text-primary text-3xl" filled />
          <h1 className="font-headline-lg text-headline-lg text-primary">MeuChat</h1>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant opacity-70">
          Modelos Locais
        </p>
      </div>

      <nav className="flex-grow space-y-xs">
        <Link
          to="/models"
          className={`flex items-center gap-md px-lg py-md font-body-sm text-body-sm transition-all ${
            activeItem === "models"
              ? "bg-primary/5 text-primary border-l-2 border-primary"
              : "text-on-surface-variant hover:bg-surface-container-high"
          }`}
        >
          <Icon name="grid_view" />
          <span>Modelos</span>
        </Link>
        <Link
          to="/chat"
          className={`flex items-center gap-md px-lg py-md font-body-sm text-body-sm transition-all ${
            activeItem === "chat"
              ? "bg-primary/5 text-primary border-l-2 border-primary"
              : "text-on-surface-variant hover:bg-surface-container-high"
          }`}
        >
          <Icon name="chat" />
          <span>Chat</span>
        </Link>
        <div className="pt-xl px-lg">
          <button
            type="button"
            onClick={() => navigate("/chat")}
            className="w-full bg-primary-container text-on-primary-container py-md px-lg rounded-xl font-button text-button hover:opacity-90 active:scale-98 transition-transform flex items-center justify-center gap-sm"
          >
            <Icon name="add" />
            Novo Chat
          </button>
        </div>
      </nav>

      <div className="mt-auto border-t border-outline-variant/20 pt-lg space-y-xs">
        <a
          href="#"
          className="flex items-center gap-md text-on-surface-variant px-lg py-md font-body-sm text-body-sm hover:bg-surface-container-high transition-all"
          onClick={(e) => e.preventDefault()}
        >
          <Icon name="help" />
          <span>Ajuda</span>
        </a>
      </div>
    </aside>
  );
}
