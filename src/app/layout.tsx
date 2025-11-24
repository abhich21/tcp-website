"use client";

import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { usePathname } from "next/navigation";
import DarkVeil from '../components/bg/DarkVeil';
import "./globals.css";
import Header from "@/components/Header/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <html lang="en">
      <body className={`${inter.variable} ${montserrat.variable} bg-[#0D0D0D] text-white`}>
        {/* Only show DarkVeil and Header for public pages */}
        {!isAdminRoute && (
          <>
            {/* 1. Background Component Container */}
            <div className="fixed top-0 left-0 w-full h-screen -z-10">
              <DarkVeil 
                noiseIntensity={0.05} 
                hueShift={332}
              />
            </div>

            {/* 2. Public Header */}
            <Header />
          </>
        )}
        
        {children}
      </body>
    </html>
  );
}