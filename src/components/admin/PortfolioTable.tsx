import { Edit, Archive, RotateCcw, Trash2 } from "lucide-react";
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

interface PortfolioTableProps {
  items: PortfolioItem[];
  onEdit: (id: number) => void;
  onArchive: (id: number, isDeleted: boolean) => void;
  onDelete: (id: number) => void;
}

export function PortfolioTable({ items, onEdit, onArchive, onDelete }: PortfolioTableProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-500/10 mb-4">
          <Archive className="w-8 h-8 text-violet-500" />
        </div>
        <p className="text-gray-400 text-lg">No items found</p>
        <p className="text-gray-500 text-sm mt-1">Create your first portfolio item to get started</p>
      </div>
    );
  }

  return (
    <div className="stat-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/8">
              <th className="text-left p-4 text-sm font-semibold text-gray-400">Image</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-400">Title</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-400">Category</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-400">Created</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-400">Status</th>
              <th className="text-right p-4 text-sm font-semibold text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className={cn(
                  "border-b border-white/8 transition-colors hover:bg-white/5",
                  item.isDeleted && "opacity-60"
                )}
              >
                <td className="p-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-black/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-white font-medium">{item.title}</span>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-green-800/30 text-lime-400 border border-lime-400/20">
                    {item.category_name}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-gray-400">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString()
                      : "N/A"}
                  </span>
                </td>
                <td className="p-4">
                  {item.isDeleted ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                      ARCHIVED
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-lime-400/20 text-lime-400 border border-lime-400/30">
                      ACTIVE
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(item.id)}
                      className="hover:bg-white/10 hover:text-violet-400"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onArchive(item.id, item.isDeleted)}
                      className="hover:bg-white/10 hover:text-lime-400"
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
                      className="hover:bg-red-500/20 hover:text-red-400"
                      title="Delete permanently"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
