"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuditLogsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
      <Card>
        <CardHeader>
          <CardTitle>System Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Audit logging is enabled but the viewer is coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
