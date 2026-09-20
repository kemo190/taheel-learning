import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import TracksGridClient from "./TracksGridClient";

export default async function TracksShowcase({ locale = "ar" }) {
  const isRtl = locale === "ar";

  const supabase = await createClient();
  const { data: tracks } = await supabase
    .from("tracks")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (!tracks || tracks.length === 0) return null;

  return (
    <section className="w-full bg-white py-16 lg:py-20" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-2xl font-medium text-[#0b2646] mb-8 inline-block border-b border-slate-200 pb-3 px-2">
            المسارات
          </h2>
        </div>

        <TracksGridClient tracks={tracks} locale={locale} />

      </div>
    </section>
  );
}
