import { Icon } from "@/components/layout/Icon";
import { useAppBootstrap } from "@/hooks/useAppBootstrap";

export default function SplashPage() {
  const { progress, status } = useAppBootstrap();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 blur-3xl rounded-full" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary/10 blur-3xl rounded-full" />

      <div className="relative z-10 flex flex-col items-center gap-2xl max-w-md w-full px-lg">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
          <Icon name="bolt" className="text-on-primary text-4xl" filled />
        </div>

        <div className="text-center space-y-sm">
          <h1 className="font-display text-display text-primary">MeuChat</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Modelos locais com Llamafile
          </p>
        </div>

        <div className="w-full space-y-md">
          <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
            {status}
          </p>
        </div>
      </div>
    </div>
  );
}
