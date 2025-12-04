"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import "../../styles/admin-theme.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Skip auth check for login page
      if (pathname === "/admin/login") {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/auth/me`);
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          router.push(`/admin/login`);
        }
      } catch (error) {
        console.error("Auth check failed", error);
        router.push(`/admin/login`);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0e0e10]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
      </div>
    );
  }

  // Render simple layout for login page
  if (pathname === "/admin/login") {
    return <div className="admin-layout font-admin">{children}</div>;
  }

  // Render full admin layout for authenticated pages
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="admin-layout font-admin">
      <Sidebar 
        isExpanded={sidebarExpanded} 
        onToggle={() => setSidebarExpanded(!sidebarExpanded)} 
      />
      
      <main 
        className={`admin-main ${
          sidebarExpanded ? 'admin-main-expanded' : 'admin-main-collapsed'
        }`}
      >
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
