"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PortfolioForm } from "@/components/admin/PortfolioForm";
import { Button } from "@/components/ui/button";

import { PageHeader } from "@/components/admin/PageHeader";
import { ArrowLeft } from "lucide-react";

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  category_id: number;
  image: string;
  details: any[];
}

export default function EditPortfolioPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/portfolio/${params.id}`);
        if (res.ok) {
          const item = await res.json();
          setData(item);
        }
      } catch (error) {
        console.error("Failed to fetch item", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <p>Item not found</p>
        <Button variant="link" onClick={() => router.push("/admin/portfolio")}>
          Back to Portfolio
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader
        title="Edit Portfolio Item"
        subtitle={`Editing: ${data.title}`}
        action={{
          label: "Back to Portfolio",
          href: "/admin/portfolio",
          icon: ArrowLeft,
        }}
      />
      <PortfolioForm initialData={data} isEditing />
    </div>
  );
}
