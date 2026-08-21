import HeroSection from "@/components/home/HeroSection";
import { getDictionary } from "@/dictionaries/getDictionary";

export default async function Home({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div className="w-full">
      <HeroSection 
        title={dict.hero.title}
        subtitle={dict.hero.subtitle}
        primaryButtonText={dict.hero.primaryButton}
        secondaryButtonText={dict.hero.secondaryButton}
      />
    </div>
  );
}
