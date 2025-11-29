// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { LayoutContent } from "./LayoutContent";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
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
      <body
        className={`${inter.variable} ${montserrat.variable} bg-[#0D0D0D] text-white`}
      >
        {/* SITE-LEVEL BACKGROUND LAYER
            - This element sits behind everything (z-0)
            - It contains the actual visual (image/gradient/fog) to be blurred by backdrop-filter
            - pointer-events:none so it never blocks interaction
         */}
       

        <SmoothScroll>
          <LayoutContent>{children}</LayoutContent>
        </SmoothScroll>
      </body>
    </html>
  );
}
