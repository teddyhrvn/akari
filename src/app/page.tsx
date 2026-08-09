import { DiscoverSection } from "@/components/discover-section";
import { HomeHero } from "@/components/home-hero";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />

      <main>
        <HomeHero />
        <DiscoverSection />
      </main>

      <Footer />
    </div>
  );
}