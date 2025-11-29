"use client";

import { usePathname } from "next/navigation";
import DarkVeil from '../components/bg/DarkVeil';
import Header from "@/components/Header/Header";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <>
      {/* Only show DarkVeil and Header for public pages */}
      {!isAdminRoute && (
        <>
          {/* Background Component Container */}
          <div className="fixed top-0 left-0 w-full h-screen -z-10">
            <DarkVeil 
              noiseIntensity={0.05} 
              hueShift={332}
            />
          </div>

          {/* Public Header */}
          <Header />
        </>
      )}
      
      {children}
    </>
  );
}
