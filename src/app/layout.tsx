import type { Metadata } from "next";
import { Inter, Montserrat} from "next/font/google"; // 1. Import Montserrat

import "./globals.css";
import Header from "@/components/Header/Header";


const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// 2. Create the Montserrat font instance with a CSS variable
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat", // The name of our CSS variable
  weight: ["400", "700"],       // You can specify which weights to load
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
      {/* 3. Apply the font variables to the body */}
      <body className={`${inter.variable} ${montserrat.variable} bg-[#0D0D0D] text-white`}>
        <Header />
        
        {children}
      </body>
    </html>
  );
}