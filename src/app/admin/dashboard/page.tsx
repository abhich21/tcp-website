"use client";

import { useState, useEffect } from "react";
import { Images, MessageSquare, FolderTree } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { PageHeader } from "@/components/admin/PageHeader";

export default function AdminDashboardPage() {
  // Static data for UI demonstration (no API calls)
  const [stats] = useState({
    portfolioItems: {
      total: 24,
      active: 20,
      archived: 4,
    },
    messages: {
      total: 12,
      unread: 3,
    },
    categories: {
      total: 8,
    },
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome to the TCP Admin Panel"
      />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Portfolio Items"
          value={stats.portfolioItems.total}
          icon={Images}
          href="/admin/portfolio"
          subtitle={`${stats.portfolioItems.active} active, ${stats.portfolioItems.archived} archived`}
        />

        <StatCard
          title="Unread Messages"
          value={stats.messages.unread}
          icon={MessageSquare}
          href="/admin/messages"
          subtitle={`${stats.messages.total} total messages`}
        />

        <StatCard
          title="Categories"
          value={stats.categories.total}
          icon={FolderTree}
        />
      </div>

      {/* Recent Activity Section (Placeholder) */}
      <div className="stat-card">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-violet-500"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-300">Sample activity #{item}</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
