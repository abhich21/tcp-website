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
        <div
          aria-hidden="true"
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{
            // Prefer a high-quality image or an SVG for the fog. If you have one, replace url('/hero-fog.jpg')
            // Fallback is a layered radial gradient to mimic the purple fog.
            backgroundImage:
              "url('/hero-fog.jpg'), radial-gradient(40% 60% at 10% 20%, rgba(128, 15, 123, 0.6), transparent 15%), radial-gradient(40% 60% at 80% 80%, rgba(53, 12, 71, 0.6), transparent 20%), linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.6))",
            backgroundSize: "cover, 60% 60%, 60% 60%, cover",
            backgroundPosition: "center, 10% 20%, 80% 80%, center",
            filter: "saturate(105%) contrast(1.03)",
          }}
        />

        <SmoothScroll>
          <LayoutContent>{children}</LayoutContent>
        </SmoothScroll>
      </body>
    </html>
  );
}
