"use client";

import { useState, useEffect } from "react";
import { Images, CheckCircle, Archive, MessageSquare, FolderTree } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { PageHeader } from "@/components/admin/PageHeader";

interface DashboardStats {
  portfolioTotal: number;
  portfolioActive: number;
  portfolioArchived: number;
  messageCount: number;
  auditCount: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    portfolioTotal: 0,
    portfolioActive: 0,
    portfolioArchived: 0,
    messageCount: 0,
    auditCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats({
            portfolioTotal: data.portfolioTotal || 0,
            portfolioActive: data.portfolioActive || 0,
            portfolioArchived: data.portfolioArchived || 0,
            messageCount: data.messageCount || 0,
            auditCount: data.auditCount || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        // Keep zeros on error
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome to the TCP Admin Panel"
      />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Portfolio Items"
          value={loading ? "-" : stats.portfolioTotal}
          icon={Images}
          href="/admin/portfolio"
          subtitle={loading ? "Loading..." : `${stats.portfolioTotal} total items`}
        />

        <StatCard
          title="Active Items"
          value={loading ? "-" : stats.portfolioActive}
          icon={CheckCircle}
          href="/admin/portfolio"
          subtitle={loading ? "Loading..." : `${stats.portfolioActive} active items`}
        />

        <StatCard
          title="Archived Items"
          value={loading ? "-" : stats.portfolioArchived}
          icon={Archive}
          href="/admin/portfolio"
          subtitle={loading ? "Loading..." : `${stats.portfolioArchived} archived items`}
        />

        <StatCard
          title="Contact Messages"
          value={loading ? "-" : stats.messageCount}
          icon={MessageSquare}
          href="/admin/messages"
          subtitle={loading ? "Loading..." : `${stats.messageCount} total messages`}
        />

        <StatCard
          title="Audit Logs"
          value={loading ? "-" : stats.auditCount}
          icon={FolderTree}
          href="/admin/audit-logs"
          subtitle={loading ? "Loading..." : `${stats.auditCount} logged actions`}
        />
      </div>

      {/* Recent Activity Section */}
      <div className="stat-card">
        <h2 className="text-lg font-semibold text-white mb-4 font-[family-name:var(--font-montserrat)]">
          Recent Activity
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <div className="w-2 h-2 rounded-full bg-lime-400"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-300 font-[family-name:var(--font-montserrat)]">
                Dashboard showing detailed portfolio statistics
              </p>
              <p className="text-xs text-gray-500 font-[family-name:var(--font-montserrat)]">
                Just now
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
