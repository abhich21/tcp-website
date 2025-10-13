import Hero from "@/components/Hero/Hero";
import ShowReel from "@/components/ShowReel/ShowReels";
import PortfolioSection from "@/components/portfolio-section/PortfolioSection";
// Import the new wrapper component
import DarkVeilWrapper from "@/components/bg/DarkVeilWrapper"; 


export default function Home() {
  return (
    <main>
      {/* USE THE WRAPPER: Replaces the direct dynamic import block */}
      <DarkVeilWrapper />
      
      <Hero />
      <ShowReel />
      <PortfolioSection />
    </main>
  );
}