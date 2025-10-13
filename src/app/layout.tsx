import type { Metadata } from "next";
import { Inter, Montserrat} from "next/font/google";
// REMOVED: import DarkVeil from '../components/bg/DarkVeil';
import "./globals.css";
import Header from "@/components/Header/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "CloudPlay XP | High Impact Design for Brands",
  description: "Recreation of the CloudPlay XP website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Font variables and base styling are kept here for all pages */}
      <body className={`${inter.variable} ${montserrat.variable} bg-[#0D0D0D] text-white`}>
        
        
        {/* REMOVED: Background Component Container is moved to page.tsx / portfolio/layout.tsx */}
        {/* The Header (navbar) remains here to wrap all content */}
        <Header />
        {children}
        
      </body>
    </html>
  );
}