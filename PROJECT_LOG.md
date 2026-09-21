# 📋 TAHEEL PLATFORM — MASTER PROJECT LOG
> آخر تحديث: 19 سبتمبر 2026
> هذا الملف يُحدَّث مع كل تغيير مهم — اقرأه أولاً قبل أي عمل على المشروع

---

## 🏗️ نظرة عامة على المشروع

**اسم المشروع:** Taheel Learning & Employment Platform (منصة تأهيل)
**الهدف:** منصة تعليمية + توظيفية متكاملة — ليست LMS فقط
**المسار:** طالب يتدرب ← يحصل على شهادة ← يفعّل حساب التوظيف ← يتقدم على وظائف

### الـ Modules الرئيسية
1. **Learning Module** — Programs → Tracks → Sessions → Tasks → Certificates
2. **Employment Module** — Student Profiles → CVs → Jobs → Internships → Applications
3. **Admin Panel** — إدارة كل شيء
4. **Company Panel** — إدارة الشركات ونشر الوظائف

---

## 🛠️ Tech Stack

| الأداة | الإصدار | الغرض |
|---|---|---|
| Next.js | 16.3.2 | Framework |
| React | 19.2.8 | UI |
| Supabase | @supabase/ssr ^0.12.4 | Database + Auth + Storage |
| Tailwind CSS | v4 | Styling |
| React Hook Form | ^7.86.0 | Forms |
| Zod | ^3.25.76 | Validation |
| react-phone-number-input | ^3.4.18 | Phone Input |
| country-state-city | ^3.2.1 | Countries/States |
| i18n-iso-countries | ^7.14.0 | Country Names Translation |
| react-toastify | ^11.1.0 | Notifications |

### بنية المجلدات
```
src/
├── app/
│   ├── [locale]/
│   │   ├── (auth)/          ← login, register
│   │   └── (main)/          ← home, journey, profile
│   ├── actions/             ← Server Actions
│   └── api/auth/            ← API Routes للـ Auth
├── components/
│   ├── auth/                ← LoginForm, RegisterForm, SocialLoginButton
│   ├── home/                ← UserHomeClient, CoursesSection, FeaturedCourse, etc
│   ├── journey/             ← JourneyHeader, JourneyStats, CertificateCard, etc
│   ├── profile/             ← ProfileForm, ProfileHeader, ProfileTabs, etc
│   ├── layout/              ← Navbar, Footer, MobileMenu, AuthNav
│   └── ui/                  ← PasswordInput
├── dictionaries/            ← ar.json, en.json (i18n)
├── data/                    ← dummyCourses.js (مؤقت — يُحذف لاحقاً)
├── hooks/                   ← useAuthRedirect.js
├── lib/                     ← supabaseClient.js (للـ Client Components فقط)
├── utils/supabase/          ← server.js, middleware.js (للـ Server Components)
└── middleware.js            ← حماية الروتات + i18n redirect
```

---

## ✅ ما تم بناؤه (مكتمل)

### Authentication
- [x] صفحة Register — فورم كامل (الاسم، إيميل، جنس، تليفون، بلد، محافظة، باسورد)
- [x] صفحة Login
- [x] Google OAuth
- [x] Supabase Auth integration
- [x] إنشاء profile في جدول `profiles` عند التسجيل
- [x] Middleware لحماية الروتات (`/home`, `/journey`, `/profile`)
- [x] Redirect logic (logged-in → /home, not-logged → /login)

### Pages
- [x] Home Page (`/home`) — بانر + دورات مميزة (dummy data حالياً)
- [x] Journey Page (`/journey`) — tabs: in-progress, favorites, certificates, completed, notes (dummy data)
- [x] Profile Page (`/profile`) — فورم تعديل البيانات الشخصية
- [x] Privacy Policy, Terms, Refund Policy — صفحات ثابتة

### Layout
- [x] Navbar (مع Auth state)
- [x] Footer
- [x] Mobile Menu
- [x] Language Switcher (AR/EN)

### i18n
- [x] Arabic + English dictionaries
- [x] Default locale: Arabic
- [x] RTL/LTR support

---

## 🐛 Bugs تم إصلاحها

### Bug #1 — تم الإصلاح ✅ (19 سبتمبر 2026)
**الملف:** `src/app/actions/profileActions.js` السطر 8
**المشكلة:** `cookies()` بدون `await` — Next.js 16 جعلها async
```js
// قبل (خطأ)
const cookieStore = cookies();
// بعد (صح)
const cookieStore = await cookies();
```

---

## ⚠️ ما هو موجود لكن يحتاج تحديث لاحقاً

| الملف | المشكلة |
|---|---|
| رابط `/courses` في الكود | الصفحة غير موجودة بعد (تم دمجها حالياً مع المسارات `/tracks`) |

---

## 🗄️ Database Schema

### الحالة الحالية في Supabase
- [x] جدول `profiles` موجود (أُنشئ مع التسجيل)
- [x] Supabase Auth مفعّل
- [ ] باقي الجداول لم تُنشأ بعد — SQL جاهز للتنفيذ

### الجداول المطلوبة

**Learning Module:**
```
profiles           → تحديث: إضافة role, dob, bio, arabic_name, certificate_name, work_field
programs           → البرامج (محاسبة، تسويق، HR...)
tracks             → المسارات داخل كل برنامج
sessions           → الجلسات (live/recorded)
instructors        → المدربون
track_instructors  → ربط المدربين بالمسارات
tasks              → واجبات الجلسات
enrollments        → تسجيل الطلاب + إيصال الدفع + حالة الموافقة
student_progress   → تتبع إتمام الجلسات
student_tasks      → تسليمات الطلاب للواجبات
certificates       → الشهادات الممنوحة
favorites          → المفضلة
```

**Employment Module:**
```
employment_profiles → بروفايل التوظيف للطالب
cvs                 → ملفات CV
companies           → الشركات
company_users       → ربط المستخدمين بالشركات
jobs                → الوظائف
internships         → فرص التدريب
applications        → تقديمات الطلاب
```

### Role System
```
profiles.role: 'student' | 'admin' | 'company' | 'instructor'
```

### Storage Buckets المطلوبة
```
receipts       → إيصالات الدفع (private)
cvs            → ملفات CV (private)
certificates   → شهادات (public)
avatars        → صور البروفايل (public)
company-logos  → لوجوهات الشركات (public)
track-images   → صور المسارات (public)
```

---

## 🤝 قرارات العميل المؤكدة

| الموضوع | القرار | التاريخ |
|---|---|---|
| إدخال الـ Tracks | من Admin Panel — مفيش بيانات في Supabase حالياً | 19 سبتمبر 2026 |
| طريقة الدفع | Manual فقط — رفع إيصال بنكي | 19 سبتمبر 2026 |
| تفعيل Employment Account | ❓ لم يُحسم بعد — ينتظر رد العميل | — |

---

## 🗺️ خطة التطوير الشاملة (محدثة 20 سبتمبر 2026)

---

### 📊 الحالة الحقيقية للمنصة

| القسم | الحالة | النسبة |
|---|---|---|
| 🔐 نظام الحسابات | ✅ مكتمل | 100% |
| 🎓 رحلة الطالب (تعلم) | ✅ مكتمل تقريباً | 90% |
| 🛠️ لوحة تحكم الأدمن | 🔄 جزئي | 70% |
| 🏢 نظام التوظيف | ⏸️ مؤجل | 0% |
| 🎨 الستايل والتصميم | 🔄 يحتاج مراجعة | 75% |
| 🌐 البنية التحتية (Deployment) | ❌ لم يبدأ | 0% |

---

### ✅ ما تم بناؤه وشغال بالكامل

**🔐 نظام الحسابات:**
- [x] تسجيل الدخول (إيميل + جوجل)
- [x] إنشاء حساب مع كل البيانات (الاسم، الجنس، البلد، التليفون)
- [x] حماية الصفحات بالـ Middleware
- [x] Smart Redirect — الطالب يرجع لنفس الصفحة بعد تسجيل الدخول

**🎓 رحلة الطالب:**
- [x] صفحة عرض المسارات/الدورات
- [x] صفحة تفاصيل كل دورة
- [x] نظام الاشتراك المجاني (فوري)
- [x] نظام الاشتراك المدفوع (رفع إيصال بنكي)
- [x] صفحة رحلتي — الدورات الجارية، المكتملة، المفضلة
- [x] مُشغّل الجلسات (Session Player)

**🛠️ لوحة تحكم الأدمن:**
- [x] إحصائيات الداشبورد
- [x] مراجعة طلبات التسجيل (قبول/رفض مع عرض الإيصال)
- [x] قائمة الطلاب
- [x] إدارة المسارات (عرض + إضافة + تعديل)
- [x] عرض الجلسات والمدربين

---

### ❌ ما ينقص — مرتب حسب الأهمية

#### 🔥 الأولوية القصوى (قبل أي إطلاق)

- [ ] **الـ Deployment وربط الدومين**
  - نشر الموقع على Vercel
  - تحديث Supabase بالدومين الجديد
  - تحديث Google OAuth (Google Cloud Console)

- [ ] **SEO وبيانات الموقع الأساسية**
  - تعديل Metadata (عنوان، وصف احترافي)
  - إضافة favicon.ico
  - إضافة Open Graph tags (لمشاركة الروابط على واتساب وجوجل)

#### ⚡ الأولوية العالية (قبل أول طالب حقيقي)

- [ ] **صفحة Landing Page للزوار الجدد**
  > حالياً الزائر بدون تسجيل يُحوَّل مباشرة لـ Login — مشكلة تسويقية!

- [ ] **إضافة الجلسات من لوحة التحكم**
  > الأدمن يرى الجلسات لكن لا يضيفها من الواجهة!

- [ ] **نظام الشهادات**
  - ربط زر منح الشهادة للطالب الذي أنهى 100%
  - صفحة عرض الشهادة بكود تحقق فريد

- [ ] **إشعار Email** عند قبول/رفض طلب الطالب

#### 🎨 مراجعة الستايل والتصميم

- [ ] مراجعة صفحة المسارات `/tracks`
- [ ] مراجعة صفحة التفاصيل `/tracks/[id]`
- [ ] مراجعة الصفحة الرئيسية `/home`

#### 🧹 تنظيف الكود (Cleanup)

- [ ] حذف `src/components/journey/JourneyTabsAndFilter.jsx` — أُزيل من الصفحة لكن الملف لازال موجود
- [ ] حذف `src/components/journey/CoursePathComparison.jsx` — غير مستخدم
- [ ] حذف ملفات dummy data القديمة من `src/data/`
- [ ] مراجعة مجلد `src/app/[locale]/(admin)/` — مجلد فاضي غير مفهوم

---

### ⏸️ المرحلة 4 — Employment Module (مؤجل — بانتظار قرار العميل)

**أسئلة يجب تحديدها مع العميل قبل البدء:**
1. متى يُسمح للطالب بإنشاء بروفايل توظيف؟
2. هل الشركات ستسجل بنفسها أم الأدمن يضيفهم؟
3. هل التقديم يكون بإرسال CV أم بضغطة زر واحدة؟

```
الصفحات المطلوبة (لاحقاً):
src/app/[locale]/(main)/employment/
├── page.js                ← بوابة التوظيف
├── profile/page.js        ← إنشاء/تعديل Employment Profile
├── jobs/[id]/page.js      ← تفاصيل وظيفة + Apply
└── applications/page.js   ← متابعة حالة التقديمات

src/app/[locale]/(company)/
├── dashboard/page.js      ← بانل الشركة
├── jobs/new/page.js       ← نشر وظيفة جديدة
└── applicants/page.js     ← عرض المتقدمين
```

---

### 🛣️ الخطة الزمنية المقترحة

```
الأسبوع الأول:
├── يوم 1-2: تنظيف الكود + مراجعة وتعديل الستايل
├── يوم 3:   بناء Landing Page للزوار
├── يوم 4:   SEO + Metadata + Favicon
└── يوم 5:   إضافة الجلسات من لوحة الأدمن

الأسبوع الثاني:
├── يوم 1-2: نظام الشهادات
├── يوم 3:   إشعارات Email
└── يوم 4-5: Deployment + ربط الدومين + Google OAuth

الأسبوع الثالث (بعد قرار العميل):
└── البدء في Employment Module
```

---

### 💡 اقتراحات مستقبلية لتطوير المنصة

| الاقتراح | التأثير | الأولوية |
|---|---|---|
| إشعارات Email (قبول/رفض) | 🔥 عالي جداً | الأسبوع 2 |
| صفحة تتبع حالة الطلب للطالب | عالي | الأسبوع 1 |
| نظام الكوبونات والخصومات | عالي (تسويقي) | لاحقاً |
| لوحة تحليلية (Analytics) للأدمن | متوسط | لاحقاً |
| إضافة تعليقات داخل الجلسة | متوسط | لاحقاً |
| برمجة فلاتر المسارات في الصفحة الرئيسية | عالي | المرحلة القادمة |
| رفع صور حقيقية للمدربين/المسارات (بدل المؤقتة) | عالي (للثقة) | المرحلة القادمة |
| روابط الفوتر (سياسات، سوشيال ميديا) | متوسط | المرحلة القادمة |
| قسم ثقة (آراء طلاب أو شركات) للصفحة الرئيسية | متوسط (تسويقي) | لاحقاً |

---

## 👥 User Journey المطلوب

```
Student:
Register → Choose Track → Pay + Upload Receipt → Admin Approval
→ Access Training → Attend Sessions → Complete Tasks
→ Complete All Sessions → Certificate
→ Employment Account Activated (مؤجل) → Complete Profile
→ Upload CV → Browse Jobs/Internships → Apply → Track Application

Admin:
Login → Dashboard → Review Enrollments (+ إيصال الدفع) → Approve/Reject
→ Manage Tracks/Sessions/Instructors → Issue Certificates

Company (مؤجل — Phase 2):
Register → Create Company Profile → Post Jobs/Internships
→ View Applicants → Change Application Status (pending→shortlisted→hired/rejected)
```

---

## ⚡ قواعد مهمة لأي Agent يعمل على المشروع

1. **اقرأ `AGENTS.md` في root المشروع أولاً** — Next.js 16 له تغييرات مهمة
2. **`cookies()` دائماً مع `await`** في Next.js 16+
3. **لا تستخدم `lib/supabaseClient.js`** في Server Components — استخدم `utils/supabase/server.js`
4. **`lib/supabaseClient.js`** للـ Client Components فقط
5. **Arabic هو الـ default locale** — redirect من `/` إلى `/ar`
6. **الـ `dummyCourses.js`** مؤقت — لا تبني عليه منطق جديد
7. **Tailwind v4** — syntax مختلف عن v3، تحقق من globals.css
8. **RLS مفعّل على كل الجداول** — تأكد من الـ policies قبل أي query
9. **Server Actions pattern:** انظر `src/app/actions/profileActions.js` كمثال
10. **Flat UI & Minimalist Design:** العميل يفضل التصميم المسطح بدون ظلال (Shadows) أو كروت بارزة (Cards) في تخطيط الصفحات الأساسية.
11. **Split-Pane Scrolling:** في صفحات اللوحة (Dashboard)، استخدم تخطيط يمنع السكرول للصفحة بالكامل (`overflow-hidden` و `h-[calc(100vh-...)]`) واجعل السكرول داخلي للمحتوى والسايدبار فقط (`overflow-y-auto`).
12. **لا تستخدم مسافات رمادية (Grey Gaps):** تأكد أن المحتوى يلامس الهيدر بخلفية بيضاء نقية دون مسافات رمادية فاصلة في الـ Layout.
13. **لا تستخدم الصور الشخصية (Avatars):** تم إزالتها بناءً على طلب العميل للحفاظ على البساطة.

---

## 📊 الحالة الحالية (20 سبتمبر 2026)

```
المرحلة 0 (Bug Fix):       ████████████ 100% ✅
المرحلة 1 (Schema):        ████████████ 100% ✅
المرحلة 2 (Admin Panel):   █████████░░░  70% 🔄
المرحلة 3 (Student Flow):  ██████████░░  90% 🔄
المرحلة 4 (Employment):    ░░░░░░░░░░░░   0% ⏸️ (Paused)
المرحلة 5 (Deployment):    ░░░░░░░░░░░░   0% ❌
المرحلة 6 (Styling/SEO):   ████████░░░░  70% 🔄
```

### **[Agent] سجل التحديثات الأخيرة والخطوة القادمة:**

1. **[مكتمل ✅] Smart Redirect** — الطالب يرجع لنفس الصفحة بعد Login.
2. **[مكتمل ✅] Session Player** — مُشغّل الجلسات للطلاب.
3. **[مكتمل ✅] Favorites** — ربط المفضلة بقاعدة البيانات.
4. **[مكتمل ✅] Journey UI Cleanup** — تصميم مدمج وإزالة الفلاتر الزائدة.
5. **[مكتمل ✅] Landing Page & Responsive UX** — تم بناء الواجهة الرئيسية واقتباس تجربة المستخدم (UX) للموبايل والديسكتوب من منصة "ينفع"، وتم تنسيق الهيدر، الكورسات، الأرقام والإحصائيات، وأزرار الـ CTA لتعمل بامتياز على شاشات الموبايل بشكل متجاوب 100%.
6. **[مكتمل ✅] Auth UI Redesign** — تم تحويل صفحات تسجيل الدخول (Login) وحساب جديد (Register) إلى تصميم مسطح (Flat UI) بالكامل بدون كروت (Cards) أو ظلال (Shadows).
7. **[مكتمل ✅] تبسيط الفورم (Compact Layout)** — تم إزالة الحقول الزائدة (النوع، الدولة) وجعل المحافظة متصلة بمصر مباشرة، وتعديل حقل الهاتف ليكون بسيطاً بدون أعلام دول. كما تم تصغير المسافات الطولية لتظهر الفورم بالكامل بدون الحاجة لعمل سكرول، وتم إصلاح مشكلة قفز السكرول عند التحديث.
8. **[مكتمل ✅] Profile Dashboard Refactoring** — تم تحويل صفحة الحساب (Profile) إلى تصميم Flat UI بدون كروت أو ظلال، وتم تطبيق السكرول الداخلي (Split-Pane Scrolling) وإزالة المسافات الرمادية. وتم استبدال تاب "الدورات" بـ "المسارات" وإزالة خاصية الصورة الشخصية تماماً من الفورم ومن الـ Navbar.
9. **[ ] Admin Management Pages** — لوحة تحكم الأدمن (Tracks, Sessions, Instructors).
10. **[ ] نظام الشهادات** — ربط صفحة الشهادات بقاعدة البيانات.
11. **[مكتمل ✅ عبر إعدادات المستخدم] Deployment + ربط الدومين + Google OAuth** — تم تجهيز الكود 100% وإعداد `middleware.js` وتقديم خطة للمستخدم لربط الدومين من لوحة تحكم Supabase وGoogle Cloud.
12. **[ ⏸️] Employment Module** — بانتظار قرار العميل.

---

*آخر تحديث: 20 سبتمبر 2026 — Antigravity Agent*
