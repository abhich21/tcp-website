"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/admin/PageHeader";
import { Pagination } from "@/components/admin/Pagination";
import { ViewToggle } from "@/components/admin/ViewToggle";
import { PortfolioGrid } from "@/components/admin/PortfolioGrid";
import { PortfolioTable } from "@/components/admin/PortfolioTable";

interface PortfolioItem {
  id: number;
  title: string;
  category_name: string;
  image: string;
  isDeleted: boolean;
  created_at?: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type ViewMode = "grid" | "table";

export default function PortfolioPage() {
  const router = useRouter();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 1,
  });
  
  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchItems = async (params?: { page?: number; search?: string }) => {
    try {
      setLoading(true);
      setError("");
      
      const page = params?.page ?? 1;
      const search = params?.search ?? searchQuery;
      
      // Build URL with query parameters
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: String(pagination.limit),
      });
      
      if (search && search.trim()) {
        queryParams.set("search", search.trim());
      }
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/portfolio?${queryParams.toString()}`, {
          credentials: 'include'
        });
      if (!res.ok) throw new Error("Failed to fetch items");
      const data = await res.json();

      if (data.data && data.pagination) {
        setItems(data.data);
        setPagination(data.pagination);
      } else {
        setItems(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setError("Failed to load portfolio items");
      console.error("Error fetching portfolio items:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchItems({ page: 1 });
  }, []);
  
  // Debounced search effect
  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set new timer for debounce (350ms)
    debounceTimerRef.current = setTimeout(() => {
      // Reset to page 1 when search changes
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchItems({ page: 1, search: searchQuery });
    }, 350);
    
    // Cleanup on unmount or when searchQuery changes
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  const handlePageChange = (newPage: number) => {
    fetchItems({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/portfolio/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this item?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/portfolio/${id}/permanent`, {
        credentials: 'include',
        method: "DELETE",
      });
      if (res.ok) {
        fetchItems({ page: pagination.page });
      } else {
        alert("Failed to delete item");
      }
    } catch (error) {
      alert("Error deleting item");
    }
  };

  const handleArchive = async (id: number, isDeleted: boolean) => {
    const action = isDeleted ? "unarchive" : "archive";
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/portfolio/${id}/${action}`, {
        credentials: 'include',
        method: "PUT",
      });
      if (res.ok) {
        fetchItems({ page: pagination.page });
      } else {
        alert(`Failed to ${action} item`);
      }
    } catch (error) {
      alert(`Error ${action}ing item`);
    }
  };

  const filteredItems = items.filter((item) =>
    activeTab === "active" ? !item.isDeleted : item.isDeleted
  );

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Page Header */}
      <PageHeader
        title="Portfolio"
        subtitle="Manage your portfolio items"
        action={{
          label: "Add New",
          href: "/admin/portfolio/new",
          icon: Plus,
        }}
      />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search Bar */}
      <div className="relative w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by title or description..."
            aria-label="Search portfolio"
            className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1d] border border-white/8 rounded-lg text-white placeholder-gray-500 font-[family-name:var(--font-montserrat)] text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all duration-200"
          />
        </div>
      </div>

      {/* Tabs and View Toggle */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Tabs
          defaultValue="active"
          onValueChange={(value) => setActiveTab(value as "active" | "archived")}
          className="flex-1"
        >
          <TabsList className="bg-[#1a1a1d] border border-white/8">
            <TabsTrigger 
              value="active" 
              className="data-[state=active]:bg-violet-500 data-[state=active]:text-white transition-all duration-200 font-[family-name:var(--font-montserrat)]"
            >
              Active
            </TabsTrigger>
            <TabsTrigger 
              value="archived" 
              className="data-[state=active]:bg-violet-500 data-[state=active]:text-white transition-all duration-200 font-[family-name:var(--font-montserrat)]"
            >
              Archived
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <ViewToggle view={viewMode} onViewChange={setViewMode} />
      </div>

      {/* Content */}
      <Tabs value={activeTab} className="w-full">
        <TabsContent value="active" className="mt-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <PortfolioGrid
                  items={filteredItems}
                  onEdit={handleEdit}
                  onArchive={handleArchive}
                  onDelete={handleDelete}
                />
              ) : (
                <PortfolioTable
                  items={filteredItems}
                  onEdit={handleEdit}
                  onArchive={handleArchive}
                  onDelete={handleDelete}
                />
              )}

              {filteredItems.length > 0 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    totalItems={pagination.total}
                    itemsPerPage={pagination.limit}
                  />
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="archived" className="mt-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <PortfolioGrid
                  items={filteredItems}
                  onEdit={handleEdit}
                  onArchive={handleArchive}
                  onDelete={handleDelete}
                />
              ) : (
                <PortfolioTable
                  items={filteredItems}
                  onEdit={handleEdit}
                  onArchive={handleArchive}
                  onDelete={handleDelete}
                />
              )}

              {filteredItems.length > 0 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    totalItems={pagination.total}
                    itemsPerPage={pagination.limit}
                  />
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
