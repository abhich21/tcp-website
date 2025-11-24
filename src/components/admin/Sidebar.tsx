"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Images,
  FolderTree,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Portfolio Items",
    href: "/admin/portfolio",
    icon: Images,
  },
  {
    title: "Categories",
    href: "#",
    icon: FolderTree,
    disabled: true,
  },
  {
    title: "Contact Messages",
    href: "/admin/messages",
    icon: MessageSquare,
  },
  {
    title: "Audit Logs",
    href: "/admin/audit-logs",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "#",
    icon: Settings,
    disabled: true,
  },
];

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export function Sidebar({ isExpanded, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <aside className={`admin-sidebar ${isExpanded ? 'admin-sidebar-expanded' : 'admin-sidebar-collapsed'}`}>
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        <div className="flex items-center justify-between p-6 border-b border-white/6">
          {isExpanded ? (
            <div className="flex items-center gap-3 logo-enter">
              <Image
                src="/Cloudplay xp white logo.png"
                alt="CloudPlayXP"
                width={32}
                height={32}
                className="rounded"
              />
              <span className="text-lg font-bold text-white">TCP Admin</span>
            </div>
          ) : (
            <div className="logo-enter mx-auto">
              <Image
                src="/Cloudplay xp white logo.png"
                alt="CloudPlayXP"
                width={32}
                height={32}
                className="rounded"
              />
            </div>
          )}
          
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? (
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.disabled ? "#" : item.href}
                  className={cn(
                    "nav-item",
                    isActive && "nav-item-active",
                    item.disabled && "nav-item-disabled"
                  )}
                  title={!isExpanded ? item.title : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isExpanded && <span>{item.title}</span>}
                  {item.disabled && isExpanded && (
                    <span className="ml-auto text-xs text-gray-500">Soon</span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Section */}
        <div className="border-t border-white/6 p-4">
          <div className={cn(
            "flex items-center gap-3 mb-3",
            !isExpanded && "justify-center"
          )}>
            <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
              <span className="text-sm font-medium text-violet-400">A</span>
            </div>
            {isExpanded && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Admin</p>
                <p className="text-xs text-gray-500 truncate">admin@tcp.com</p>
              </div>
            )}
          </div>
          
          <button
            onClick={handleLogout}
            className="nav-item w-full"
            title={!isExpanded ? "Logout" : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isExpanded && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
