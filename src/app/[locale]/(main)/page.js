import HeroSection from "@/components/home/HeroSection";
import CoursesSection from "@/components/home/CoursesSection";
import { getDictionary } from "@/dictionaries/getDictionary";

export default async function Home({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <main className="min-h-screen">
      <HeroSection 
        title={dict.hero.title}
        subtitle={dict.hero.subtitle}
        primaryButtonText={dict.hero.primaryButton}
        secondaryButtonText={dict.hero.secondaryButton}
        locale={locale}
      />
      <CoursesSection dict={dict} locale={locale} />
    </main>
  );
}

// Trigger CodeRabbit review
