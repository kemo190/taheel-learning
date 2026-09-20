# PROJECT CONTEXT

## 1. Project Overview
**Name:** Taheel Learning & Employment Platform (تأهيل)
**Goal:** A comprehensive platform that bridges the gap between learning and employment. It goes beyond a traditional LMS by providing students with educational tracks and subsequently allowing them to build an employment profile, apply for internships, and connect with verified companies.

## 2. Tech Stack
- **Framework:** Next.js 16.3.2 (App Router)
- **UI Library:** React 19.2.8
- **Styling:** Tailwind CSS v4
- **Database & Backend:** Supabase (PostgreSQL) + `@supabase/ssr` (v0.12.4)
- **Forms & Validation:** `react-hook-form` (^7.86.0), `zod` (^3.25.76), `@hookform/resolvers`
- **Helpers:** `react-phone-number-input`, `country-state-city`, `i18n-iso-countries`, `react-toastify`

## 3. Project Architecture
The project follows a standard Next.js 16 App Router architecture:
- `src/app/[locale]/`: Handles multi-language routing (Arabic default).
  - `(auth)`: Login and registration flow.
  - `(main)`: The student-facing side (home, profile, journey, tracks).
  - `admin`: The administrative panel (dashboard, enrollments, tracks).
- `src/actions/`: Encapsulates server actions to securely mutate database state (e.g. `profileActions.js`, `adminEnrollmentActions.js`).
- `src/components/`: Reusable UI components grouped by feature (auth, home, journey, layout, etc.).
- `src/utils/supabase/`: Supabase client configuration for Server Components and Middleware.
- `src/lib/`: Supabase client configuration for Client Components.

## 4. Current Features
- **Authentication:** Supabase email/password + Google OAuth (Completed)
- **i18n Localization:** English and Arabic support via dictionaries (Completed)
- **Student Profile Management:** Secure CRUD for student profiles (Completed)
- **Learning Tracks Display:** Fetching and listing active tracks (Completed)
- **Enrollment Flow:** Uploading payment receipts and requesting enrollment (Completed)
- **Admin Enrollments Management:** Secure approval/rejection of enrollments and viewing signed receipt URLs (Completed)
- **Admin Management (Other):** Students, Tracks, Sessions, Instructors are partially implemented (View only mostly, except Tracks which has Add/Edit).
- **Student Dashboard (/home):** Implemented.
- **Student Journey (/journey):** In-progress tracks, completed tracks, and favorites fetch real data from Supabase. UI is optimized and compact.
- **Session Player:** Completed. Students can watch sessions and track progress.
- **Employment Module:** CVs, Jobs, Internships, Company Dashboard (Paused / Pending Client Confirmation on Business Logic)

## 5. Pages & Routes
### Student Routes
- `/[locale]/login` & `/register`: Authentication.
- `/[locale]/home`: Landing page with featured tracks.
- `/[locale]/journey`: Student dashboard showing current progress, favorites, and certificates.
- `/[locale]/profile`: Student profile editing.
- `/[locale]/tracks`: Catalog of available tracks.
- `/[locale]/tracks/[id]`: Track details.
- `/[locale]/tracks/[id]/enroll`: Payment instructions and receipt upload.

### Admin Routes
- `/[locale]/admin/dashboard`: Admin overview stats.
- `/[locale]/admin/enrollments`: Enrollment review queue (Pending, Approved, Rejected).
- `/[locale]/admin/tracks`, `sessions`, `students`, `instructors`: Management pages (In Progress / Partial).

## 6. Components
- **`Auth/`**: `LoginForm`, `RegisterForm` (Handles Zod validation and Supabase auth).
- **`Journey/`**: `EnrollmentForm` (Uploads receipts to storage and creates enrollment records), `FavoriteCourseCard`.
- **`Profile/`**: `ProfileForm` (Updates `profiles` table via Server Actions).
- **`Layout/`**: `Navbar`, `AuthNav`, `Footer`, `AdminSidebar`.
- **`Admin/`**: `EnrollmentActions` (Approve/Reject buttons fetching signed URLs for receipts).

## 7. Backend / APIs
- Logic is entirely handled via **Next.js Server Actions** and **Supabase PostgREST APIs**.
- Server actions (e.g., `updateEnrollmentStatus`) enforce security by verifying the user's role (`is_admin`) natively before executing updates.
- Middleware (`src/middleware.js`) protects private routes based on auth session and handles `[locale]` redirects.

## 8. Database
**Provider:** Supabase (PostgreSQL)
**Core Tables:**
- `profiles`: Extends `auth.users` with `role` (student, admin, company, instructor), full name, phone, etc.
- `programs` & `tracks`: Educational offerings and pricing.
- `sessions` & `tasks`: Curriculum details.
- `enrollments`: Maps students to tracks. Contains `payment_receipt_url` and `status`.
- `employment_profiles`, `jobs`, `companies`: (Prepared in schema, pending frontend).
**Storage Buckets:** `receipts` (Private), `avatars`, `certificates`, `track-images` (Public).

## 9. Authentication & Authorization
- **Auth:** Managed by `@supabase/auth-helpers` via Cookies.
- **Authorization:** Handled via PostgreSQL Row Level Security (RLS). 
- Custom SQL function `public.is_admin()` ensures secure data access.
- Private storage buckets (like `receipts`) are accessed via short-lived Signed URLs generated on the server.

## 10. UI / Design System
- **Styling:** Tailwind CSS v4.
- **Aesthetic:** Corporate, clean, minimal, trustworthy. Heavy use of whitespace, rounded corners (`rounded-2xl`, `rounded-3xl`), and subtle borders.
- **Colors:** Dominant deep navy blue (`#0b2646`), white backgrounds, gray for subtle texts, standard success/error indicators.
- **Direction:** RTL is deeply integrated for the Arabic default locale.

## 11. Important Decisions
- Moving away from dummy data directly to real Supabase integrations.
- Implementing Server Actions with explicit `role === 'admin'` checks rather than relying solely on RLS for business logic.
- Keeping the `receipts` storage bucket private and generating Signed URLs for admins to view receipts securely.
- Using `UUID` for all primary keys in Supabase to prevent conflicts.

## 12. Known Issues
- **UX Flow Issue:** When an unauthenticated user clicks 'Enroll' on a track, they are redirected to `/login`. However, after logging in, they are sent to `/home` instead of back to the track page.
- Needs verification: Is the `admin` role explicitly granted to the client user yet? (Yes, the user ran an SQL update on their ID).
- No major technical bugs identified currently. The "empty enrollments" bug due to Foreign Key mapping errors was fully resolved.

## 13. TODO
- Finalize remaining Admin CRUD pages (Tracks, Sessions, Instructors).
- Connect **Certificates** to a real table in the database.
- **[PAUSED]** Start building the **Employment Module** (Company profiles, job postings, student CVs). Waiting for client consultation.

## 14. Current Development State
We completed the Session Player, free enrollment logic, a full polish of the Student Journey page, and the smart Post-Login Redirect. The Learning Module is functional and robust. The Employment Module is currently paused pending the developer's meeting with the client to finalize the logic flow.

## 15. Recommended Next Step
Work on any remaining Learning Module UI refinements (like Certificates), or wait for the client's decision on the Employment Module before proceeding.

## 16. Important Files
- `src/middleware.js`: Auth and i18n routing logic.
- `supabase_schema.sql`: Source of truth for the database and RLS policies.
- `src/app/actions/*`: Server actions handling sensitive mutations.
- `src/app/[locale]/admin/enrollments/page.js`: Reference for secure admin data fetching and signed URLs.
- `PROJECT_LOG.md`: The detailed historical log of what has been accomplished.

## 17. Git State
- Needs verification (Git status not actively monitored in this context, but local files are synced).

## 18. Last Updated
19 September 2026
