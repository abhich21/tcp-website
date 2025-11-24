import { Edit, Archive, RotateCcw, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PortfolioItem {
  id: number;
  title: string;
  category_name: string;
  image: string;
  isDeleted: boolean;
  created_at?: string;
}

interface PortfolioGridProps {
  items: PortfolioItem[];
  onEdit: (id: number) => void;
  onArchive: (id: number, isDeleted: boolean) => void;
  onDelete: (id: number) => void;
}

export function PortfolioGrid({ items, onEdit, onArchive, onDelete }: PortfolioGridProps) {
  if (items.length === 0) {
    return (
      <div className="col-span-full text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-500/10 mb-4">
          <Archive className="w-8 h-8 text-violet-500" />
        </div>
        <p className="text-gray-400 text-lg font-[family-name:var(--font-montserrat)]">No items found</p>
        <p className="text-gray-500 text-sm mt-1 font-[family-name:var(--font-montserrat)]">
          Create your first portfolio item to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card
          key={item.id}
          className={cn(
            "bg-[#1a1a1d] border border-white/8 rounded-xl overflow-hidden shadow-sm",
            "transition-all duration-200 ease-out",
            "hover:shadow-xl hover:-translate-y-1",
            item.isDeleted && "opacity-60"
          )}
        >
          {/* Image Container */}
          <div className="relative aspect-video w-full overflow-hidden bg-black/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-300 ease-out hover:scale-105"
            />
            
            {/* Status Badge */}
            {item.isDeleted ? (
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/90 text-white backdrop-blur-sm font-[family-name:var(--font-montserrat)]">
                  ARCHIVED
                </span>
              </div>
            ) : (
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-lime-400 text-green-900 backdrop-blur-sm font-[family-name:var(--font-montserrat)]">
                  ACTIVE
                </span>
              </div>
            )}
          </div>

          {/* Card Content */}
          <CardContent className="p-4">
            {/* Title */}
            <h3 className="text-base font-semibold text-white mb-2 line-clamp-1 font-[family-name:var(--font-montserrat)]">
              {item.title}
            </h3>

            {/* Category */}
            <div className="mb-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-800/30 text-lime-400 border border-lime-400/20 font-[family-name:var(--font-montserrat)]">
                {item.category_name}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(item.id)}
                className="h-9 w-9 text-gray-400 hover:bg-violet-500/10 hover:text-violet-400 transition-colors duration-150"
                title="Edit"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onArchive(item.id, item.isDeleted)}
                className={cn(
                  "h-9 w-9 text-gray-400 transition-colors duration-150",
                  item.isDeleted
                    ? "hover:bg-lime-400/10 hover:text-lime-400"
                    : "hover:bg-white/5 hover:text-gray-300"
                )}
                title={item.isDeleted ? "Restore" : "Archive"}
              >
                {item.isDeleted ? (
                  <RotateCcw className="h-4 w-4" />
                ) : (
                  <Archive className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(item.id)}
                className="h-9 w-9 text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors duration-150"
                title="Delete permanently"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
