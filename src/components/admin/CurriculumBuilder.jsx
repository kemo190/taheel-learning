"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { createSection, deleteSection } from "@/app/actions/adminSectionActions";
import { createSession, deleteSession } from "@/app/actions/adminSessionActions";

export default function CurriculumBuilder({ trackId, initialSections = [], initialSessions = [] }) {
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState(initialSections);
  const [sessions, setSessions] = useState(initialSessions);
  
  // States for new section
  const [newSectionTitle, setNewSectionTitle] = useState("");
  
  // States for new session
  const [activeSectionId, setActiveSectionId] = useState(null); // Which section is adding a session
  const [newSession, setNewSession] = useState({
    title_ar: "",
    video_url: "",
    duration_min: "",
    is_preview: false,
  });

  const handleAddSection = async (e) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return toast.error("عنوان القسم مطلوب");

    setLoading(true);
    try {
      const order = sections.length > 0 ? Math.max(...sections.map(s => s.order_index)) + 1 : 1;
      const res = await createSection({
        title_ar: newSectionTitle.trim(),
        track_id: trackId,
        order_index: order,
      });

      if (!res.success) throw new Error(res.error);
      toast.success("تم إضافة القسم بنجاح");
      setNewSectionTitle("");
      window.location.reload(); 
    } catch (err) {
      toast.error(err.message || "حدث خطأ");
      setLoading(false);
    }
  };

  const handleDeleteSection = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا القسم؟ (سيتم حذف المحاضرات المرتبطة به إن وجدت)")) return;
    setLoading(true);
    try {
      const res = await deleteSection(id);
      if (!res.success) throw new Error(res.error);
      toast.success("تم الحذف بنجاح");
      setSections(sections.filter(s => s.id !== id));
      setSessions(sessions.filter(s => s.section_id !== id));
    } catch (err) {
      toast.error(err.message || "حدث خطأ أثناء الحذف");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSession = async (e, sectionId) => {
    e.preventDefault();
    if (!newSession.title_ar.trim()) return toast.error("عنوان المحاضرة مطلوب");

    setLoading(true);
    try {
      const sectionSessions = sessions.filter(s => s.section_id === sectionId);
      const order = sectionSessions.length > 0 ? Math.max(...sectionSessions.map(s => s.order_index)) + 1 : 1;
      
      const res = await createSession({
        title_ar: newSession.title_ar.trim(),
        track_id: trackId,
        section_id: sectionId,
        video_url: newSession.video_url.trim() || null,
        duration_min: parseInt(newSession.duration_min) || 0,
        is_preview: newSession.is_preview,
        is_active: true,
        order_index: order,
      });

      if (!res.success) throw new Error(res.error);
      toast.success("تم إضافة المحاضرة بنجاح");
      setNewSession({ title_ar: "", video_url: "", duration_min: "", is_preview: false });
      setActiveSectionId(null);
      window.location.reload();
    } catch (err) {
      toast.error(err.message || "حدث خطأ أثناء إضافة المحاضرة");
      setLoading(false);
    }
  };

  const handleDeleteSession = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذه المحاضرة؟")) return;
    setLoading(true);
    try {
      const res = await deleteSession(id);
      if (!res.success) throw new Error(res.error);
      toast.success("تم حذف المحاضرة بنجاح");
      setSessions(sessions.filter(s => s.id !== id));
    } catch (err) {
      toast.error(err.message || "حدث خطأ أثناء الحذف");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#0b2646]">المنهج الدراسي (Curriculum)</h2>
      </div>
      
      {/* List Sections and their Sessions */}
      <div className="space-y-6">
        {sections.sort((a, b) => a.order_index - b.order_index).map((section) => {
          const sectionSessions = sessions
            .filter(s => s.section_id === section.id)
            .sort((a, b) => a.order_index - b.order_index);

          return (
            <div key={section.id} className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
              {/* Section Header */}
              <div className="flex items-center justify-between p-4 bg-gray-100/50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#0b2646] text-lg">{section.title_ar}</span>
                  <span className="bg-white px-2 py-1 rounded-md text-xs text-gray-500 border border-gray-200 shadow-sm">
                    {sectionSessions.length} محاضرة
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveSectionId(activeSectionId === section.id ? null : section.id)}
                    className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-[#0b2646] hover:bg-gray-50 transition-colors font-medium"
                  >
                    + إضافة محاضرة
                  </button>
                  <button
                    onClick={() => handleDeleteSection(section.id)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="حذف القسم"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </div>
              </div>

              {/* Sessions List */}
              <div className="p-4 space-y-2">
                {sectionSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                      <span className="font-medium text-gray-800">{session.title_ar}</span>
                      {session.is_preview && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">معاينة مجانية</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500">{session.duration_min} دقيقة</span>
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                        title="حذف المحاضرة"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </div>
                ))}

                {sectionSessions.length === 0 && activeSectionId !== section.id && (
                  <div className="text-center py-4 text-sm text-gray-400">لا توجد محاضرات في هذا القسم حتى الآن.</div>
                )}

                {/* Add Session Form inline */}
                {activeSectionId === section.id && (
                  <form onSubmit={(e) => handleAddSession(e, section.id)} className="bg-[#f8fbff] p-4 rounded-xl border border-blue-100 mt-4 space-y-4">
                    <h4 className="font-bold text-[#0b2646] text-sm mb-2">إضافة محاضرة جديدة</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="عنوان المحاضرة *"
                        value={newSession.title_ar}
                        onChange={(e) => setNewSession({...newSession, title_ar: e.target.value})}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2646]/20"
                        required
                      />
                      <input
                        type="text"
                        placeholder="رابط الفيديو (Vimeo/YouTube)"
                        value={newSession.video_url}
                        onChange={(e) => setNewSession({...newSession, video_url: e.target.value})}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2646]/20"
                        dir="ltr"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        placeholder="المدة (دقيقة)"
                        value={newSession.duration_min}
                        onChange={(e) => setNewSession({...newSession, duration_min: e.target.value})}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2646]/20 w-32"
                      />
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newSession.is_preview}
                          onChange={(e) => setNewSession({...newSession, is_preview: e.target.checked})}
                          className="rounded text-[#0b2646]"
                        />
                        متاحة للمعاينة مجاناً
                      </label>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button type="submit" disabled={loading} className="bg-[#0b2646] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#061528] transition-colors">
                        {loading ? "جاري الحفظ..." : "حفظ المحاضرة"}
                      </button>
                      <button type="button" onClick={() => setActiveSectionId(null)} className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200">
                        إلغاء
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Section Form */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="font-bold text-gray-800 mb-4">إضافة قسم جديد</h3>
        <form onSubmit={handleAddSection} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            placeholder="مثال: مقدمة إلى دراسة السوق..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2646]/20 bg-white"
            dir="rtl"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#ccfb4e] text-[#0b2646] px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#b5e045] transition-colors whitespace-nowrap shadow-sm"
          >
            {loading ? "جارٍ..." : "+ قسم جديد"}
          </button>
        </form>
      </div>
    </div>
  );
}
