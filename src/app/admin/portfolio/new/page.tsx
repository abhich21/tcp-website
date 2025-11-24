"use client";

import { PortfolioForm } from "@/components/admin/PortfolioForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { ArrowLeft } from "lucide-react";

export default function NewPortfolioPage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader
        title="Create Portfolio Item"
        subtitle="Add a new item to your portfolio"
        action={{
          label: "Back to Portfolio",
          href: "/admin/portfolio",
          icon: ArrowLeft,
        }}
      />
      <PortfolioForm />
    </div>
  );
}
