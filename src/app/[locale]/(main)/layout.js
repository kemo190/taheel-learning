import Navbar from "@/components/layout/Navbar";

export default async function MainLayout({ children, params }) {
  const { locale } = await params;
  return (
    <>
      <Navbar locale={locale} />
      {children}
    </>
  );
}
