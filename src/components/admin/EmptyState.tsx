import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, icon: Icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      {/* Icon */}
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-500/10 mb-4">
        <Icon className="w-8 h-8 text-violet-500" strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-2 font-[family-name:var(--font-montserrat)]">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-500 max-w-md mb-6 font-[family-name:var(--font-montserrat)]">
        {description}
      </p>

      {/* Optional Action Button */}
      {action && (
        <Button
          onClick={action.onClick}
          className="bg-violet-500 hover:bg-violet-600 text-white font-[family-name:var(--font-montserrat)]"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
