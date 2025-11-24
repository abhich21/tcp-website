import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { LayoutContent } from "./LayoutContent";

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
      <body className={`${inter.variable} ${montserrat.variable} bg-[#0D0D0D] text-white`}>
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}