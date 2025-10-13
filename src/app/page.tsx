import Hero from "@/components/Hero/Hero"; // 1. Import Hero
import ShowReel from "@/components/ShowReel/ShowReels";
import PortfolioSection from "@/components/portfolio-section/PortfolioSection";

export default function Home() {
  return (
    <main>
      <Hero /> {/* 2. Add the Hero component here */}
      <ShowReel />
      <PortfolioSection /> {/* 2. Add the new section */}
    </main>
  );
}