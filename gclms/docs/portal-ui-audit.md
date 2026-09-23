# GCLMS Portal UI & Route Audit

This document records the comprehensive audit of all frontend routes across the GCLMS portal. It catalogues route statuses, data/API dependencies, actions, and migration plans from development fixtures to real FastAPI backend endpoints.

---

## 1. Audit Summary

- **Total Routes Audited**: 48 routes (including dynamic routes & public routes)
- **Generic / Stub Pages Found in Initial Review**: 30 sub-module placeholder stubs (`ModulePageShell` defaults).
- **Target Resolution**: Replace 100% of generic stubs with dedicated, domain-specific LMS user interfaces powered by an isolated typed fixture/API client repository layer.
- **Preview Flag**: Controlled via `NEXT_PUBLIC_DEV_DATA_MODE=true`.

---

## 2. Detailed Route Inventory

| Route Path | Role | Status Before | Target Components / Layout | Required API Dependency | Fixture Available? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/login` | Public | Complete | Split view, technology showcase carousel, demo switcher | `POST /api/v1/auth/login` | Yes |
| `/forgot-password` | Public | Complete | Email input, confirmation feedback | `POST /api/v1/auth/forgot-password` | Yes |
| `/forbidden` | Public | Complete | 403 Access Denied screen | N/A | Yes |
| `/api/health` | Public | Complete | JSON health payload | N/A | Yes |
| **Founder Routes** | | | | | |
| `/founder/dashboard` | Founder | Complete | 6 KPI cards, school comparison table, project showcase, alerts | `GET /api/v1/reports/founder-summary` | Yes |
| `/founder/schools` | Founder | Stub | Schools table, search, status filter, Add School modal, actions | `GET /api/v1/schools/` | Yes |
| `/founder/schools/new` | Founder | Missing | Multi-step school registration wizard | `POST /api/v1/schools/` | Yes |
| `/founder/schools/[schoolId]`| Founder | Missing | School overview, Principal card, classes, courses tabs | `GET /api/v1/schools/{id}` | Yes |
| `/founder/users` | Founder | Stub | Multi-role user directory, filters, invite user modal | `GET /api/v1/users/` | Yes |
| `/founder/courses` | Founder | Stub | Global STEM & AI curriculum library, course cards | `GET /api/v1/courses/` | Yes |
| `/founder/reports` | Founder | Stub | Analytics cards, export CSV history, date filters | `GET /api/v1/reports/` | Yes |
| `/founder/projects` | Founder | Stub | Cross-school project gallery, GitHub/demo links, drawer | `GET /api/v1/projects/` | Yes |
| `/founder/announcements` | Founder | Stub | Broadcast manager, audience selector, draft/publish modal | `GET /api/v1/announcements/` | Yes |
| `/founder/audit-logs` | Founder | Stub | Immutable audit log table, JSON before/after drawer | `GET /api/v1/audit/` | Yes |
| `/founder/settings` | Founder | Stub | Security thresholds, session limits, storage overview | `GET /api/v1/settings/` | Yes |
| **Student Routes** | | | | | |
| `/student/dashboard` | Student | Complete | Welcome banner, course cards, upcoming deadlines, grades | `GET /api/v1/progress/student-summary` | Yes |
| `/student/courses` | Student | Stub | Enrolled courses grid, module progress bars | `GET /api/v1/courses/my-courses` | Yes |
| `/student/courses/[courseId]`| Student | Missing | Course modules, lesson navigator, resources, syllabus | `GET /api/v1/courses/{id}` | Yes |
| `/student/lessons/[lessonId]`| Student | Missing | Video player, code viewer, markdown reader, mark complete | `GET /api/v1/courses/lessons/{id}` | Yes |
| `/student/assignments` | Student | Stub | Status tabs (Upcoming, Submitted, Graded), due dates | `GET /api/v1/assignments/my` | Yes |
| `/student/assignments/[id]` | Student | Missing | Instructions, file uploader, code editor box, submit action | `GET /api/v1/assignments/{id}` | Yes |
| `/student/quizzes` | Student | Stub | Active quizzes, timer indicators, past scores | `GET /api/v1/quizzes/my` | Yes |
| `/student/quizzes/[id]` | Student | Missing | Interactive quiz taker, MCQ, T/F, timer, submit confirm | `GET /api/v1/quizzes/{id}/attempt` | Yes |
| `/student/grades` | Student | Stub | Comprehensive report card, grade distribution, feedback | `GET /api/v1/grades/my` | Yes |
| `/student/attendance` | Student | Stub | Monthly attendance calendar, rate gauge, attendance log | `GET /api/v1/attendance/my` | Yes |
| `/student/progress` | Student | Stub | 50/25/25 formula breakdown, milestone tracker | `GET /api/v1/progress/my` | Yes |
| `/student/projects` | Student | Stub | Portfolio grid, GitHub/demo links, approval statuses | `GET /api/v1/projects/my` | Yes |
| `/student/projects/new` | Student | Missing | Multi-field project builder, media uploader | `POST /api/v1/projects/` | Yes |
| `/student/projects/[id]` | Student | Missing | Project showcase view, media gallery, teacher feedback | `GET /api/v1/projects/{id}` | Yes |
| `/student/notifications` | Student | Stub | Filterable notification inbox, mark read actions | `GET /api/v1/notifications/` | Yes |
| `/student/profile` | Student | Stub | Student credentials, school ID badge, security controls | `GET /api/v1/users/me` | Yes |
| **Principal Routes** | | | | | |
| `/principal/dashboard` | Principal | Complete | School KPIs, class performance, project queue, quick actions | `GET /api/v1/schools/my/summary` | Yes |
| `/principal/students` | Principal | Stub | Student roster, class filter, Add Student modal, CSV import | `GET /api/v1/schools/my/students` | Yes |
| `/principal/students/[id]` | Principal | Missing | Individual student profile, academic history, grades, tabs | `GET /api/v1/users/{id}` | Yes |
| `/principal/teachers` | Principal | Stub | Teaching faculty roster, workload breakdown, course map | `GET /api/v1/schools/my/teachers` | Yes |
| `/principal/classes` | Principal | Stub | Class & section cards, teacher allocation, roster modal | `GET /api/v1/academic/classes` | Yes |
| `/principal/subjects` | Principal | Stub | Curriculum catalog, course linkage, teacher coverage | `GET /api/v1/academic/subjects` | Yes |
| `/principal/courses` | Principal | Stub | School course offerings, enrollment metrics, publish toggles | `GET /api/v1/courses/school` | Yes |
| `/principal/attendance` | Principal | Stub | Daily attendance matrix, exceptions list, export CSV | `GET /api/v1/attendance/school` | Yes |
| `/principal/progress` | Principal | Stub | Grade-level completion chart, at-risk student warnings | `GET /api/v1/progress/school` | Yes |
| `/principal/projects` | Principal | Stub | School project approval queue, review drawer, approve/reject | `GET /api/v1/projects/school` | Yes |
| `/principal/announcements`| Principal | Stub | School-wide announcement editor, audience targeting | `GET /api/v1/announcements/school` | Yes |
| `/principal/reports` | Principal | Stub | School performance reports, attendance summaries, CSV export | `GET /api/v1/reports/school` | Yes |
| `/principal/settings` | Principal | Stub | School branding, academic term configuration, policies | `GET /api/v1/schools/my/settings` | Yes |
| **Teacher Routes** | | | | | |
| `/teacher/dashboard` | Teacher | Complete | Assigned classes, pending grading table, attendance tasks | `GET /api/v1/teacher/summary` | Yes |
| `/teacher/classes` | Teacher | Stub | Assigned classes, student counts, attendance quick-status | `GET /api/v1/academic/my-classes` | Yes |
| `/teacher/classes/[id]` | Teacher | Missing | Class roster, attendance record, assignment list, tabs | `GET /api/v1/academic/classes/{id}` | Yes |
| `/teacher/students` | Teacher | Stub | Assigned students directory, grade averages, progress | `GET /api/v1/teacher/students` | Yes |
| `/teacher/students/[id]` | Teacher | Missing | Student detail restricted to teacher scope | `GET /api/v1/teacher/students/{id}` | Yes |
| `/teacher/courses` | Teacher | Stub | Teacher-assigned STEM courses, module manager | `GET /api/v1/courses/teacher` | Yes |
| `/teacher/lessons` | Teacher | Stub | Lesson planner, video & resource attachments, reordering | `GET /api/v1/courses/lessons` | Yes |
| `/teacher/assignments` | Teacher | Stub | Assignment ledger, submission counts, draft/publish | `GET /api/v1/assignments/teacher` | Yes |
| `/teacher/assignments/new`| Teacher | Missing | Assignment creation form with rubric and late penalty rules | `POST /api/v1/assignments/` | Yes |
| `/teacher/assignments/[id]`| Teacher | Missing | Assignment overview, submitted roster, grading breakdown | `GET /api/v1/assignments/{id}` | Yes |
| `/teacher/submissions` | Teacher | Stub | Grading queue, file preview drawer, score & feedback input | `GET /api/v1/assignments/submissions` | Yes |
| `/teacher/quizzes` | Teacher | Stub | Quiz catalog, attempt stats, average score gauges | `GET /api/v1/quizzes/teacher` | Yes |
| `/teacher/quizzes/new` | Teacher | Missing | Question bank builder (MCQ, True/False, Short Answer) | `POST /api/v1/quizzes/` | Yes |
| `/teacher/attendance` | Teacher | Stub | Class roster marking interface (P/A/L/E), Mark All Present | `POST /api/v1/attendance/session` | Yes |
| `/teacher/grades` | Teacher | Stub | Class gradebook table, distribution chart, score override | `GET /api/v1/grades/teacher` | Yes |
| `/teacher/projects` | Teacher | Stub | Assigned student innovation projects, review & feedback | `GET /api/v1/projects/teacher` | Yes |
