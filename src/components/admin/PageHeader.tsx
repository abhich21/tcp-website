import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: LucideIcon;
  };
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-montserrat)]">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-400 mt-1 font-[family-name:var(--font-montserrat)]">{subtitle}</p>
        )}
      </div>

      {action && (
        action.href ? (
          <Link href={action.href}>
            <Button className="bg-violet-500 hover:bg-violet-600 text-white font-[family-name:var(--font-montserrat)]">
              {action.icon && <action.icon className="w-4 h-4 mr-2" />}
              {action.label}
            </Button>
          </Link>
        ) : (
          <Button 
            onClick={action.onClick}
            className="bg-violet-500 hover:bg-violet-600 text-white font-[family-name:var(--font-montserrat)]"
          >
            {action.icon && <action.icon className="w-4 h-4 mr-2" />}
            {action.label}
          </Button>
        )
      )}
    </div>
  );
}
