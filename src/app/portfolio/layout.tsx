// Removed dynamic import here
// import GalaxyWrapper from '@/components/bg/GalaxyWrapper'; 

import DarkVeilWrapper from "@/components/bg/DarkVeilWrapper";

export default function PortfolioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* USE THE WRAPPER: Replaces the direct dynamic import block */}
      <DarkVeilWrapper />
      {/* The page content */}
      {children}
    </>
  );
}