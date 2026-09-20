import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import TracksShowcase from "@/components/home/TracksShowcase";
import CtaSection from "@/components/home/CtaSection";
import { getDictionary } from "@/dictionaries/getDictionary";

export default async function Home({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero: big centered headline + CTAs */}
      <HeroSection
        title={dict.hero?.title}
        subtitle={dict.hero?.subtitle}
        primaryButtonText={dict.hero?.primaryButton}
        secondaryButtonText={dict.hero?.secondaryButton}
        locale={locale}
      />

      {/* 2. Stats strip: trust numbers right under the hero */}
      <StatsSection locale={locale} />

      {/* 3. Why us: 4 feature cards */}
      <FeaturesSection locale={locale} />

      {/* 4. Real tracks from DB */}
      <TracksShowcase locale={locale} />

      {/* 5. Final CTA */}
      <CtaSection locale={locale} />
    </main>
  );
}


