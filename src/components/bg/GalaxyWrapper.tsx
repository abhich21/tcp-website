'use client';

import dynamic from 'next/dynamic';

// Dynamic import with ssr: false MUST be done in a Client Component file
const Galaxy = dynamic(() => import('@/components/bg/Galaxy'), { ssr: false });

// Create a wrapper component that uses the dynamically loaded Galaxy
export default function GalaxyWrapper() {
  return (
    <div className="fixed top-0 left-0 w-full h-screen -z-10 ">
      <Galaxy
         mouseRepulsion={true}
         mouseInteraction={true}
         density={1.5}
         glowIntensity={0.5}
         saturation={0.8}
         hueShift={240}
      />
    </div>
  );
}