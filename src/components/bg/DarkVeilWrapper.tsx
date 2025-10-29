'use client';

import dynamic from 'next/dynamic';

// Dynamic import with ssr: false MUST be done in a Client Component file
const DarkVeil = dynamic(() => import('@/components/bg/DarkVeil'), { ssr: false });

// Create a wrapper component that uses the dynamically loaded DarkVeil
export default function DarkVeilWrapper() {
  return (
    <div className="fixed top-0 left-0 w-full h-screen -z-10 ">
      <DarkVeil 
        noiseIntensity={0.05} 
        hueShift={220}
      />
    </div>
  );
}