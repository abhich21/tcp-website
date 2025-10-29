import type { Metadata } from "next";
import { Inter, Montserrat} from "next/font/google";
import DarkVeil from '../components/bg/DarkVeil';
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
      <body className={`${inter.variable} ${montserrat.variable} bg-[#0D0D0D] text-white`}>
        
        {/* 1. Background Component Container */}
        <div className="fixed top-0 left-0 w-full h-screen -z-10 ">
          <DarkVeil 
            noiseIntensity={0.05} 
            hueShift={332}
          />
        </div>

        {/* 2. Your page content sits on top */}
        <Header />
        {children}
        
      </body>
 
    </html>
  );
}