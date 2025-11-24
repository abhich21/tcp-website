"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PortfolioForm } from "@/components/admin/PortfolioForm";

export default function EditPortfolioPage() {
  const params = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/portfolio/${params.id}`);
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

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Item not found</div>;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Edit Portfolio Item</h1>
      <PortfolioForm initialData={data} isEditing />
    </div>
  );
}
