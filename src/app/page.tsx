import Hero from "@/components/Hero/Hero"; // 1. Import Hero
import ShowReel from "@/components/ShowReel/ShowReels";

export default function Home() {
  return (
    <main>
      <Hero /> {/* 2. Add the Hero component here */}
      <ShowReel />
    </main>
  );
}