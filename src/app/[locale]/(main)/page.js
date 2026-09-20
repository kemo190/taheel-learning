import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import TracksShowcase from "@/components/home/TracksShowcase";
import CtaSection from "@/components/home/CtaSection";
import { getDictionary } from "@/dictionaries/getDictionary";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default async function Home({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero: big centered headline + CTAs */}
      <ScrollReveal direction="up" delay={0.1}>
        <HeroSection
          title={dict.hero?.title}
          subtitle={dict.hero?.subtitle}
          primaryButtonText={dict.hero?.primaryButton}
          secondaryButtonText={dict.hero?.secondaryButton}
          locale={locale}
        />
      </ScrollReveal>

      {/* 2. Stats strip: trust numbers right under the hero */}
      <ScrollReveal direction="up" delay={0.2}>
        <StatsSection locale={locale} />
      </ScrollReveal>

      {/* 3. Why us: 4 feature cards */}
      <ScrollReveal direction="up" delay={0.1}>
        <FeaturesSection locale={locale} />
      </ScrollReveal>

      {/* 4. Real tracks from DB */}
      <ScrollReveal direction="up" delay={0.1}>
        <TracksShowcase locale={locale} />
      </ScrollReveal>

      {/* 5. Final CTA */}
      <ScrollReveal direction="up" delay={0.1}>
        <CtaSection locale={locale} />
      </ScrollReveal>
    </main>
  );
}


