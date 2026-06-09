import { Icon } from "@/components/layout/Icon";

export function TypingIndicator() {
  return (
    <div className="max-w-4xl mx-auto flex gap-md">
      <div className="w-10 h-10 rounded-xl bg-primary-container flex-shrink-0 flex items-center justify-center text-on-primary-container">
        <Icon name="auto_awesome" filled />
      </div>
      <div className="flex items-center gap-xs px-lg py-md bg-surface-container-low rounded-2xl rounded-tl-none border border-outline-variant/10">
        <span
          className="w-2 h-2 rounded-full bg-tertiary animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-tertiary animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-tertiary animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}
