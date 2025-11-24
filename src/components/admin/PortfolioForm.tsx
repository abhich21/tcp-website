"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, X } from "lucide-react";

interface PortfolioFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export function PortfolioForm({ initialData, isEditing = false }: PortfolioFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form State
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [categoryId, setCategoryId] = useState(initialData?.category_id || "");
  const [type, setType] = useState(initialData?.details?.[0]?.type || "image");
  const [videoUrl, setVideoUrl] = useState(initialData?.details?.[0]?.url || "");
  
  // File State
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  
  // Existing Files State (for editing)
  const [existingCoverUrl, setExistingCoverUrl] = useState(initialData?.image || "");
  const [existingGallery, setExistingGallery] = useState<any[]>(
    initialData?.details?.filter((d: any) => d.type === 'image') || []
  );

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setGalleryFiles(Array.from(e.target.files));
    }
  };

  const removeExistingGalleryItem = (urlToRemove: string) => {
    setExistingGallery(prev => prev.filter(item => item.url !== urlToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category_id", categoryId.toString());
      formData.append("type", type);

      if (type === "image") {
        // Append new files
        galleryFiles.forEach((file) => {
          formData.append("files", file);
        });
        
        // Append list of KEPT existing files (for backend merge logic)
        if (isEditing) {
          const keptUrls = existingGallery.map(item => item.url);
          formData.append("existing_files", JSON.stringify(keptUrls));
        }
      } else {
        formData.append("url", videoUrl);
      }

      if (coverImage) {
        formData.append("image", coverImage);
      }

      const url = isEditing 
        ? `/api/admin/portfolio/${initialData.id}`
        : "/api/admin/portfolio";
        
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to save portfolio item");
      }

      router.push("/admin/portfolio");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category ID</Label>
            <Input
              id="category"
              type="number"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              placeholder="e.g. 1"
            />
            <p className="text-xs text-muted-foreground">
              (Temporary: Enter ID manually until category fetch is implemented)
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cover Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {existingCoverUrl && !coverImage && (
                <div className="relative aspect-video w-40 overflow-hidden rounded-md border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={existingCoverUrl} alt="Cover" className="h-full w-full object-cover" />
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                required={!isEditing}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Content Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="type">Content Type</Label>
            <select
              id="type"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="image">Image Gallery</option>
              <option value="youtube">YouTube Video</option>
              <option value="vimeo">Vimeo Video</option>
            </select>
          </div>

          {type === "image" ? (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Add New Images</Label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryChange}
                />
              </div>
              
              {/* Existing Gallery Preview */}
              {existingGallery.length > 0 && (
                <div className="space-y-2">
                  <Label>Existing Gallery</Label>
                  <div className="flex flex-wrap gap-4">
                    {existingGallery.map((item, idx) => (
                      <div key={idx} className="relative h-24 w-24 overflow-hidden rounded-md border group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.url} alt="Gallery" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeExistingGalleryItem(item.url)}
                          className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/..."
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEditing ? "Update Item" : "Create Item"}
        </Button>
      </div>
    </form>
  );
}
