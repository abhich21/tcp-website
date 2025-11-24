"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Archive, RotateCcw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PortfolioItem {
  id: number;
  title: string;
  category_name: string;
  image: string;
  isDeleted: boolean;
}

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/portfolio");
      if (!res.ok) throw new Error("Failed to fetch items");
      const data = await res.json();
      // Backend returns { data: [...], pagination: {...} }
      setItems(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError("Failed to load portfolio items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchItems();
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
      const res = await fetch(`/api/admin/portfolio/${id}/${action}`, { method: "PUT" });
      if (res.ok) {
        fetchItems();
      } else {
        alert(`Failed to ${action} item`);
      }
    } catch (error) {
      alert(`Error ${action}ing item`);
    }
  };

  const filteredItems = items.filter(item => 
    activeTab === "active" ? !item.isDeleted : item.isDeleted
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Portfolio</h1>
        <Button onClick={() => window.location.href = '/admin/portfolio/new'}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="active" onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.length === 0 && <p className="text-muted-foreground col-span-full">No active items found.</p>}
            {filteredItems.map((item) => (
              <PortfolioItemCard key={item.id} item={item} onArchive={handleArchive} onDelete={handleDelete} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="archived" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.length === 0 && <p className="text-muted-foreground col-span-full">No archived items found.</p>}
            {filteredItems.map((item) => (
              <PortfolioItemCard key={item.id} item={item} onArchive={handleArchive} onDelete={handleDelete} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PortfolioItemCard({ item, onArchive, onDelete }: { item: PortfolioItem, onArchive: (id: number, isDeleted: boolean) => void, onDelete: (id: number) => void }) {
  return (
    <Card className={item.isDeleted ? "opacity-60" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {item.title}
        </CardTitle>
        {item.isDeleted && <span className="text-xs text-red-500 font-bold">ARCHIVED</span>}
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full overflow-hidden rounded-md bg-muted mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="text-xs text-muted-foreground mb-4">
          Category: {item.category_name}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="icon" onClick={() => window.location.href = `/admin/portfolio/${item.id}`}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onArchive(item.id, item.isDeleted)}
            title={item.isDeleted ? "Restore" : "Archive"}
          >
            {item.isDeleted ? <RotateCcw className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
          </Button>
          <Button 
            variant="destructive" 
            size="icon"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
