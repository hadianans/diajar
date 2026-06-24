# Diajar LMS — Backend Controller Reference
### Implementation Guide for AI Agent (Laravel)
**Based on:** `diajar_db.sql` (final schema, v97–98%)
**Framework assumption:** Laravel (PHP) — REST API, role-based middleware, Eloquent ORM, polymorphic relationships

---

## Conventions Used in This Document

| Symbol | Meaning |
|--------|---------|
| `[Auth]` | Requires authenticated user (any role) |
| `[Admin]` | Restricted to `role = admin` |
| `[Teacher]` | Restricted to `role = teacher` |
| `[Student]` | Restricted to `role = student` |
| `[Admin|Teacher]` | Either admin or teacher |
| `→ logs` | This function must write a record to `activity_logs` |
| `→ morph` | Involves a polymorphic relationship (`taggables`, `planables`, `reflectables`, `bookmarks`) |

All controllers live under `app/Http/Controllers/`. Grouping by subdirectory is recommended as shown.

---

## Table of Contents

1. [Auth](#1-authcontroller)
2. [Admin — Users](#2-adminusercontroller)
3. [Admin — School Years](#3-adminschoolyearcontroller)
4. [Admin — Subjects](#4-adminsubjectcontroller)
5. [Admin — Groups](#5-admingroupcontroller)
6. [Admin — Classes](#6-adminclasscontroller)
7. [Admin — Dashboard](#7-admindashboardcontroller)
8. [Teacher — Classes](#8-teacherclasscontroller)
9. [Teacher — Chapters](#9-teacherchaptercontroller)
10. [Teacher — Subchapters](#10-teachersubchaptercontroller)
11. [Teacher — Materials](#11-teachermaterialcontroller)
12. [Teacher — Attachments](#12-teacherattachmentcontroller)
13. [Teacher — Assignments](#13-teacherassignmentcontroller)
14. [Teacher — Rubrics](#14-teacherrubriccontroller)
15. [Teacher — Assessments](#15-teacherassessmentcontroller)
16. [Teacher — Question Bank](#16-teacherquestioncontroller)
17. [Teacher — Grading (Assignments)](#17-teachergradinassignmentcontroller)
18. [Teacher — Grading (Assessments)](#18-teachergradingassessmentcontroller)
19. [Teacher — Gradebook](#19-teachergradebookcontroller)
20. [Teacher — Student Report](#20-teacherstudentreportcontroller)
21. [Teacher — Dashboard](#21-teacherdashboardcontroller)
22. [Student — Dashboard & Home](#22-studentdashboardcontroller)
23. [Student — Subjects & Chapters](#23-studentsubjectcontroller)
24. [Student — Materials](#24-studentmaterialcontroller)
25. [Student — Assignments](#25-studentassignmentcontroller)
26. [Student — Assessments](#26-studentassessmentcontroller)
27. [Student — Plans (SRL)](#27-studentplancontroller)
28. [Student — Reflections (SRL)](#28-studentreflectioncontroller)
29. [Student — Bookmarks](#29-studentbookmarkcontroller)
30. [Student — Material Reviews](#30-studentmaterialreviewcontroller)
31. [Shared — Tags](#31-tagcontroller)
32. [Shared — Activity Logs](#32-activitylogcontroller)

---

## 1. `AuthController`
**Path:** `App\Http\Controllers\AuthController`
**Middleware:** None (public endpoints)

Handles login, logout, and current user retrieval. Diajar uses **admin-provisioned accounts only** — no public registration.

---

### `login(Request $request)`
- **Method:** `POST`
- **Route:** `/api/auth/login`
- **Input:** `email` or `username`, `password`
- **Logic:**
  - Attempt credential match against `users` table
  - Check `deleted_at IS NULL` (soft-delete guard)
  - On success: issue Sanctum/Passport token, return user object with `role`, `full_name`, `picture`
  - On failure: return 401 with generic error message
- **Returns:** `{ token, user: { id, full_name, role, picture } }`

---

### `logout(Request $request)`
- **Method:** `POST`
- **Route:** `/api/auth/logout`
- **Middleware:** `[Auth]`
- **Logic:** Revoke current access token
- **Returns:** `200 OK`

---

### `me(Request $request)`
- **Method:** `GET`
- **Route:** `/api/auth/me`
- **Middleware:** `[Auth]`
- **Logic:** Return the authenticated user's full profile including role
- **Returns:** Full `users` record (excluding `password`)

---

## 2. `Admin\UserController`
**Path:** `App\Http\Controllers\Admin\UserController`
**Middleware:** `[Admin]`
**Tables:** `users`

---

### `index(Request $request)`
- **Method:** `GET`
- **Route:** `/api/admin/users`
- **Input (query params):** `role`, `search` (matches `full_name`, `username`, `email`), `sort` (`name`, `newest`, `role`), `page`
- **Logic:**
  - Query `users` where `deleted_at IS NULL`
  - Apply role filter if provided
  - Apply search filter across `full_name`, `username`, `email`
  - Return paginated list with role counts as metadata (`admin_count`, `teacher_count`, `student_count`)
- **Returns:** Paginated user list + counts per role

---

### `store(Request $request)`
- **Method:** `POST`
- **Route:** `/api/admin/users`
- **Input:** `full_name`, `username`, `email`, `password`, `password_confirmation`, `role`, `picture` (optional)
- **Logic:**
  - Validate uniqueness of `username` and `email`
  - Hash password with `bcrypt`
  - Create `users` record
  - `→ logs`: action `user.created`, target `User:{id}`
- **Returns:** Created user object, `201`

---

### `show(int $id)`
- **Method:** `GET`
- **Route:** `/api/admin/users/{id}`
- **Logic:**
  - Fetch user where `deleted_at IS NULL`
  - If role is `teacher`: eager-load `subject_teachers → subjects`
  - If role is `student`: eager-load `student_groups → group_years → groups → school_years`
- **Returns:** User profile with role-specific association data

---

### `update(Request $request, int $id)`
- **Method:** `PUT`
- **Route:** `/api/admin/users/{id}`
- **Input:** `full_name`, `username`, `email`, `role`, `picture` (optional)
- **Logic:**
  - Validate uniqueness of `username`/`email` excluding current user
  - If `role` is changing: validate that the change is intentional (require `role_change_confirmed: true` in payload)
  - Update record
  - `→ logs`: action `user.updated`, note old role if changed
- **Returns:** Updated user object

---

### `updatePassword(Request $request, int $id)`
- **Method:** `PATCH`
- **Route:** `/api/admin/users/{id}/password`
- **Input:** `password`, `password_confirmation`
- **Logic:**
  - Validate and hash new password
  - Update `users.password`
  - `→ logs`: action `user.password_reset`, target `User:{id}`
- **Returns:** `200 OK`

---

### `destroy(int $id)`
- **Method:** `DELETE`
- **Route:** `/api/admin/users/{id}`
- **Logic:**
  - Soft-delete: set `deleted_at = NOW()`
  - Do not hard-delete
  - `→ logs`: action `user.deleted`, target `User:{id}`
- **Returns:** `200 OK`

---

### `checkUsername(Request $request)`
- **Method:** `GET`
- **Route:** `/api/admin/users/check-username`
- **Input (query):** `username`, optional `exclude_id`
- **Logic:** Return whether `username` is available (not taken by a non-deleted user)
- **Returns:** `{ available: bool }`

---

## 3. `Admin\SchoolYearController`
**Path:** `App\Http\Controllers\Admin\SchoolYearController`
**Middleware:** `[Admin]`
**Tables:** `school_years`, `group_years`, `classes`

---

### `index()`
- **Method:** `GET`
- **Route:** `/api/admin/school-years`
- **Logic:** Return all school years ordered by `date_start DESC`. Include `active` flag.
- **Returns:** List of school years with status

---

### `store(Request $request)`
- **Method:** `POST`
- **Route:** `/api/admin/school-years`
- **Input:** `name`, `date_start`, `date_end`, `status` (`active` or `archive`)
- **Logic:**
  - If `status = active`: the DB `active_validator` unique constraint enforces only one active year. Do not bypass; let the constraint reject if another is active.
  - Create record
  - `→ logs`: action `school_year.created`
- **Returns:** Created school year, `201`

---

### `show(int $id)`
- **Method:** `GET`
- **Route:** `/api/admin/school-years/{id}`
- **Logic:**
  - Fetch school year
  - Eager-load `group_years → groups` with student counts per group
  - Eager-load classes for this year (via `group_years → classes`) with counts
- **Returns:** Full year detail with groups and classes

---

### `update(Request $request, int $id)`
- **Method:** `PUT`
- **Route:** `/api/admin/school-years/{id}`
- **Input:** `name`, `date_start`, `date_end`
- **Logic:** Update non-status fields only. Status is managed via dedicated endpoints.
- **Returns:** Updated school year

---

### `archive(int $id)`
- **Method:** `PATCH`
- **Route:** `/api/admin/school-years/{id}/archive`
- **Logic:**
  - Confirm year is currently `active`
  - Set `status = archive`
  - The `active_validator` column will become `NULL`, releasing the unique constraint
  - `→ logs`: action `school_year.archived`, target `SchoolYear:{id}`
- **Returns:** Updated school year

---

### `reactivate(int $id)`
- **Method:** `PATCH`
- **Route:** `/api/admin/school-years/{id}/reactivate`
- **Logic:**
  - Confirm no other year is currently `active` (the DB constraint enforces this, but return a clear error message if it fires)
  - Set `status = active`
  - `→ logs`: action `school_year.reactivated`
- **Returns:** Updated school year

---

## 4. `Admin\SubjectController`
**Path:** `App\Http\Controllers\Admin\SubjectController`
**Middleware:** `[Admin]`
**Tables:** `subjects`, `subject_teachers`, `users`, `classes`

---

### `index()`
- **Method:** `GET`
- **Route:** `/api/admin/subjects`
- **Logic:**
  - Return all subjects
  - Include `teacher_count` (from `subject_teachers`) and `has_no_teacher` warning flag per subject
- **Returns:** Subject list with teacher counts

---

### `store(Request $request)`
- **Method:** `POST`
- **Route:** `/api/admin/subjects`
- **Input:** `subject_name`, `description`
- **Logic:** Create subject record
- **Returns:** Created subject, `201`

---

### `show(int $id)`
- **Method:** `GET`
- **Route:** `/api/admin/subjects/{id}`
- **Logic:**
  - Fetch subject
  - Eager-load `subject_teachers → users` (full_name, email, picture)
  - Eager-load related classes with teacher name, group name, year, schedule
- **Returns:** Subject detail with linked teachers and classes

---

### `update(Request $request, int $id)`
- **Method:** `PUT`
- **Route:** `/api/admin/subjects/{id}`
- **Input:** `subject_name`, `description`
- **Returns:** Updated subject

---

### `destroy(int $id)`
- **Method:** `DELETE`
- **Route:** `/api/admin/subjects/{id}`
- **Logic:**
  - Validate: reject if any `classes` reference this subject or if any `subject_teachers` rows exist
  - Hard-delete if safe
- **Returns:** `200 OK` or `409 Conflict` with explanation

---

### `linkTeacher(Request $request, int $subjectId)`
- **Method:** `POST`
- **Route:** `/api/admin/subjects/{subjectId}/teachers`
- **Input:** `teacher_ids` (array of user IDs with `role = teacher`)
- **Logic:**
  - Validate each user exists, is not soft-deleted, and has `role = teacher`
  - Insert into `subject_teachers` (unique constraint handles duplicates gracefully with `insertOrIgnore`)
  - `→ logs`: action `subject.teacher_linked`, one log entry per teacher
- **Returns:** Updated linked teachers list

---

### `unlinkTeacher(int $subjectId, int $teacherId)`
- **Method:** `DELETE`
- **Route:** `/api/admin/subjects/{subjectId}/teachers/{teacherId}`
- **Logic:**
  - Delete the `subject_teachers` row
  - `→ logs`: action `subject.teacher_unlinked`
- **Returns:** `200 OK`

---

## 5. `Admin\GroupController`
**Path:** `App\Http\Controllers\Admin\GroupController`
**Middleware:** `[Admin]`
**Tables:** `groups`, `group_years`, `student_groups`, `users`

---

### `index(Request $request)`
- **Method:** `GET`
- **Route:** `/api/admin/groups`
- **Input (query):** `year_id` (defaults to active year)
- **Logic:**
  - Return groups joined with `group_years` for the specified year
  - Include `student_count` per group for that year
  - Include `has_no_students` warning flag
- **Returns:** Group list with student counts

---

### `store(Request $request)`
- **Method:** `POST`
- **Route:** `/api/admin/groups`
- **Input:** `name`, `year_id`, `grade`
- **Logic:**
  - Create `groups` record
  - Create `group_years` record linking this group to the given year with the grade
  - `→ logs`: action `group.created`
- **Returns:** Created group + group_year, `201`

---

### `show(int $id)`
- **Method:** `GET`
- **Route:** `/api/admin/groups/{id}`
- **Input (query):** `year_id` (defaults to active year)
- **Logic:**
  - Fetch group with its `group_year` for the specified year
  - Load linked students (`student_groups → users`)
  - Include student count and unlinked-students count for the year
- **Returns:** Group detail with student roster

---

### `update(Request $request, int $id)`
- **Method:** `PUT`
- **Route:** `/api/admin/groups/{id}`
- **Input:** `name`
- **Returns:** Updated group

---

### `updateGrade(Request $request, int $groupYearId)`
- **Method:** `PATCH`
- **Route:** `/api/admin/group-years/{groupYearId}/grade`
- **Input:** `grade`
- **Logic:** Update `group_years.grade`
- **Returns:** Updated group_year

---

### `linkStudents(Request $request, int $groupId)`
- **Method:** `POST`
- **Route:** `/api/admin/groups/{groupId}/students`
- **Input:** `student_ids` (array), `year_id`
- **Logic:**
  - Resolve `group_year_id` from `groupId` + `year_id`
  - For each student_id: insert into `student_groups` (unique constraint handles duplicates)
  - `→ logs`: action `group.students_linked`, include count
- **Returns:** Updated student count

---

### `unlinkStudent(int $groupId, int $studentId)`
- **Method:** `DELETE`
- **Route:** `/api/admin/groups/{groupId}/students/{studentId}`
- **Input (query):** `year_id`
- **Logic:**
  - Delete the `student_groups` row for this student in this group's `group_year`
  - `→ logs`: action `group.student_unlinked`
- **Returns:** `200 OK`

---

### `unlinkedStudents(Request $request)`
- **Method:** `GET`
- **Route:** `/api/admin/groups/unlinked-students`
- **Input (query):** `year_id`, `search`
- **Logic:**
  - Return users with `role = student` and `deleted_at IS NULL` who have no `student_groups` record for any `group_year` belonging to `year_id`
- **Returns:** List of unassigned students

---

## 6. `Admin\ClassController`
**Path:** `App\Http\Controllers\Admin\ClassController`
**Middleware:** `[Admin]`
**Tables:** `classes`, `subjects`, `users`, `group_years`, `groups`, `school_years`, `student_groups`

---

### `index(Request $request)`
- **Method:** `GET`
- **Route:** `/api/admin/classes`
- **Input (query):** `year_id` (defaults to active), `subject_id`, `teacher_id`, `group_id`
- **Logic:**
  - Join `classes → subjects`, `users` (teacher), `group_years → groups → school_years`
  - Include `student_count` from `student_groups`
  - Include `is_complete` flag: true when `group_years_id` is set and `day_schedule`/`time_schedule` are not null
  - Filter by `deleted_at IS NULL`
- **Returns:** Class list with full context

---

### `store(Request $request)`
- **Method:** `POST`
- **Route:** `/api/admin/classes`
- **Input:** `subject_id`, `teacher_id`, `group_years_id`, `day_schedule`, `time_schedule`, `assignment_weight`, `assessment_weight`
- **Logic:**
  - Validate teacher has a `subject_teachers` record for the given `subject_id`
  - Validate `assignment_weight + assessment_weight == 100`
  - Create `classes` record
  - `→ logs`: action `class.created`
- **Returns:** Created class with full context, `201`

---

### `show(int $id)`
- **Method:** `GET`
- **Route:** `/api/admin/classes/{id}`
- **Logic:**
  - Fetch class with all relationships
  - Load group, teacher, subject, school year
  - Load first 8 students from linked group
- **Returns:** Full class detail

---

### `updateSchedule(Request $request, int $id)`
- **Method:** `PATCH`
- **Route:** `/api/admin/classes/{id}/schedule`
- **Input:** `day_schedule`, `time_schedule`
- **Logic:** Update schedule fields only
- **Returns:** Updated class

---

### `updateGradingScheme(Request $request, int $id)`
- **Method:** `PATCH`
- **Route:** `/api/admin/classes/{id}/grading-scheme`
- **Input:** `assignment_weight`, `assessment_weight`
- **Logic:**
  - Validate sum equals 100
  - Update weights
- **Returns:** Updated class

---

### `destroy(int $id)`
- **Method:** `DELETE`
- **Route:** `/api/admin/classes/{id}`
- **Logic:**
  - Soft-delete: set `deleted_at = NOW()`
  - `→ logs`: action `class.deleted`
- **Returns:** `200 OK`

---

## 7. `Admin\DashboardController`
**Path:** `App\Http\Controllers\Admin\DashboardController`
**Middleware:** `[Admin]`

---

### `summary()`
- **Method:** `GET`
- **Route:** `/api/admin/dashboard/summary`
- **Logic:**
  - Count users by role (excluding soft-deleted)
  - Fetch active school year
  - Return all four stat-card values in one response
- **Returns:** `{ student_count, teacher_count, subject_count, active_year }`

---

### `setupChecklist()`
- **Method:** `GET`
- **Route:** `/api/admin/dashboard/checklist`
- **Logic:**
  - Resolve active school year
  - Check each step:
    1. Active year exists → `school_years WHERE status = active`
    2. At least one subject → `subjects COUNT`
    3. All subjects have at least one teacher → `subjects LEFT JOIN subject_teachers GROUP BY subjects.id HAVING COUNT = 0`
    4. Groups created for current year → `group_years WHERE year_id = active_year COUNT`
    5. All groups have students → `group_years LEFT JOIN student_groups GROUP BY group_years.id HAVING COUNT = 0`
    6. Classes generated → `classes WHERE group_years_id IN (active year's group_years) AND deleted_at IS NULL COUNT`
  - Return each step as `{ label, complete: bool, shortcut_url }`
- **Returns:** Array of 6 checklist items + `{ steps_complete: int }`

---

## 8. `Teacher\ClassController`
**Path:** `App\Http\Controllers\Teacher\ClassController`
**Middleware:** `[Teacher]`
**Tables:** `classes`, `group_years`, `groups`, `school_years`, `subjects`, `student_groups`, `users`

---

### `index(Request $request)`
- **Method:** `GET`
- **Route:** `/api/teacher/classes`
- **Input (query):** `search`, filter by `year_id` (tag-pill)
- **Logic:**
  - Scope to `teacher_id = auth()->id()`
  - Join all context tables
  - Include `student_count` per class
  - Sort: active year class first, then archived by year DESC
  - Mark each class as `is_active` (based on `school_years.status = active`)
- **Returns:** List of classes split by active/archived

---

### `show(int $id)`
- **Method:** `GET`
- **Route:** `/api/teacher/classes/{id}`
- **Logic:**
  - Verify `teacher_id = auth()->id()`
  - Load class with subject, group, year, and student roster
  - For each student: include `material_completion` percentage, latest `assignment_submissions.grade`, latest `assessment_attempts.grade`, SRL activity flags (has active plan, has recent reflection within 7 days)
- **Returns:** Full class detail with student roster and metrics

---

## 9. `Teacher\ChapterController`
**Path:** `App\Http\Controllers\Teacher\ChapterController`
**Middleware:** `[Teacher]`
**Tables:** `chapters`, `subchapters`, `materials`, `class_assignments`, `class_assessments`

---

### `index(Request $request)`
- **Method:** `GET`
- **Route:** `/api/teacher/chapters`
- **Input (query):** `class_id`, `group_year_id` (for filtered completion rates)
- **Logic:**
  - Scope to `teacher_id = auth()->id()` on `chapters`
  - For each chapter: count materials, assignments, assessments
  - Compute class-wide material completion percentage (optionally filtered by group)
- **Returns:** Ordered chapter list with counts and completion rates

---

### `store(Request $request)`
- **Method:** `POST`
- **Route:** `/api/teacher/chapters`
- **Input:** `subject_id`, `name`, `description`, `order`
- **Logic:**
  - Set `teacher_id = auth()->id()`
  - Validate teacher is linked to the subject via `subject_teachers`
  - Create chapter
- **Returns:** Created chapter, `201`

---

### `show(int $id)`
- **Method:** `GET`
- **Route:** `/api/teacher/chapters/{id}`
- **Logic:**
  - Verify ownership (`teacher_id = auth()->id()`)
  - Load full content tree: `subchapters` with their `materials` ordered by `order`
  - Load `materials` without subchapter (root-level materials)
  - Load `class_assignments` for this chapter with submission counts vs total students
  - Load `class_assessments` for this chapter with attempt counts and average score
- **Returns:** Chapter detail with full content tree, assignments, and assessments

---

### `update(Request $request, int $id)`
- **Method:** `PUT`
- **Route:** `/api/teacher/chapters/{id}`
- **Input:** `name`, `description`, `order`
- **Logic:** Verify ownership, update
- **Returns:** Updated chapter

---

### `destroy(int $id)`
- **Method:** `DELETE`
- **Route:** `/api/teacher/chapters/{id}`
- **Logic:**
  - Verify ownership
  - Reject if any `materials`, `class_assignments`, or `class_assessments` exist under this chapter (require explicit cascade confirmation)
- **Returns:** `200 OK` or `409 Conflict`

---

### `reorder(Request $request)`
- **Method:** `PATCH`
- **Route:** `/api/teacher/chapters/reorder`
- **Input:** `orders` (array of `{ id, order }`)
- **Logic:** Bulk-update `chapters.order` for all provided IDs. Verify all belong to `auth()->id()`.
- **Returns:** `200 OK`

---

## 10. `Teacher\SubchapterController`
**Path:** `App\Http\Controllers\Teacher\SubchapterController`
**Middleware:** `[Teacher]`
**Tables:** `subchapters`, `chapters`

---

### `store(Request $request)`
- **Method:** `POST`
- **Route:** `/api/teacher/chapters/{chapterId}/subchapters`
- **Input:** `name`, `description`, `order`
- **Logic:**
  - Verify the chapter belongs to `auth()->id()`
  - Create subchapter under the chapter
- **Returns:** Created subchapter, `201`

---

### `update(Request $request, int $chapterId, int $id)`
- **Method:** `PUT`
- **Route:** `/api/teacher/chapters/{chapterId}/subchapters/{id}`
- **Input:** `name`, `description`, `order`
- **Returns:** Updated subchapter

---

### `destroy(int $chapterId, int $id)`
- **Method:** `DELETE`
- **Route:** `/api/teacher/chapters/{chapterId}/subchapters/{id}`
- **Logic:** Delete subchapter; materials under it will have `subchapter_id` set to `NULL` (do not cascade-delete materials)
- **Returns:** `200 OK`

---

### `reorder(Request $request, int $chapterId)`
- **Method:** `PATCH`
- **Route:** `/api/teacher/chapters/{chapterId}/subchapters/reorder`
- **Input:** `orders` (array of `{ id, order }`)
- **Returns:** `200 OK`

---

## 11. `Teacher\MaterialController`
**Path:** `App\Http\Controllers\Teacher\MaterialController`
**Middleware:** `[Teacher]`
**Tables:** `materials`, `attachments`, `taggables`, `tags`, `material_completion`, `material_access_logs`, `reflections`, `reflectables`, `material_reviews`

---

### `store(Request $request)`
- **Method:** `POST`
- **Route:** `/api/teacher/materials`
- **Input:** `chapter_id`, `subchapter_id` (nullable), `title`, `description`, `content` (nullable), `order`, `file_type` (`video`|`text`), `duration_seconds` (nullable), `file_url` (nullable), `status` (`draft`|`published`), `tag_ids` (array, optional)
- **Logic:**
  - Verify the chapter belongs to `auth()->id()`
  - Create `materials` record
  - If `tag_ids` provided: insert into `taggables` (`taggable_type = 'App\Models\Material'`) → `morph`
- **Returns:** Created material with tags, `201`

---

### `show(int $id)`
- **Method:** `GET`
- **Route:** `/api/teacher/materials/{id}`
- **Logic:**
  - Fetch material with chapter, subchapter, attachments, tags
  - Load teacher-side engagement analytics:
    - `completion_count`: `material_completion WHERE is_completed = true COUNT`
    - `avg_time_seconds`: `material_access_logs.duration_seconds AVG`
    - `avg_comprehension`: `reflections.comprehension_level AVG` via `reflectables`
    - `avg_material_quality`: `material_reviews.score AVG`
    - `emotion_distribution`: group by emotion keys from `reflections.emotions` JSON
- **Returns:** Full material with teacher analytics panel data

---

### `update(Request $request, int $id)`
- **Method:** `PUT`
- **Route:** `/api/teacher/materials/{id}`
- **Input:** Same as `store`
- **Logic:** Verify chapter ownership, update material and re-sync tags
- **Returns:** Updated material

---

### `publish(int $id)`
- **Method:** `PATCH`
- **Route:** `/api/teacher/materials/{id}/publish`
- **Logic:** Set `status = published`
- **Returns:** Updated material

---

### `unpublish(int $id)`
- **Method:** `PATCH`
- **Route:** `/api/teacher/materials/{id}/unpublish`
- **Logic:** Set `status = draft`
- **Returns:** Updated material

---

### `destroy(int $id)`
- **Method:** `DELETE`
- **Route:** `/api/teacher/materials/{id}`
- **Logic:**
  - Cascade delete: `attachments`, `taggables`, `material_completion`, `material_access_logs`, `material_reviews`
  - Hard-delete (materials have no soft-delete column)
- **Returns:** `200 OK`

---

### `reorder(Request $request)`
- **Method:** `PATCH`
- **Route:** `/api/teacher/materials/reorder`
- **Input:** `orders` (array of `{ id, order }`)
- **Returns:** `200 OK`

---

## 12. `Teacher\AttachmentController`
**Path:** `App\Http\Controllers\Teacher\AttachmentController`
**Middleware:** `[Teacher]`
**Tables:** `attachments`, `materials`

---

### `store(Request $request, int $materialId)`
- **Method:** `POST`
- **Route:** `/api/teacher/materials/{materialId}/attachments`
- **Input:** `title`, `description`, `file_url`
- **Logic:** Verify material belongs to teacher's chapter; create attachment
- **Returns:** Created attachment, `201`

---

### `update(Request $request, int $materialId, int $id)`
- **Method:** `PUT`
- **Route:** `/api/teacher/materials/{materialId}/attachments/{id}`
- **Input:** `title`, `description`, `file_url`
- **Returns:** Updated attachment

---

### `destroy(int $materialId, int $id)`
- **Method:** `DELETE`
- **Route:** `/api/teacher/materials/{materialId}/attachments/{id}`
- **Returns:** `200 OK`

---

## 13. `Teacher\AssignmentController`
**Path:** `App\Http\Controllers\Teacher\AssignmentController`
**Middleware:** `[Teacher]`
**Tables:** `class_assignments`, `class_rubrics`, `class_rubric_criteria`, `class_rubric_levels`, `assignment_submissions`, `student_groups`, `taggables`, `tags`

---

### `index(Request $request)`
- **Method:** `GET`
- **Route:** `/api/teacher/assignments`
- **Input (query):** `class_id`, `chapter_id`, `status` (`open`|`closed`), `grading_status` (`needs_grading`|`graded`)
- **Logic:**
  - Scope to classes where `teacher_id = auth()->id()`
  - For each assignment: count total students, submissions, graded submissions, pending submissions, average grade
  - Sort: pending submissions first by default
- **Returns:** Assignment list with submission stats

---

### `store(Request $request)`
- **Method:** `POST`
- **Route:** `/api/teacher/assignments`
- **Input:** `class_id`, `chapter_id`, `material_id` (nullable), `title`, `description`, `due_date` (nullable), `grade`, `rubric` (object with `title`, `description`, `criteria` array), `tag_ids` (optional)
- **Logic:**
  - Verify class belongs to `auth()->id()`
  - Create `class_assignments` record
  - If `rubric` provided:
    - Create `class_rubrics` record
    - For each criterion: create `class_rubric_criteria` record
    - For each criterion's levels: create `class_rubric_levels` records
  - If `tag_ids`: sync `taggables` → `morph`
- **Returns:** Created assignment with rubric, `201`

---

### `show(int $id)`
- **Method:** `GET`
- **Route:** `/api/teacher/assignments/{id}`
- **Logic:**
  - Fetch assignment with chapter, class, rubric (criteria + levels)
  - Statistics: total students, submissions count, graded count, ungraded count, average grade
  - Grade distribution (buckets: 0–49, 50–59, 60–69, 70–79, 80–89, 90–100)
  - Load submission list with student name, group, date, status, grade
- **Returns:** Full assignment detail with stats and submission list

---

### `update(Request $request, int $id)`
- **Method:** `PUT`
- **Route:** `/api/teacher/assignments/{id}`
- **Input:** `title`, `description`, `due_date`, `grade`, `status`, `tag_ids`
- **Logic:** Verify ownership; update; re-sync tags
- **Returns:** Updated assignment

---

### `close(int $id)`
- **Method:** `PATCH`
- **Route:** `/api/teacher/assignments/{id}/close`
- **Logic:** Set `status = closed`
- **Returns:** Updated assignment

---

### `reopen(int $id)`
- **Method:** `PATCH`
- **Route:** `/api/teacher/assignments/{id}/reopen`
- **Logic:** Set `status = open`
- **Returns:** Updated assignment

---

### `destroy(int $id)`
- **Method:** `DELETE`
- **Route:** `/api/teacher/assignments/{id}`
- **Logic:**
  - Soft-delete: `deleted_at = NOW()`
  - Cascade soft-delete does not apply automatically — cascade logic via Eloquent observer if needed
- **Returns:** `200 OK`

---

## 14. `Teacher\RubricController`
**Path:** `App\Http\Controllers\Teacher\RubricController`
**Middleware:** `[Teacher]`
**Tables:** `class_rubrics`, `class_rubric_criteria`, `class_rubric_levels`

Rubrics are always nested under an assignment. These endpoints handle post-creation edits.

---

### `updateRubric(Request $request, int $assignmentId)`
- **Method:** `PUT`
- **Route:** `/api/teacher/assignments/{assignmentId}/rubric`
- **Input:** `title`, `description`
- **Logic:** Verify assignment ownership; update `class_rubrics`
- **Returns:** Updated rubric

---

### `storeCriterion(Request $request, int $rubricId)`
- **Method:** `POST`
- **Route:** `/api/teacher/rubrics/{rubricId}/criteria`
- **Input:** `title`, `description`, `weight`
- **Returns:** Created criterion, `201`

---

### `updateCriterion(Request $request, int $rubricId, int $criterionId)`
- **Method:** `PUT`
- **Route:** `/api/teacher/rubrics/{rubricId}/criteria/{criterionId}`
- **Input:** `title`, `description`, `weight`
- **Returns:** Updated criterion

---

### `destroyCriterion(int $rubricId, int $criterionId)`
- **Method:** `DELETE`
- **Route:** `/api/teacher/rubrics/{rubricId}/criteria/{criterionId}`
- **Logic:** Delete criterion and its `class_rubric_levels` cascade
- **Returns:** `200 OK`

---

### `storeLevel(Request $request, int $criterionId)`
- **Method:** `POST`
- **Route:** `/api/teacher/criteria/{criterionId}/levels`
- **Input:** `label`, `score`, `description`
- **Returns:** Created level, `201`

---

### `updateLevel(Request $request, int $criterionId, int $levelId)`
- **Method:** `PUT`
- **Route:** `/api/teacher/criteria/{criterionId}/levels/{levelId}`
- **Returns:** Updated level

---

### `destroyLevel(int $criterionId, int $levelId)`
- **Method:** `DELETE`
- **Route:** `/api/teacher/criteria/{criterionId}/levels/{levelId}`
- **Returns:** `200 OK`

---

## 15. `Teacher\AssessmentController`
**Path:** `App\Http\Controllers\Teacher\AssessmentController`
**Middleware:** `[Teacher]`
**Tables:** `class_assessments`, `class_questions`, `class_options`, `class_assessment_questions`, `assessment_attempts`, `assessment_answers`, `taggables`

---

### `index(Request $request)`
- **Method:** `GET`
- **Route:** `/api/teacher/assessments`
- **Input (query):** `class_id`, `chapter_id`, `lifecycle_status` (`scheduled`|`active`|`completed`)
- **Logic:**
  - Scope to teacher's classes
  - Derive `lifecycle_status`:
    - `scheduled`: `start_date > NOW()` or `start_date IS NULL AND due_date > NOW()`
    - `active`: `start_date <= NOW() AND (due_date IS NULL OR due_date > NOW())`
    - `completed`: `due_date < NOW()`
  - Include question count, attempt count, class average score
- **Returns:** Assessment list with stats

---

### `store(Request $request)`
- **Method:** `POST`
- **Route:** `/api/teacher/assessments`
- **Input:** `class_id`, `chapter_id`, `material_id` (nullable), `title`, `description`, `start_date` (nullable), `due_date` (nullable), `duration`, `max_attempts`, `pass_threshold`, `question_ids` (array of bank question IDs), `tag_ids` (optional)
- **Logic:**
  - Verify class belongs to teacher
  - Create `class_assessments` record
  - For each `question_id` in `question_ids`:
    - Fetch source `questions` and `options` records
    - Create a new `class_questions` record (copy, not reference)
    - Create `class_options` for each option
    - Create `class_assessment_questions` linking the assessment and the new class question
  - If `tag_ids`: sync `taggables` → `morph`
- **Returns:** Created assessment with question count, `201`

---

### `show(int $id)`
- **Method:** `GET`
- **Route:** `/api/teacher/assessments/{id}`
- **Logic:**
  - Fetch assessment with chapter, class, question list
  - Statistics: total students, attempts submitted, average score, highest, lowest, pass rate
  - Grade distribution (bucketed)
  - Per-question correct-answer rate (`assessment_answers.is_correct AVG` by `question_id`)
  - Student attempt list with status, time spent, score
- **Returns:** Full assessment detail with analytics

---

### `update(Request $request, int $id)`
- **Method:** `PUT`
- **Route:** `/api/teacher/assessments/{id}`
- **Input:** `title`, `description`, `start_date`, `due_date`, `duration`, `max_attempts`, `pass_threshold`, `tag_ids`
- **Logic:** Verify ownership; update metadata only (not questions — use separate endpoints)
- **Returns:** Updated assessment

---

### `destroy(int $id)`
- **Method:** `DELETE`
- **Route:** `/api/teacher/assessments/{id}`
- **Logic:** Soft-delete via `deleted_at = NOW()`
- **Returns:** `200 OK`

---

## 16. `Teacher\QuestionController`
**Path:** `App\Http\Controllers\Teacher\QuestionController`
**Middleware:** `[Teacher]`
**Tables:** `questions`, `options`, `taggables`, `tags`, `assessment_questions`

These are the **global question bank** endpoints (not class-specific copies).

---

### `index(Request $request)`
- **Method:** `GET`
- **Route:** `/api/teacher/questions`
- **Input (query):** `subject_id`, `levels` (array, multi-select), `tag_ids` (array), `search` (keyword in question text), `sort` (`newest`|`level`|`score`)
- **Logic:**
  - Scope to questions where `subject_id` matches the teacher's linked subjects
  - Join `taggables → tags` for tag filtering
  - Include usage count: how many `assessment_questions` rows reference this question
  - Return total count and filtered count as metadata
- **Returns:** Paginated question list with tags and usage count

---

### `store(Request $request)`
- **Method:** `POST`
- **Route:** `/api/teacher/questions`
- **Input:** `subject_id`, `question`, `levels`, `explanation`, `score`, `options` (array of `{ option, is_correct }`), `tag_ids` (optional)
- **Logic:**
  - Validate: exactly one option has `is_correct = true`; minimum 2 options
  - Validate teacher is linked to `subject_id`
  - Create `questions` record
  - Create `options` records
  - Sync `taggables` → `morph`
- **Returns:** Created question with options and tags, `201`

---

### `show(int $id)`
- **Method:** `GET`
- **Route:** `/api/teacher/questions/{id}`
- **Logic:**
  - Fetch question with all options
  - Load tags via `taggables`
  - Load usage count (from `assessment_questions`)
- **Returns:** Full question detail

---

### `update(Request $request, int $id)`
- **Method:** `PUT`
- **Route:** `/api/teacher/questions/{id}`
- **Input:** Same as `store`
- **Logic:**
  - Validate ownership via subject link
  - Update question
  - Replace options (delete existing, re-insert)
  - Re-sync tags
- **Returns:** Updated question

---

### `destroy(int $id)`
- **Method:** `DELETE`
- **Route:** `/api/teacher/questions/{id}`
- **Logic:**
  - Reject if any `assessment_questions` reference this question (it is in use)
  - Otherwise: delete question, cascade options and taggables
- **Returns:** `200 OK` or `409 Conflict`

---

## 17. `Teacher\GradingAssignmentController`
**Path:** `App\Http\Controllers\Teacher\GradingAssignmentController`
**Middleware:** `[Teacher]`
**Tables:** `assignment_submissions`, `rubric_points`, `class_rubric_criteria`, `class_rubric_levels`

---

### `show(int $assignmentId, int $studentId)`
- **Method:** `GET`
- **Route:** `/api/teacher/assignments/{assignmentId}/submissions/{studentId}`
- **Logic:**
  - Fetch `assignment_submissions` for this student and assignment
  - Load submitted file URL, student note, current grade, feedback, status
  - Load rubric with criteria and levels
  - Load existing `rubric_points` for this student (pre-fill the scoring panel if already graded)
  - Load previous and next student IDs for navigation
- **Returns:** Grading workspace data: submission + rubric + current scores

---

### `saveScore(Request $request, int $assignmentId, int $studentId)`
- **Method:** `PATCH`
- **Route:** `/api/teacher/assignments/{assignmentId}/submissions/{studentId}/score`
- **Input:** `rubric_points` (array of `{ class_criterion_id, class_rubric_level_id }`), `feedback`
- **Logic:**
  - Upsert `rubric_points` records (one per criterion, `student_id` + `class_criterion_id` unique)
  - Update `assignment_submissions.feedback`
  - Compute weighted grade: sum of `(level.score × criterion.weight / 100)` across all criteria relative to `class_assignments.grade`
  - Update `assignment_submissions.grade` with computed value
  - Keep `status = submitted` (not finalized yet)
- **Returns:** Updated submission with live computed grade

---

### `submitGrade(Request $request, int $assignmentId, int $studentId)`
- **Method:** `PATCH`
- **Route:** `/api/teacher/assignments/{assignmentId}/submissions/{studentId}/submit-grade`
- **Logic:**
  - Same scoring logic as `saveScore`
  - Set `assignment_submissions.status = graded`
  - Set `grade_by = auth()->id()`
- **Returns:** Finalized submission

---

## 18. `Teacher\GradingAssessmentController`
**Path:** `App\Http\Controllers\Teacher\GradingAssessmentController`
**Middleware:** `[Teacher]`
**Tables:** `assessment_attempts`, `assessment_answers`, `class_questions`, `class_options`

---

### `showAnswerSheet(int $assessmentId, int $studentId)`
- **Method:** `GET`
- **Route:** `/api/teacher/assessments/{assessmentId}/attempts/{studentId}`
- **Logic:**
  - Fetch `assessment_attempts` for this student and assessment
  - Load all `assessment_answers` for this attempt with:
    - `class_questions` (question text, levels, score, explanation)
    - `class_options` (all options, filtered by `class_question_id`)
    - `selected_option_id` → resolve selected option text
    - `is_correct`
    - `marked_for_review`
  - Compute: correct count, incorrect count, total score earned, time spent
  - Load previous and next student IDs for navigation
- **Returns:** Full answer sheet with per-question breakdown

---

### `finalizeGrade(Request $request, int $attemptId)`
- **Method:** `PATCH`
- **Route:** `/api/teacher/attempts/{attemptId}/finalize`
- **Logic:**
  - Compute final score: sum of `class_questions.score` where `assessment_answers.is_correct = true`
  - Set `assessment_attempts.grade = computed_score`
  - Set `assessment_attempts.status = graded`
  - Set `grade_by = auth()->id()`
- **Returns:** Updated attempt with grade

---

## 19. `Teacher\GradebookController`
**Path:** `App\Http\Controllers\Teacher\GradebookController`
**Middleware:** `[Teacher]`

---

### `groupGrades(int $groupYearId)`
- **Method:** `GET`
- **Route:** `/api/teacher/gradebook/{groupYearId}`
- **Input (query):** `column_filter` (`all`|`assignments`|`assessments`), `sort` (`name`|`grade_desc`|`grade_asc`)
- **Logic:**
  - Resolve the class from `group_years_id → classes` (scoped to teacher)
  - Load `assignment_weight` and `assessment_weight` from `classes`
  - Build student roster from `student_groups → users`
  - For each student:
    - Load grade per `class_assignment` (from `assignment_submissions.grade`, or `null` for missing, `pending` for submitted-ungraded)
    - Load grade per `class_assessment` (from `assessment_attempts.grade`)
    - Compute weighted final grade: `(avg_assignment_grade × assignment_weight/100) + (avg_assessment_grade × assessment_weight/100)`
  - Compute column averages across all students
- **Returns:** Table structure: `{ grading_scheme, columns: [...], class_averages: {...}, students: [{ id, name, grades: {...}, final_grade }] }`

---

## 20. `Teacher\StudentReportController`
**Path:** `App\Http\Controllers\Teacher\StudentReportController`
**Middleware:** `[Teacher]`

---

### `show(int $classId, int $studentId)`
- **Method:** `GET`
- **Route:** `/api/teacher/classes/{classId}/students/{studentId}`
- **Logic:**
  - Verify the class belongs to the teacher and the student belongs to the class
  - Load student profile
  - Academic summary:
    - Average assignment grade (`assignment_submissions.grade AVG`)
    - Average assessment score (`assessment_attempts.grade AVG`)
    - Material completion % (`material_completion WHERE is_completed = true COUNT / total materials COUNT`)
    - Grade trend: last 5 assignments and assessments ordered by date
  - Material engagement:
    - Total time spent (`material_access_logs.duration_seconds SUM`)
    - Per-chapter completion breakdown
  - Assignment history: all submissions with title, date, grade, status
  - Assessment history: all attempts with title, status, time spent, score
  - SRL plans: all `plans` with `planables`, target date, progress
  - SRL reflections: all `reflections` with linked `reflectables`, comprehension level, emotions, teacher comment
- **Returns:** Comprehensive student report object

---

## 21. `Teacher\DashboardController`
**Path:** `App\Http\Controllers\Teacher\DashboardController`
**Middleware:** `[Teacher]`

---

### `summary()`
- **Method:** `GET`
- **Route:** `/api/teacher/dashboard`
- **Logic:**
  - Resolve teacher's active class (class linked to active school year)
  - Pending actions:
    - `ungraded_submissions`: `assignment_submissions WHERE status = submitted COUNT` (scoped to teacher's class)
    - `pending_attempts`: `assessment_attempts WHERE status = submitted COUNT`
  - Class health metrics:
    - Overall material completion rate across all students
    - Average assignment grade
    - Average assessment score
  - Recent activity feed (last 48 hours): new submissions, new attempts, new material completions — ordered by timestamp, max 20 items
  - SRL snapshot: active plans count, new reflections this week, avg comprehension level
  - Chapter progress: each chapter with class-wide completion %
  - Upcoming deadlines: nearest open assignment due_date, nearest active assessment due_date
- **Returns:** Structured dashboard payload

---

## 22. `Student\DashboardController`
**Path:** `App\Http\Controllers\Student\DashboardController`
**Middleware:** `[Student]`

---

### `home()`
- **Method:** `GET`
- **Route:** `/api/student/home`
- **Logic:**
  - Resolve student's current class (via `student_groups → group_years → school_years WHERE status = active → classes`)
  - Last accessed material: `material_access_logs WHERE student_id = auth()->id() ORDER BY access_start DESC LIMIT 1` with material title and type
  - Progress summary:
    - Material completion %: `material_completion WHERE is_completed = true COUNT / total published materials in class`
    - Assignment completion %: `assignment_submissions COUNT / total open class_assignments`
    - Assessment completion %: `assessment_attempts WHERE status IN (submitted, graded) COUNT / total class_assessments`
  - Nearest assignment deadline: `class_assignments WHERE status = open AND due_date >= NOW() ORDER BY due_date ASC LIMIT 1` (no submission yet from this student)
  - Nearest assessment deadline: `class_assessments WHERE due_date >= NOW() ORDER BY due_date ASC LIMIT 1` (not yet attempted)
  - Nearest learning targets: `plans WHERE student_id = auth()->id() AND completed_at = 0 ORDER BY target_date ASC LIMIT 3`
- **Returns:** Complete home screen payload

---

### `srlDashboard(Request $request)`
- **Method:** `GET`
- **Route:** `/api/student/dashboard`
- **Input (query):** `group_by` (`overall`|`subject`|`chapter`)
- **Logic:**
  - Plans list: all `plans` with `planables`, ordered by `target_date`; derive status from `target_date` vs `completed_at`
  - Calendar data: `plans.target_date` values for the current month (for calendar markers)
  - Progress analytics:
    - Material completion by grouping
    - Assignment completion by grouping
    - Assessment scores by grouping
    - Comprehension distribution: count of `reflections.comprehension_level` grouped by value (1–5)
  - Reflection list: `reflections` with `reflectables`, `comprehension_level`, `emotions`, `teacher_comment`, ordered by `created_at DESC`
- **Returns:** Full SRL dashboard payload

---

## 23. `Student\SubjectController`
**Path:** `App\Http\Controllers\Student\SubjectController`
**Middleware:** `[Student]`
**Tables:** `subjects`, `classes`, `chapters`, `materials`, `material_completion`

---

### `index(Request $request)`
- **Method:** `GET`
- **Route:** `/api/student/subjects`
- **Input (query):** `search` (subject name, teacher name)
- **Logic:**
  - Resolve student's enrolled classes: `student_groups → group_years → classes → subjects`
  - For each class/subject: include teacher name, schedule (`day_schedule`, `time_schedule`), material completion %
- **Returns:** List of enrolled subjects with progress

---

### `chapters(int $subjectId)`
- **Method:** `GET`
- **Route:** `/api/student/subjects/{subjectId}/chapters`
- **Logic:**
  - Resolve the class for this subject that the student is enrolled in
  - Load chapters ordered by `order`
  - For each chapter:
    - Count materials (published only)
    - Material type breakdown (video count, text count)
    - Count subchapters
    - Completion % for this student
- **Returns:** Chapter list with progress per chapter

---

### `lessons(int $subjectId, int $chapterId)`
- **Method:** `GET`
- **Route:** `/api/student/subjects/{subjectId}/chapters/{chapterId}/materials`
- **Input (query):** `status`, `tag_ids`, `file_type`, `sort`, `search`
- **Logic:**
  - Load `materials WHERE chapter_id = ? AND status = published`
  - Group by subchapter
  - For each material:
    - `is_completed` from `material_completion`
    - `is_bookmarked` from `bookmarks WHERE bookmarkable_type = 'App\Models\Material'` → `morph`
    - Tags from `taggables`
- **Returns:** Materials grouped by subchapter with per-student status

---

## 24. `Student\MaterialController`
**Path:** `App\Http\Controllers\Student\MaterialController`
**Middleware:** `[Student]`
**Tables:** `materials`, `attachments`, `material_completion`, `material_access_logs`, `taggables`

---

### `show(int $id)`
- **Method:** `GET`
- **Route:** `/api/student/materials/{id}`
- **Logic:**
  - Verify material is `status = published` and student is enrolled in the subject
  - Load material with attachments, tags
  - Load `is_completed` and `is_bookmarked` for this student
  - Load related assessment if `class_assessments.material_id = this material`
  - Load previous and next material in the chapter (ordered by `order`)
- **Returns:** Full material view payload

---

### `startAccess(Request $request, int $id)`
- **Method:** `POST`
- **Route:** `/api/student/materials/{id}/access/start`
- **Logic:**
  - Create `material_access_logs` record with `access_start = NOW()`, `student_id = auth()->id()`
  - Return the new log `id` for the client to reference when ending the session
- **Returns:** `{ log_id }`

---

### `endAccess(Request $request, int $logId)`
- **Method:** `PATCH`
- **Route:** `/api/student/material-access-logs/{logId}/end`
- **Input:** `interaction_data` (JSON, optional)
- **Logic:**
  - Set `access_end = NOW()`
  - Compute `duration_seconds = TIMESTAMPDIFF(SECOND, access_start, NOW())`
  - Save `interaction_data`
- **Returns:** Updated access log

---

### `markComplete(int $id)`
- **Method:** `PATCH`
- **Route:** `/api/student/materials/{id}/complete`
- **Logic:**
  - Upsert `material_completion`: set `is_completed = true`, `completed_at = NOW()`
- **Returns:** Updated completion record

---

### `markIncomplete(int $id)`
- **Method:** `PATCH`
- **Route:** `/api/student/materials/{id}/incomplete`
- **Logic:**
  - Upsert `material_completion`: set `is_completed = false`, `completed_at = NULL`
- **Returns:** Updated completion record

---

## 25. `Student\AssignmentController`
**Path:** `App\Http\Controllers\Student\AssignmentController`
**Middleware:** `[Student]`
**Tables:** `class_assignments`, `class_rubrics`, `class_rubric_criteria`, `class_rubric_levels`, `rubric_points`, `assignment_submissions`

---

### `index(Request $request)`
- **Method:** `GET`
- **Route:** `/api/student/assignments`
- **Input (query):** `subject_id`, `status`, `tag_ids`, `sort`, `search`
- **Logic:**
  - Scope to `class_assignments` in the student's enrolled classes where `status = open` and `deleted_at IS NULL`
  - For each assignment: load student's `assignment_submissions` record if it exists
  - Derive display status: `not_submitted` / `submitted` / `graded`
  - Include tags via `taggables`
- **Returns:** Assignment list with per-student submission status

---

### `show(int $id)`
- **Method:** `GET`
- **Route:** `/api/student/assignments/{id}`
- **Logic:**
  - Verify student is enrolled in the class
  - Load assignment with rubric (criteria + levels)
  - Load student's submission (`assignment_submissions`) if it exists, including `grade`, `feedback`, `student_note`, and `rubric_points` if graded
- **Returns:** Full assignment view with rubric and submission state

---

### `submit(Request $request, int $id)`
- **Method:** `POST`
- **Route:** `/api/student/assignments/{id}/submit`
- **Input:** `path_url`, `student_note` (optional)
- **Logic:**
  - Verify assignment is `status = open`
  - Verify no existing submission exists (unique constraint enforced)
  - Create `assignment_submissions` record with `status = submitted`
- **Returns:** Created submission, `201`

---

### `updateSubmission(Request $request, int $id)`
- **Method:** `PATCH`
- **Route:** `/api/student/assignments/{id}/submission`
- **Input:** `path_url`, `student_note`
- **Logic:**
  - Only allow update if current `status = submitted` (not already graded)
  - Update `path_url` and/or `student_note`
- **Returns:** Updated submission

---

## 26. `Student\AssessmentController`
**Path:** `App\Http\Controllers\Student\AssessmentController`
**Middleware:** `[Student]`
**Tables:** `class_assessments`, `assessment_attempts`, `assessment_answers`, `class_questions`, `class_options`, `class_assessment_questions`

---

### `index(Request $request)`
- **Method:** `GET`
- **Route:** `/api/student/assessments`
- **Input (query):** `subject_id`, `status`, `tag_ids`, `sort`, `search`
- **Logic:**
  - Scope to student's enrolled classes
  - For each assessment: load question count, student's attempt status (no attempt / in progress / submitted / graded), tags
- **Returns:** Assessment list with per-student attempt status

---

### `show(int $id)`
- **Method:** `GET`
- **Route:** `/api/student/assessments/{id}`
- **Logic:**
  - Verify enrollment
  - Load assessment metadata (title, description, duration, max_attempts, pass_threshold, due_date)
  - Load student's attempt history: count of attempts used, latest attempt status and score
- **Returns:** Pre-attempt info page payload

---

### `startAttempt(int $id)`
- **Method:** `POST`
- **Route:** `/api/student/assessments/{id}/attempt`
- **Logic:**
  - Verify `max_attempts` not exceeded: `assessment_attempts WHERE class_assessment_id = ? AND student_id = ? COUNT < class_assessments.max_attempts`
  - Verify assessment window is open (`start_date <= NOW()` and `due_date > NOW()` if set)
  - Create `assessment_attempts` record with `status = progress`, `start_time = NOW()`
  - Load all questions via `class_assessment_questions → class_questions → class_options`
  - Create pre-seeded `assessment_answers` rows (one per question, all `is_correct = NULL`, `selected_option_id = NULL`)
- **Returns:** `{ attempt_id, questions: [{ id, question, options: [{id, option}] }] }` — note: do not expose `is_correct` in options

---

### `saveAnswer(Request $request, int $attemptId, int $questionId)`
- **Method:** `PATCH`
- **Route:** `/api/student/attempts/{attemptId}/answers/{questionId}`
- **Input:** `selected_option_id`, `marked_for_review` (optional boolean)
- **Logic:**
  - Verify the attempt belongs to `auth()->id()` and has `status = progress`
  - Verify `selected_option_id` belongs to the given `question_id`
  - Determine correctness: `class_options.is_correct WHERE id = selected_option_id`
  - Update `assessment_answers`: set `selected_option_id`, `is_correct`, `marked_for_review`
- **Returns:** Updated answer record

---

### `submitAttempt(int $attemptId)`
- **Method:** `PATCH`
- **Route:** `/api/student/attempts/{attemptId}/submit`
- **Logic:**
  - Verify attempt belongs to student and is `status = progress`
  - Set `submit_time = NOW()`, `end_time = NOW()`
  - Compute `time_spent_seconds = TIMESTAMPDIFF(SECOND, start_time, NOW())`
  - Auto-score: sum of `class_questions.score WHERE assessment_answers.is_correct = true` for this attempt
  - Set `grade = computed_score`
  - Set `status = submitted` (teacher can finalize or it auto-grades)
- **Returns:** Finalized attempt summary with score

---

### `getAttemptResult(int $attemptId)`
- **Method:** `GET`
- **Route:** `/api/student/attempts/{attemptId}/result`
- **Logic:**
  - Verify attempt belongs to student and is not `status = progress`
  - Load attempt with per-question answers including: question text, selected option, correct option, `is_correct`, explanation (only after submission)
- **Returns:** Student-facing result view

---

## 27. `Student\PlanController`
**Path:** `App\Http\Controllers\Student\PlanController`
**Middleware:** `[Student]`
**Tables:** `plans`, `planables`

---

### `index(Request $request)`
- **Method:** `GET`
- **Route:** `/api/student/plans`
- **Input (query):** `status` (`active`|`completed`|`overdue`), `class_id`, `chapter_id`
- **Logic:**
  - Scope to `student_id = auth()->id()`
  - Derive status at query time:
    - `completed`: `completed_at != '0000-00-00 00:00:00'`
    - `overdue`: `target_date < NOW()` AND `completed_at = '0000-00-00 00:00:00'`
    - `active`: all others
  - Load `planables` with resolved model types
- **Returns:** Plan list with status and linked items

---

### `store(Request $request)`
- **Method:** `POST`
- **Route:** `/api/student/plans`
- **Input:** `class_id` (nullable), `chapter_id` (nullable), `title`, `description`, `target_date`, `planables` (array of `{ planable_id, planable_type }`)
- **Logic:**
  - Create `plans` record with `student_id = auth()->id()`
  - Insert `planables` rows for each item → `morph`
  - Initial `progress = 0`
- **Returns:** Created plan with planables, `201`

---

### `show(int $id)`
- **Method:** `GET`
- **Route:** `/api/student/plans/{id}`
- **Logic:**
  - Verify plan belongs to student
  - Load with `planables`, resolve each item (material title, assignment title, or assessment title)
  - Derive completion status of each planed item
- **Returns:** Full plan detail

---

### `update(Request $request, int $id)`
- **Method:** `PUT`
- **Route:** `/api/student/plans/{id}`
- **Input:** `title`, `description`, `target_date`
- **Returns:** Updated plan

---

### `updateProgress(Request $request, int $id)`
- **Method:** `PATCH`
- **Route:** `/api/student/plans/{id}/progress`
- **Input:** `progress` (float 0.0–1.0 or compute automatically from planables)
- **Logic:**
  - Update `plans.progress`
  - If `progress = 1.0` (or all planables are completed): set `completed_at = NOW()`
- **Returns:** Updated plan

---

### `addPlanable(Request $request, int $planId)`
- **Method:** `POST`
- **Route:** `/api/student/plans/{planId}/items`
- **Input:** `planable_id`, `planable_type`
- **Logic:** Insert into `planables`; unique constraint prevents duplicates → `morph`
- **Returns:** Created planable, `201`

---

### `removePlanable(int $planId, int $planableId)`
- **Method:** `DELETE`
- **Route:** `/api/student/plans/{planId}/items/{planableId}`
- **Logic:** Delete `planables` row
- **Returns:** `200 OK`

---

### `destroy(int $id)`
- **Method:** `DELETE`
- **Route:** `/api/student/plans/{id}`
- **Logic:** Delete plan (cascade deletes `planables` via FK ON DELETE CASCADE)
- **Returns:** `200 OK`

---

## 28. `Student\ReflectionController`
**Path:** `App\Http\Controllers\Student\ReflectionController`
**Middleware:** `[Student]` for write; `[Teacher]` for `addComment`

---

### `index(Request $request)`
- **Method:** `GET`
- **Route:** `/api/student/reflections`
- **Input (query):** `reflectable_type`, `search`, `sort`
- **Logic:**
  - Scope to `student_id = auth()->id()`
  - Load `reflectables` with resolved model names
  - Include `teacher_comment` if set
- **Returns:** Reflection list

---

### `store(Request $request)`
- **Method:** `POST`
- **Route:** `/api/student/reflections`
- **Input:** `title` (nullable), `content`, `comprehension_level` (1–5), `emotions` (JSON array), `reflectable_id`, `reflectable_type`
- **Logic:**
  - Create `reflections` record with `student_id = auth()->id()`
  - Insert into `reflectables` → `morph`
- **Returns:** Created reflection, `201`

---

### `show(int $id)`
- **Method:** `GET`
- **Route:** `/api/student/reflections/{id}`
- **Logic:** Verify ownership; load with reflectable item info and teacher comment
- **Returns:** Full reflection

---

### `update(Request $request, int $id)`
- **Method:** `PUT`
- **Route:** `/api/student/reflections/{id}`
- **Input:** `title`, `content`, `comprehension_level`, `emotions`
- **Logic:** Verify ownership; update (cannot change the reflectable target)
- **Returns:** Updated reflection

---

### `destroy(int $id)`
- **Method:** `DELETE`
- **Route:** `/api/student/reflections/{id}`
- **Logic:** Delete reflection (cascade deletes `reflectables` via FK ON DELETE CASCADE)
- **Returns:** `200 OK`

---

### `addComment(Request $request, int $id)` `[Teacher]`
- **Method:** `PATCH`
- **Route:** `/api/teacher/reflections/{id}/comment`
- **Middleware:** `[Teacher]`
- **Input:** `teacher_comment`
- **Logic:**
  - Verify the reflection belongs to a student in the teacher's class
  - Update `reflections.teacher_comment`
- **Returns:** Updated reflection

---

## 29. `Student\BookmarkController`
**Path:** `App\Http\Controllers\Student\BookmarkController`
**Middleware:** `[Student]`
**Tables:** `bookmarks`

---

### `index(Request $request)`
- **Method:** `GET`
- **Route:** `/api/student/bookmarks`
- **Input (query):** `bookmarkable_type` (filter by `Material`, `ClassAssignment`, `ClassAssessment`)
- **Logic:**
  - Scope to `student_id = auth()->id()`
  - Load and resolve each bookmarked item (title, type, relevant metadata)
- **Returns:** Bookmark list grouped or filtered by type

---

### `toggle(Request $request)`
- **Method:** `POST`
- **Route:** `/api/student/bookmarks/toggle`
- **Input:** `bookmarkable_id`, `bookmarkable_type`
- **Logic:**
  - If a `bookmarks` record exists for this student + item: delete it (un-bookmark)
  - If not: create it (bookmark)
  - Return the new state
- **Returns:** `{ bookmarked: bool }`

---

### `destroy(int $id)`
- **Method:** `DELETE`
- **Route:** `/api/student/bookmarks/{id}`
- **Logic:** Verify `student_id = auth()->id()`, delete record
- **Returns:** `200 OK`

---

## 30. `Student\MaterialReviewController`
**Path:** `App\Http\Controllers\Student\MaterialReviewController`
**Middleware:** `[Student]`
**Tables:** `material_reviews`

---

### `upsert(Request $request, int $materialId)`
- **Method:** `POST`
- **Route:** `/api/student/materials/{materialId}/review`
- **Input:** `score` (integer, 1–5)
- **Logic:**
  - Validate `score BETWEEN 1 AND 5`
  - Upsert: update if record exists for this `student_id` + `material_id`; create if not (unique constraint enforced)
- **Returns:** Created or updated review

---

### `show(int $materialId)`
- **Method:** `GET`
- **Route:** `/api/student/materials/{materialId}/review`
- **Logic:** Return the authenticated student's review for this material, or `null` if not reviewed
- **Returns:** Review record or `null`

---

## 31. `TagController`
**Path:** `App\Http\Controllers\TagController`
**Middleware:** `[Auth]` for index/show; `[Teacher]` for store/update/destroy

---

### `index(Request $request)`
- **Method:** `GET`
- **Route:** `/api/tags`
- **Input (query):** `search`
- **Logic:** Return all tags ordered by `name`. Used for tag autocomplete inputs.
- **Returns:** Tag list

---

### `store(Request $request)`
- **Method:** `POST`
- **Route:** `/api/tags`
- **Middleware:** `[Teacher]`
- **Input:** `name`
- **Logic:**
  - Generate `slug` from `name` (lowercase, hyphenated)
  - Insert if unique (unique constraint on `name`)
- **Returns:** Created tag, `201`

---

### `firstOrCreate(Request $request)`
- **Method:** `POST`
- **Route:** `/api/tags/first-or-create`
- **Middleware:** `[Teacher]`
- **Input:** `name`
- **Logic:** Return existing tag if found by name; create if not. Used for inline tag creation in forms.
- **Returns:** Tag record

---

## 32. `ActivityLogController`
**Path:** `App\Http\Controllers\ActivityLogController`
**Middleware:** `[Admin]`
**Tables:** `activity_logs`

---

### `index(Request $request)`
- **Method:** `GET`
- **Route:** `/api/admin/activity-logs`
- **Input (query):** `days` (default 7), `action`, `actor_id`
- **Logic:**
  - Return logs from the last `days` days ordered by `created_at DESC`
  - Join `users` on `actor_id` to return actor's `full_name` and `role`
  - Limit to 50 results for the dashboard feed; paginate for the full list
- **Returns:** Activity log list with actor info

---

### Internal helper: `ActivityLogService::log(int $actorId, string $action, string $targetType = null, int $targetId = null, string $description = null)`

This is not an HTTP endpoint — it is a shared service class to be called internally by any controller that performs a loggable action. All controllers marked `→ logs` above should call this service.

- **Location:** `App\Services\ActivityLogService`
- **Logic:** Insert a row into `activity_logs`

---

## Appendix A: Route Prefix Summary

```
/api/auth/...                          → AuthController
/api/admin/users/...                   → Admin\UserController
/api/admin/school-years/...            → Admin\SchoolYearController
/api/admin/subjects/...                → Admin\SubjectController
/api/admin/groups/...                  → Admin\GroupController
/api/admin/group-years/...             → Admin\GroupController (grade update)
/api/admin/classes/...                 → Admin\ClassController
/api/admin/dashboard/...               → Admin\DashboardController
/api/admin/activity-logs/...           → ActivityLogController

/api/teacher/classes/...               → Teacher\ClassController
/api/teacher/chapters/...              → Teacher\ChapterController
/api/teacher/materials/...             → Teacher\MaterialController
/api/teacher/material-access-logs/... → Student\MaterialController (end-access endpoint)
/api/teacher/attachments/...           → Teacher\AttachmentController
/api/teacher/assignments/...           → Teacher\AssignmentController
/api/teacher/rubrics/...               → Teacher\RubricController
/api/teacher/criteria/...              → Teacher\RubricController (levels)
/api/teacher/assessments/...           → Teacher\AssessmentController
/api/teacher/attempts/...              → Teacher\GradingAssessmentController
/api/teacher/questions/...             → Teacher\QuestionController
/api/teacher/gradebook/...             → Teacher\GradebookController
/api/teacher/dashboard/...             → Teacher\DashboardController
/api/teacher/reflections/...           → Student\ReflectionController (addComment)

/api/student/home/                     → Student\DashboardController
/api/student/dashboard/                → Student\DashboardController
/api/student/subjects/...              → Student\SubjectController
/api/student/materials/...             → Student\MaterialController
/api/student/assignments/...           → Student\AssignmentController
/api/student/assessments/...           → Student\AssessmentController
/api/student/attempts/...              → Student\AssessmentController
/api/student/plans/...                 → Student\PlanController
/api/student/reflections/...           → Student\ReflectionController
/api/student/bookmarks/...             → Student\BookmarkController

/api/tags/...                          → TagController
```

---

## Appendix B: Shared Business Rules for the AI Agent

The following rules must be enforced consistently across all controllers. Do not duplicate logic — extract these into Policy classes, Service classes, or middleware as appropriate.

| Rule | Where to Enforce |
|------|-----------------|
| Teacher can only access chapters, materials, assignments, assessments for subjects they are linked to via `subject_teachers` | Policy on Chapter, Material, ClassAssignment, ClassAssessment |
| Student can only access materials, assignments, assessments for classes they are enrolled in via `student_groups → group_years → classes` | Policy on Material, ClassAssignment, ClassAssessment |
| Only one active school year at a time | DB constraint (do not duplicate in code — let the constraint fail and catch the exception) |
| `assignment_weight + assessment_weight` must equal 100 | Validated in ClassController `store` and `updateGradingScheme` |
| Questions copied to `class_questions` at assessment creation must never be shared back to the bank | No reverse FK; enforce by design |
| Published materials (`status = published`) only are visible to students | Scope applied in all student-facing material queries |
| Soft-deleted users (`deleted_at IS NOT NULL`) are excluded from all queries | Global scope on `User` model |
| Soft-deleted classes and assignments are excluded from all active queries | Applied per-query with `whereNull('deleted_at')` |
| Upsert patterns (not insert) for: `material_completion`, `material_reviews`, `rubric_points` | Use `updateOrCreate` in Eloquent |
| `bookmarks` unique constraint: one bookmark per student per item | DB constraint; use `insertOrIgnore` or catch unique violation |
| Reflection's `reflectables` cascade-deleted on reflection delete | FK ON DELETE CASCADE in DB; no extra code needed |
| Plan's `planables` cascade-deleted on plan delete | FK ON DELETE CASCADE in DB; no extra code needed |
| `activity_logs` written on every admin write action | Call `ActivityLogService::log()` in all Admin controllers |
| Assessment answers auto-score on submission | Computed in `Student\AssessmentController::submitAttempt()` |
| Rubric grade auto-computed from `rubric_points` | Computed in `Teacher\GradingAssignmentController::saveScore()` and `submitGrade()` |
