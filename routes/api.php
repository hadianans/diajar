<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\ActivityLogController;

use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\SchoolYearController as AdminSchoolYearController;
use App\Http\Controllers\Admin\SubjectController as AdminSubjectController;
use App\Http\Controllers\Admin\GroupController as AdminGroupController;
use App\Http\Controllers\Admin\ClassController as AdminClassController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;

use App\Http\Controllers\Teacher\ClassController as TeacherClassController;
use App\Http\Controllers\Teacher\ChapterController as TeacherChapterController;
use App\Http\Controllers\Teacher\SubchapterController as TeacherSubchapterController;
use App\Http\Controllers\Teacher\MaterialController as TeacherMaterialController;
use App\Http\Controllers\Teacher\AttachmentController as TeacherAttachmentController;
use App\Http\Controllers\Teacher\QuestionController as TeacherQuestionController;
use App\Http\Controllers\Teacher\AssignmentController as TeacherAssignmentController;
use App\Http\Controllers\Teacher\RubricController as TeacherRubricController;
use App\Http\Controllers\Teacher\AssessmentController as TeacherAssessmentController;
use App\Http\Controllers\Teacher\GradingAssignmentController;
use App\Http\Controllers\Teacher\GradingAssessmentController;
use App\Http\Controllers\Teacher\GradebookController;
use App\Http\Controllers\Teacher\StudentReportController;
use App\Http\Controllers\Teacher\DashboardController as TeacherDashboardController;

use App\Http\Controllers\Student\DashboardController as StudentDashboardController;
use App\Http\Controllers\Student\SubjectController as StudentSubjectController;
use App\Http\Controllers\Student\MaterialController as StudentMaterialController;
use App\Http\Controllers\Student\AssignmentController as StudentAssignmentController;
use App\Http\Controllers\Student\AssessmentController as StudentAssessmentController;
use App\Http\Controllers\Student\PlanController as StudentPlanController;
use App\Http\Controllers\Student\ReflectionController as StudentReflectionController;
use App\Http\Controllers\Student\BookmarkController as StudentBookmarkController;
use App\Http\Controllers\Student\MaterialReviewController as StudentMaterialReviewController;
use App\Http\Controllers\Student\GradebookController as StudentGradebookController;

/*
|--------------------------------------------------------------------------
| Auth Routes (public + auth)
|--------------------------------------------------------------------------
*/

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->middleware(['auth:sanctum', 'role:admin'])->group(function () {

    // Dashboard
    Route::get('/dashboard/summary', [AdminDashboardController::class, 'summary']);
    Route::get('/dashboard/checklist', [AdminDashboardController::class, 'setupChecklist']);

    // Users
    Route::get('/users/check-username', [AdminUserController::class, 'checkUsername']);
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::post('/users', [AdminUserController::class, 'store']);
    Route::get('/users/{id}', [AdminUserController::class, 'show']);
    Route::put('/users/{id}', [AdminUserController::class, 'update']);
    Route::patch('/users/{id}/password', [AdminUserController::class, 'updatePassword']);
    Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);

    // School Years
    Route::get('/school-years', [AdminSchoolYearController::class, 'index']);
    Route::post('/school-years', [AdminSchoolYearController::class, 'store']);
    Route::get('/school-years/{id}', [AdminSchoolYearController::class, 'show']);
    Route::put('/school-years/{id}', [AdminSchoolYearController::class, 'update']);
    Route::patch('/school-years/{id}/archive', [AdminSchoolYearController::class, 'archive']);
    Route::patch('/school-years/{id}/reactivate', [AdminSchoolYearController::class, 'reactivate']);

    // Subjects
    Route::get('/subjects', [AdminSubjectController::class, 'index']);
    Route::post('/subjects', [AdminSubjectController::class, 'store']);
    Route::get('/subjects/{id}', [AdminSubjectController::class, 'show']);
    Route::put('/subjects/{id}', [AdminSubjectController::class, 'update']);
    Route::delete('/subjects/{id}', [AdminSubjectController::class, 'destroy']);
    Route::post('/subjects/{subjectId}/teachers', [AdminSubjectController::class, 'linkTeacher']);
    Route::delete('/subjects/{subjectId}/teachers/{teacherId}', [AdminSubjectController::class, 'unlinkTeacher']);

    // Groups
    Route::get('/groups/unlinked-students', [AdminGroupController::class, 'unlinkedStudents']);
    Route::get('/groups', [AdminGroupController::class, 'index']);
    Route::post('/groups', [AdminGroupController::class, 'store']);
    Route::get('/groups/{id}', [AdminGroupController::class, 'show']);
    Route::put('/groups/{id}', [AdminGroupController::class, 'update']);
    Route::post('/groups/{groupId}/students', [AdminGroupController::class, 'linkStudents']);
    Route::delete('/groups/{groupId}/students/{studentId}', [AdminGroupController::class, 'unlinkStudent']);
    Route::patch('/group-years/{groupYearId}/grade', [AdminGroupController::class, 'updateGrade']);

    // Classes
    Route::get('/classes', [AdminClassController::class, 'index']);
    Route::post('/classes', [AdminClassController::class, 'store']);
    Route::get('/classes/{id}', [AdminClassController::class, 'show']);
    Route::patch('/classes/{id}/schedule', [AdminClassController::class, 'updateSchedule']);
    Route::patch('/classes/{id}/grading-scheme', [AdminClassController::class, 'updateGradingScheme']);
    Route::patch('/classes/{id}/cohorts', [AdminClassController::class, 'updateCohorts']);
    Route::delete('/classes/{id}', [AdminClassController::class, 'destroy']);

    // Activity Logs
    Route::get('/activity-logs', [ActivityLogController::class, 'index']);
});

/*
|--------------------------------------------------------------------------
| Teacher Routes
|--------------------------------------------------------------------------
*/

Route::prefix('teacher')->middleware(['auth:sanctum', 'role:teacher'])->group(function () {

    // Dashboard & Activity
    Route::get('/dashboard', [TeacherDashboardController::class, 'summary']);
    Route::get('/subjects', [TeacherDashboardController::class, 'subjects']);
    Route::get('/activity-logs', [ActivityLogController::class, 'index']);

    // Classes
    Route::get('/classes', [TeacherClassController::class, 'index']);
    Route::get('/classes/{id}', [TeacherClassController::class, 'show']);
    Route::get('/classes/{classId}/students/{studentId}', [StudentReportController::class, 'show']);

    // Chapters
    Route::patch('/chapters/reorder', [TeacherChapterController::class, 'reorder']);
    Route::get('/chapters', [TeacherChapterController::class, 'index']);
    Route::post('/chapters', [TeacherChapterController::class, 'store']);
    Route::get('/chapters/{id}', [TeacherChapterController::class, 'show']);
    Route::put('/chapters/{id}', [TeacherChapterController::class, 'update']);
    Route::delete('/chapters/{id}', [TeacherChapterController::class, 'destroy']);

    // Subchapters (nested under chapters)
    Route::patch('/chapters/{chapterId}/subchapters/reorder', [TeacherSubchapterController::class, 'reorder']);
    Route::post('/chapters/{chapterId}/subchapters', [TeacherSubchapterController::class, 'store']);
    Route::put('/chapters/{chapterId}/subchapters/{id}', [TeacherSubchapterController::class, 'update']);
    Route::delete('/chapters/{chapterId}/subchapters/{id}', [TeacherSubchapterController::class, 'destroy']);

    // Materials
    Route::post('/materials/upload-image', [TeacherMaterialController::class, 'uploadImage']);
    Route::patch('/materials/reorder', [TeacherMaterialController::class, 'reorder']);
    Route::post('/materials', [TeacherMaterialController::class, 'store']);
    Route::get('/materials/{id}', [TeacherMaterialController::class, 'show']);
    Route::put('/materials/{id}', [TeacherMaterialController::class, 'update']);
    Route::patch('/materials/{id}/publish', [TeacherMaterialController::class, 'publish']);
    Route::patch('/materials/{id}/unpublish', [TeacherMaterialController::class, 'unpublish']);
    Route::delete('/materials/{id}', [TeacherMaterialController::class, 'destroy']);

    // Attachments (nested under materials)
    Route::post('/materials/{materialId}/attachments', [TeacherAttachmentController::class, 'store']);
    Route::put('/materials/{materialId}/attachments/{id}', [TeacherAttachmentController::class, 'update']);
    Route::delete('/materials/{materialId}/attachments/{id}', [TeacherAttachmentController::class, 'destroy']);

    // Question Bank
    Route::get('/questions', [TeacherQuestionController::class, 'index']);
    Route::post('/questions', [TeacherQuestionController::class, 'store']);
    Route::get('/questions/{id}', [TeacherQuestionController::class, 'show']);
    Route::put('/questions/{id}', [TeacherQuestionController::class, 'update']);
    Route::delete('/questions/{id}', [TeacherQuestionController::class, 'destroy']);

    // Tags
    Route::get('/tags', [TagController::class, 'index']);
    Route::post('/tags', [TagController::class, 'store']);
    Route::post('/tags/first-or-create', [TagController::class, 'firstOrCreate']);

    // Assignments
    Route::get('/assignments', [TeacherAssignmentController::class, 'index']);
    Route::post('/assignments', [TeacherAssignmentController::class, 'store']);
    Route::get('/assignments/{id}', [TeacherAssignmentController::class, 'show']);
    Route::put('/assignments/{id}', [TeacherAssignmentController::class, 'update']);
    Route::patch('/assignments/{id}/close', [TeacherAssignmentController::class, 'close']);
    Route::patch('/assignments/{id}/reopen', [TeacherAssignmentController::class, 'reopen']);
    Route::delete('/assignments/{id}', [TeacherAssignmentController::class, 'destroy']);

    // Assignment Attachments
    Route::post('/assignments/{assignmentId}/attachments', [\App\Http\Controllers\Teacher\TeacherAssignmentAttachmentController::class, 'store']);
    Route::delete('/assignments/{assignmentId}/attachments/{id}', [\App\Http\Controllers\Teacher\TeacherAssignmentAttachmentController::class, 'destroy']);

    // Assignment Grading
    Route::get('/assignments/{assignmentId}/submissions/{studentId}', [GradingAssignmentController::class, 'show']);
    Route::patch('/assignments/{assignmentId}/submissions/{studentId}/score', [GradingAssignmentController::class, 'saveScore']);
    Route::patch('/assignments/{assignmentId}/submissions/{studentId}/submit-grade', [GradingAssignmentController::class, 'submitGrade']);

    // Rubrics
    Route::put('/assignments/{assignmentId}/rubric', [TeacherRubricController::class, 'updateRubric']);
    Route::post('/rubrics/{rubricId}/criteria', [TeacherRubricController::class, 'storeCriterion']);
    Route::put('/rubrics/{rubricId}/criteria/{criterionId}', [TeacherRubricController::class, 'updateCriterion']);
    Route::delete('/rubrics/{rubricId}/criteria/{criterionId}', [TeacherRubricController::class, 'destroyCriterion']);
    Route::post('/criteria/{criterionId}/levels', [TeacherRubricController::class, 'storeLevel']);
    Route::put('/criteria/{criterionId}/levels/{levelId}', [TeacherRubricController::class, 'updateLevel']);
    Route::delete('/criteria/{criterionId}/levels/{levelId}', [TeacherRubricController::class, 'destroyLevel']);

    // Assessments
    Route::get('/assessments', [TeacherAssessmentController::class, 'index']);
    Route::post('/assessments', [TeacherAssessmentController::class, 'store']);
    Route::get('/assessments/{id}', [TeacherAssessmentController::class, 'show']);
    Route::put('/assessments/{id}', [TeacherAssessmentController::class, 'update']);
    Route::delete('/assessments/{id}', [TeacherAssessmentController::class, 'destroy']);

    // Assessment Grading
    Route::get('/assessments/{assessmentId}/attempts/{studentId}', [GradingAssessmentController::class, 'showAnswerSheet']);
    Route::patch('/attempts/{attemptId}/finalize', [GradingAssessmentController::class, 'finalizeGrade']);

    // Gradebook
    Route::get('/gradebook/{classId}', [GradebookController::class, 'groupGrades']);

    // Reflection comment (teacher adds comment to student reflection)
    Route::patch('/reflections/{id}/comment', [StudentReflectionController::class, 'addComment']);
});

/*
|--------------------------------------------------------------------------
| Student Routes
|--------------------------------------------------------------------------
*/

Route::prefix('student')->middleware(['auth:sanctum', 'role:student'])->group(function () {

    // Home & Dashboard
    Route::get('/home', [StudentDashboardController::class, 'home']);
    Route::get('/dashboard', [StudentDashboardController::class, 'srlDashboard']);

    // Subjects & Chapters
    Route::get('/subjects', [StudentSubjectController::class, 'index']);
    Route::get('/subjects/{subjectId}/chapters', [StudentSubjectController::class, 'chapters']);
    Route::get('/subjects/{subjectId}/chapters/{chapterId}/materials', [StudentSubjectController::class, 'lessons']);

    // Materials
    Route::get('/materials/{id}', [StudentMaterialController::class, 'show']);
    Route::post('/materials/{id}/access/start', [StudentMaterialController::class, 'startAccess']);
    Route::patch('/material-access-logs/{logId}/end', [StudentMaterialController::class, 'endAccess']);
    Route::patch('/materials/{id}/complete', [StudentMaterialController::class, 'markComplete']);
    Route::patch('/materials/{id}/incomplete', [StudentMaterialController::class, 'markIncomplete']);

    // Material Reviews
    Route::post('/materials/{materialId}/review', [StudentMaterialReviewController::class, 'upsert']);
    Route::get('/materials/{materialId}/review', [StudentMaterialReviewController::class, 'show']);

    // Assignments
    Route::get('/assignments', [StudentAssignmentController::class, 'index']);
    Route::get('/assignments/{id}', [StudentAssignmentController::class, 'show']);
    Route::post('/assignments/{id}/submit', [StudentAssignmentController::class, 'submit']);
    Route::patch('/assignments/{id}/submission', [StudentAssignmentController::class, 'updateSubmission']);

    // Assessments
    Route::get('/assessments', [StudentAssessmentController::class, 'index']);
    Route::get('/assessments/{id}', [StudentAssessmentController::class, 'show']);
    Route::post('/assessments/{id}/attempt', [StudentAssessmentController::class, 'startAttempt']);
    Route::patch('/attempts/{attemptId}/answers/{questionId}', [StudentAssessmentController::class, 'saveAnswer']);
    Route::patch('/attempts/{attemptId}/submit', [StudentAssessmentController::class, 'submitAttempt']);
    Route::get('/attempts/{attemptId}/result', [StudentAssessmentController::class, 'getAttemptResult']);

    // Plans (SRL)
    Route::get('/plans', [StudentPlanController::class, 'index']);
    Route::post('/plans', [StudentPlanController::class, 'store']);
    Route::get('/plans/{id}', [StudentPlanController::class, 'show']);
    Route::put('/plans/{id}', [StudentPlanController::class, 'update']);
    Route::patch('/plans/{id}/progress', [StudentPlanController::class, 'updateProgress']);
    Route::post('/plans/{planId}/items', [StudentPlanController::class, 'addPlanable']);
    Route::delete('/plans/{planId}/items/{planableId}', [StudentPlanController::class, 'removePlanable']);
    Route::delete('/plans/{id}', [StudentPlanController::class, 'destroy']);

    // Reflections (SRL)
    Route::get('/reflections', [StudentReflectionController::class, 'index']);
    Route::post('/reflections', [StudentReflectionController::class, 'store']);
    Route::get('/reflections/{id}', [StudentReflectionController::class, 'show']);
    Route::put('/reflections/{id}', [StudentReflectionController::class, 'update']);
    Route::delete('/reflections/{id}', [StudentReflectionController::class, 'destroy']);

    // Gradebook
    Route::get('/gradebook', [StudentGradebookController::class, 'index']);

    // Bookmarks
    Route::get('/bookmarks', [StudentBookmarkController::class, 'index']);
    Route::post('/bookmarks/toggle', [StudentBookmarkController::class, 'toggle']);
    Route::delete('/bookmarks/{id}', [StudentBookmarkController::class, 'destroy']);
});

/*
|--------------------------------------------------------------------------
| Shared / Tags Routes
|--------------------------------------------------------------------------
*/

Route::prefix('tags')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [TagController::class, 'index']);
    Route::post('/', [TagController::class, 'store'])->middleware('role:teacher');
    Route::post('/first-or-create', [TagController::class, 'firstOrCreate'])->middleware('role:teacher');
});
