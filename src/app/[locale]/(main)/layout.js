import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default async function MainLayout({ children, params }) {
  const { locale } = await params;
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar locale={locale} />
      <main className="flex-grow">{children}</main>
      <Footer locale={locale} />
    </div>
  );
}

// Trigger CodeRabbit review
