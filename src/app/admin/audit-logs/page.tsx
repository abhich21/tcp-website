"use client";

import { useEffect, useState } from "react";
import { FileText, Search, Eye } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AuditLog {
  id: number;
  actor: string;
  action: string;
  tableName: string;
  recordId: number;
  diff: {
    before: any;
    after: any;
  };
  createdAt: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState<string>("ALL");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/audit-logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
        setFilteredLogs(data);
      } else {
        setLogs([]);
        setFilteredLogs([]);
      }
    } catch (err) {
      console.error("Error fetching audit logs:", err);
      setLogs([]);
      setFilteredLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    let filtered = logs;

    // Filter by action
    if (filterAction !== "ALL") {
      filtered = filtered.filter((log) => log.action === filterAction);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.tableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.action.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  }, [logs, filterAction, searchTerm]);

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-lime-400/20 text-lime-400 border-lime-400/30";
      case "UPDATE":
        return "bg-yellow-400/20 text-yellow-400 border-yellow-400/30";
      case "DELETE":
        return "bg-red-400/20 text-red-400 border-red-400/30";
      default:
        return "bg-gray-400/20 text-gray-400 border-gray-400/30";
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
        title="Audit Logs"
        subtitle="Track all admin actions and changes"
      />

      {logs.length === 0 ? (
        <EmptyState
          title="No Audit Logs Yet"
          description="Admin actions will be logged and displayed here for accountability"
          icon={FileText}
        />
      ) : (
        <>
          {/* Filters */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#1a1a1d] border-white/8 text-white placeholder:text-gray-500 focus:border-violet-500"
              />
            </div>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-4 py-2 rounded-md bg-[#1a1a1d] border border-white/8 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 font-[family-name:var(--font-montserrat)]"
            >
              <option value="ALL">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-[#1a1a1d] border border-white/8 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/8 bg-white/5">
                    <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider font-[family-name:var(--font-montserrat)]">
                      Timestamp
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider font-[family-name:var(--font-montserrat)]">
                      Actor
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider font-[family-name:var(--font-montserrat)]">
                      Action
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider font-[family-name:var(--font-montserrat)]">
                      Entity
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider font-[family-name:var(--font-montserrat)]">
                      Record ID
                    </th>
                    <th className="text-right p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider font-[family-name:var(--font-montserrat)]">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-white/8 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <span className="text-sm text-gray-400 font-[family-name:var(--font-montserrat)]">
                          {new Date(log.createdAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-violet-400 font-medium font-[family-name:var(--font-montserrat)]">
                          {log.actor}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold border font-[family-name:var(--font-montserrat)] ${getActionColor(
                            log.action
                          )}`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-300 font-[family-name:var(--font-montserrat)]">
                          {log.tableName}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-400 font-mono">
                          #{log.recordId}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                          className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredLogs.length === 0 && logs.length > 0 && (
              <div className="text-center py-12 text-gray-400 font-[family-name:var(--font-montserrat)]">
                No logs match your search criteria
              </div>
            )}
          </div>
        </>
      )}

      {/* Detail Modal */}
      {selectedLog && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedLog(null)}
        >
          <div
            className="bg-[#1a1a1d] border border-white/8 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-white/8">
              <h2 className="text-xl font-semibold text-white font-[family-name:var(--font-montserrat)]">
                Audit Log Details
              </h2>
              <p className="text-sm text-gray-400 mt-1 font-[family-name:var(--font-montserrat)]">
                {selectedLog.action} on {selectedLog.tableName} #{selectedLog.recordId} by{" "}
                <span className="text-violet-400">{selectedLog.actor}</span>
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-2 overflow-y-auto max-h-[calc(80vh-140px)]">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Before */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-3 font-[family-name:var(--font-montserrat)]">
                    BEFORE
                  </h3>
                  <div className="bg-black/20 rounded-lg p-4 border border-white/8">
                    <pre className="text-xs text-gray-300 overflow-x-auto font-mono">
                      {JSON.stringify(selectedLog.diff.before, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* After */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-3 font-[family-name:var(--font-montserrat)]">
                    AFTER
                  </h3>
                  <div className="bg-black/20 rounded-lg p-4 border border-white/8">
                    <pre className="text-xs text-gray-300 overflow-x-auto font-mono">
                      {JSON.stringify(selectedLog.diff.after, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-white/8 flex justify-end">
              <Button
                onClick={() => setSelectedLog(null)}
                className="bg-violet-500 hover:bg-violet-600 text-white font-[family-name:var(--font-montserrat)] m-2 "
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
