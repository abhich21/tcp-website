"use client";

import { PortfolioForm } from "@/components/admin/PortfolioForm";

export default function NewPortfolioPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Create Portfolio Item</h1>
      <PortfolioForm />
    </div>
  );
}
