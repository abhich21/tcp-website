"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, FolderTree, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Category {
  id: number;
  name: string;
  _count?: {
    portfolioItems: number;
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      } else {
        const errorText = await res.text();
        console.error("Fetch failed:", res.status, errorText);
        setError(`Failed to load categories: ${res.status} ${res.statusText}`);
        setCategories([]);
      }
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      setError(`Failed to load categories: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name });
    } else {
      setEditingCategory(null);
      setFormData({ name: "" });
    }
    setIsModalOpen(true);
    setError("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: "" });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : "/api/admin/categories";
      
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        handleCloseModal();
        fetchCategories();
      } else {
        setError(data.message || "Operation failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, count: number) => {
    if (count > 0) {
      alert(`Cannot delete category with ${count} items. Please reassign them first.`);
      return;
    }

    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete category");
      }
    } catch (error) {
      alert("Error deleting category");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Categories"
        subtitle="Manage portfolio categories"
        action={{
          label: "Add Category",
          onClick: () => handleOpenModal(),
          icon: Plus,
        }}
      />

      {error && !isModalOpen && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-[family-name:var(--font-montserrat)] flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {categories.length === 0 ? (
        <EmptyState
          title="No Categories Found"
          description="Create your first category to organize your portfolio items."
          icon={FolderTree}
          action={{
            label: "Create Category",
            onClick: () => handleOpenModal(),
          }}
        />
      ) : (
        <div className="bg-[#1a1a1d] border border-white/8 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8 bg-white/5">
                  <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider font-[family-name:var(--font-montserrat)]">
                    Name
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider font-[family-name:var(--font-montserrat)]">
                    Items
                  </th>
                  <th className="text-right p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider font-[family-name:var(--font-montserrat)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-white/8 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <span className="text-sm text-white font-medium font-[family-name:var(--font-montserrat)]">
                        {category.name}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-gray-300 font-[family-name:var(--font-montserrat)]">
                        {category._count?.portfolioItems || 0} items
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenModal(category)}
                          className="text-gray-400 hover:text-violet-400 hover:bg-violet-500/10"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category.id, category._count?.portfolioItems || 0)}
                          className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                          disabled={(category._count?.portfolioItems || 0) > 0}
                          title={(category._count?.portfolioItems || 0) > 0 ? "Cannot delete category with items" : "Delete category"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#1a1a1d] border border-white/8 rounded-xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-white/8">
              <h2 className="text-lg font-semibold text-white font-[family-name:var(--font-montserrat)]">
                {editingCategory ? "Edit Category" : "New Category"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                {error && (
                  <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-sm text-red-400 font-[family-name:var(--font-montserrat)]">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300 font-[family-name:var(--font-montserrat)]">
                    Category Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ name: e.target.value })}
                    placeholder="e.g. Web Design"
                    className="bg-black/20 border-white/8 text-white placeholder:text-gray-600 focus:border-violet-500"
                    autoFocus
                  />
                </div>
              </div>

              <div className="p-6 border-t border-white/8 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  className="border-white/8 bg-transparent hover:bg-white/5 text-gray-300 hover:text-white font-[family-name:var(--font-montserrat)]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting || !formData.name.trim()}
                  className="bg-violet-500 hover:bg-violet-600 text-white font-[family-name:var(--font-montserrat)]"
                >
                  {submitting ? "Saving..." : editingCategory ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
