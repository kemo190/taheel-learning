import "../globals.css";
import { IBM_Plex_Sans_Arabic } from "next/font/google";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Taheel | تأهيل",
  description: "منصة تأهيل التعليمية والتوظيفية",
};

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default async function RootLayout({ children, params }) {
  // Await params per Next.js App Router latest conventions
  const { locale } = await params;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body
        className={`${ibmPlexSansArabic.className} bg-[#f3f7ff] text-gray-900 antialiased min-h-screen`}
      >
        <main>{children}</main>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          rtl={dir === "rtl"}
          theme="light"
        />
      </body>
    </html>
  );
}

// Trigger CodeRabbit review
