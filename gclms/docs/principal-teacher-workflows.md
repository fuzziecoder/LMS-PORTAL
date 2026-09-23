# GCLMS Principal & Teacher Workflows Documentation

This document specifies the technical architecture, authorization rules, and endpoints powering the Principal and Teacher LMS modules.

---

## 1. Calculation Terminology & Standards

### A. Official Course Progress Formula (50/25/25)
Course progress represents learning completion across course syllabus milestones:

$$\text{Course Progress} = (0.50 \times \text{Lesson Completion \%}) + (0.25 \times \text{Assignment Completion \%}) + (0.25 \times \text{Quiz Completion \%})$$

- **Lesson Completion**: Completed published lessons / total published lessons $\times 100$
- **Assignment Completion**: Submitted required assignments / total required assignments $\times 100$
- **Quiz Completion**: Completed required quizzes / total required quizzes $\times 100$
- *Independent from attendance rates and gradebook marks.*

### B. Attendance Weighting Formula
Attendance percentage is derived from daily roll call marks:
- **Present (P)**: 1.0 weight
- **Late (L)**: 0.75 weight
- **Absent (A)**: 0.0 weight
- **Excused (E)**: Excluded from calculation denominator

$$\text{Attendance Rate} = \frac{\text{Present} \times 1.0 + \text{Late} \times 0.75}{\text{Present} + \text{Late} + \text{Absent}} \times 100$$

### C. Gradebook Evaluation
- Academic grades are calculated purely from actual marks obtained on practical code assignments and quizzes.
- Course progress and attendance are tracked separately as behavioral and syllabus indicators.

---

## 2. Multi-Tenant Principal Scope

All Principal endpoints derive the tenant institution directly from the authenticated Principal's session:
- Reusable Dependency: `get_principal_school_scope(current_user)`
- Guarantees `WHERE school_id = current_principal.school_id` across all queries.
- Prevents cross-school student access, teacher appointments, or report leaks.

---

## 3. Teacher Scoping Rules

Teachers can only access cohorts, courses, and students explicitly mapped via `teacher_assignments`:
- **`require_teacher_assignment`**: Validates class/section mapping.
- **`require_teacher_course_access`**: Ensures teacher teaches the course.
- **`require_teacher_student_access`**: Limits student dossier to assigned cohorts.
- **`require_teacher_submission_access`**: Prevents grading unassigned student code.

---

## 4. Key Endpoints Summary

### Principal Endpoints (`/api/v1/principal`)
- `GET/POST /students`: List with search/pagination, enroll new student.
- `GET/PATCH /students/{id}`: Detailed dossier and profile updates.
- `POST /students/{id}/transfer`: Reassign class/section.
- `POST /students/{id}/deactivate`: Suspend student account.
- `GET /students/export`: CSV export.
- `GET/POST /teachers`: List faculty workload, appoint teacher.
- `POST /teachers/{id}/assignments`: Assign teacher to class/section/course.
- `DELETE /teacher-assignments/{id}`: Revoke assignment.
- `GET/POST /academic-years`: Academic year CRUD.
- `GET/POST /classes`: Class & Section management.
- `GET/POST /subjects`: Curriculum catalog.
- `GET/POST /courses`: Deploy and publish courses.
- `GET /attendance/summary`: Daily roll call audit matrix.
- `GET /progress/classes`: Cohort 50/25/25 progress analytics.
- `GET/POST /projects`: Review and endorse student innovation projects.
- `GET/POST /announcements`: School circulars and broadcasts.
- `GET/PATCH /settings`: Institutional policy settings.

### Teacher Endpoints (`/api/v1/teacher`)
- `GET /dashboard`: Scoped KPI dashboard.
- `GET /classes`: Assigned classes and rosters.
- `GET /students`: Assigned students list and dossiers.
- `GET /courses`: Assigned courses and modules.
- `POST /courses/{id}/lessons`: Author and publish lessons.
- `GET/POST /assignments`: Create homework, view submissions.
- `PATCH /submissions/{id}/grade`: Grade code with score and feedback.
- `GET/POST /quizzes`: Timed quizzes and question bank builder.
- `POST /attendance/sessions`: Bulk class roll call persistence with "Mark All Present".
- `GET /grades`: Gradebook marks ledger.
- `POST /projects/{id}/feedback`: Student project mentorship notes.
