import { LayoutGrid, Table } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewToggleProps {
  view: "grid" | "table";
  onViewChange: (view: "grid" | "table") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-[#1a1a1d] border border-white/8 rounded-lg p-1">
      <button
        onClick={() => onViewChange("grid")}
        className={cn(
          "px-3 py-2 rounded-md transition-all flex items-center gap-2 text-sm font-medium",
          view === "grid"
            ? "bg-violet-500 text-white shadow-sm"
            : "text-gray-400 hover:text-white hover:bg-white/5"
        )}
        aria-label="Grid view"
      >
        <LayoutGrid className="w-4 h-4" />
        {view === "grid" && <span className="hidden sm:inline">Grid</span>}
      </button>
      <button
        onClick={() => onViewChange("table")}
        className={cn(
          "px-3 py-2 rounded-md transition-all flex items-center gap-2 text-sm font-medium",
          view === "table"
            ? "bg-violet-500 text-white shadow-sm"
            : "text-gray-400 hover:text-white hover:bg-white/5"
        )}
        aria-label="Table view"
      >
        <Table className="w-4 h-4" />
        {view === "table" && <span className="hidden sm:inline">Table</span>}
      </button>
    </div>
  );
}
