"use client";

export function AdminHeader() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px]">
      <div className="w-full flex-1">
        {/* Add search or breadcrumbs here if needed */}
      </div>
      <div className="flex items-center gap-4">
        {/* Add user profile dropdown or notifications here if needed */}
      </div>
    </header>
  );
}
