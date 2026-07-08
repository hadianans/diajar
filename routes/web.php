<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

// ============================================================
// Student Routes
// ============================================================
Route::middleware(['auth', 'verified', 'role:student'])->prefix('student')->name('student.')->group(function () {
    Route::get('/homepage', function () {
        return Inertia::render('Student/Homepage');
    })->name('homepage');

    Route::get('/dashboard', function () {
        return Inertia::render('Student/Dashboard');
    })->name('dashboard');

    Route::get('/profile', function () {
        return Inertia::render('Student/Profile');
    })->name('profile');

    Route::get('/subjects', function () {
        return Inertia::render('Student/Subjects/Index');
    })->name('subjects.index');

    Route::get('/subjects/{subjectId}', function ($subjectId) {
        return Inertia::render('Student/Subjects/Show', ['subjectId' => $subjectId]);
    })->name('subjects.show');

    Route::get('/subjects/{subjectId}/{chapterId}', function ($subjectId, $chapterId) {
        return Inertia::render('Student/Subjects/Chapters/Show', [
            'subjectId' => $subjectId,
            'chapterId' => $chapterId,
        ]);
    })->name('subjects.chapters.show');

    Route::get('/subjects/{subjectId}/{chapterId}/{lessonId}', function ($subjectId, $chapterId, $lessonId) {
        return Inertia::render('Student/Subjects/Chapters/Lessons/Show', [
            'subjectId' => $subjectId,
            'chapterId' => $chapterId,
            'lessonId' => $lessonId,
        ]);
    })->name('subjects.chapters.lessons.show');

    Route::get('/assignments', function () {
        return Inertia::render('Student/Assignments/Index');
    })->name('assignments.index');

    Route::get('/assignments/{assignmentId}', function ($assignmentId) {
        return Inertia::render('Student/Assignments/Show', ['assignmentId' => $assignmentId]);
    })->name('assignments.show');

    Route::get('/assessments', function () {
        return Inertia::render('Student/Assessments/Index');
    })->name('assessments.index');

    Route::get('/assessments/{assessmentId}', function ($assessmentId) {
        return Inertia::render('Student/Assessments/Show', ['assessmentId' => $assessmentId]);
    })->name('assessments.show');

    Route::get('/assessments/{assessmentId}/attempt', function ($assessmentId) {
        return Inertia::render('Student/Assessments/Attempt', ['assessmentId' => $assessmentId]);
    })->name('assessments.attempt');

    Route::get('/attempts/{attemptId}/result', function ($attemptId) {
        return Inertia::render('Student/Assessments/Result', ['attemptId' => $attemptId]);
    })->name('attempts.result');

    Route::get('/gradebook', function () {
        return Inertia::render('Student/Gradebook/Index');
    })->name('gradebook.index');

    Route::get('/gradebook/{subjectId}', function ($subjectId) {
        return Inertia::render('Student/Gradebook/Show', ['subjectId' => $subjectId]);
    })->name('gradebook.show');

    // SRL Deep-Dives
    Route::get('/planner', function () {
        return Inertia::render('Student/SRL/Planner');
    })->name('srl.plan');

    Route::get('/reflect', function () {
        return Inertia::render('Student/SRL/ReflectionModal');
    })->name('srl.reflect');

    Route::get('/plans', function () {
        return Inertia::render('Student/SRL/Plans/Index');
    })->name('srl.plans.index');

    Route::get('/reflections', function () {
        return Inertia::render('Student/SRL/Reflections/Index');
    })->name('srl.reflections.index');
});

// ============================================================
// Teacher Routes
// ============================================================
Route::middleware(['auth', 'verified', 'role:teacher'])->prefix('teacher')->name('teacher.')->group(function () {
    Route::get('/homepage', function () {
        return Inertia::render('Teacher/Homepage');
    })->name('homepage');

    Route::get('/profile', function () {
        return Inertia::render('Teacher/Profile');
    })->name('profile');

    // Classes
    Route::get('/classes', function () {
        return Inertia::render('Teacher/Classes/Index');
    })->name('classes.index');

    Route::get('/classes/{classId}', function ($classId) {
        return Inertia::render('Teacher/Classes/Show', ['classId' => $classId]);
    })->name('classes.show');

    Route::get('/classes/{classId}/{studentId}', function ($classId, $studentId) {
        return Inertia::render('Teacher/Classes/StudentShow', [
            'classId' => $classId,
            'studentId' => $studentId,
        ]);
    })->name('classes.students.show');

    // Chapters
    Route::get('/chapters', function () {
        return Inertia::render('Teacher/Chapters/Index');
    })->name('chapters.index');

    Route::get('/chapters/{chapterId}', function ($chapterId) {
        return Inertia::render('Teacher/Chapters/Show', ['chapterId' => $chapterId]);
    })->name('chapters.show');

    Route::get('/chapters/{chapterId}/lessons/create', function ($chapterId) {
        return Inertia::render('Teacher/Chapters/Create', ['chapterId' => $chapterId]);
    })->name('chapters.lessons.create');

    Route::get('/chapters/lessons/{lessonId}/edit', function ($lessonId) {
        return Inertia::render('Teacher/Chapters/Edit', ['lessonId' => $lessonId]);
    })->name('chapters.lessons.edit');

    Route::get('/chapters/{chapterId}/{lessonId}', function ($chapterId, $lessonId) {
        return Inertia::render('Teacher/Chapters/LessonShow', [
            'chapterId' => $chapterId,
            'lessonId' => $lessonId,
        ]);
    })->name('chapters.lessons.show');

    // Resource Chapters
    Route::get('/resources/chapters', function () {
        return Inertia::render('Teacher/Resources/Chapters/Index');
    })->name('resources.chapters.index');

    Route::get('/resources/chapters/{chapterId}', function ($chapterId) {
        return Inertia::render('Teacher/Resources/Chapters/Show', ['chapterId' => $chapterId]);
    })->name('resources.chapters.show');

    Route::get('/resources/chapters/{chapterId}/{lessonId}', function ($chapterId, $lessonId) {
        return Inertia::render('Teacher/Resources/Chapters/LessonShow', [
            'chapterId' => $chapterId,
            'lessonId' => $lessonId,
        ]);
    })->name('resources.chapters.lessons.show');

    // Assignments
    Route::get('/assignments', function () {
        return Inertia::render('Teacher/Assignments/Index');
    })->name('assignments.index');

    Route::get('/assignments/create', function () {
        return Inertia::render('Teacher/Assignments/Create');
    })->name('assignments.create');

    Route::get('/assignments/{assignmentId}/edit', function ($assignmentId) {
        return Inertia::render('Teacher/Assignments/Edit', ['assignmentId' => $assignmentId]);
    })->name('assignments.edit');

    Route::get('/assignments/{assignmentId}', function ($assignmentId) {
        return Inertia::render('Teacher/Assignments/Show', ['assignmentId' => $assignmentId]);
    })->name('assignments.show');

    Route::get('/assignments/{assignmentId}/{studentId}', function ($assignmentId, $studentId) {
        return Inertia::render('Teacher/Assignments/StudentShow', [
            'assignmentId' => $assignmentId,
            'studentId' => $studentId,
        ]);
    })->name('assignments.students.show');

    // Resource Assignments
    Route::get('/resources/assignments', function () {
        return Inertia::render('Teacher/Resources/Assignments/Index');
    })->name('resources.assignments.index');

    Route::get('/resources/assignments/{assignmentId}', function ($assignmentId) {
        return Inertia::render('Teacher/Resources/Assignments/Show', ['assignmentId' => $assignmentId]);
    })->name('resources.assignments.show');

    // Assessments
    Route::get('/assessments', function () {
        return Inertia::render('Teacher/Assessments/Index');
    })->name('assessments.index');

    Route::get('/assessments/create', function () {
        return Inertia::render('Teacher/Assessments/Create');
    })->name('assessments.create');

    Route::get('/assessments/questions', function () {
        return Inertia::render('Teacher/Assessments/Questions/Index');
    })->name('assessments.questions.index');

    Route::get('/assessments/questions/create', function () {
        return Inertia::render('Teacher/Assessments/Questions/Create');
    })->name('assessments.questions.create');

    Route::get('/assessments/questions/{questionId}', function ($questionId) {
        return Inertia::render('Teacher/Assessments/Questions/Show', ['questionId' => $questionId]);
    })->name('assessments.questions.show');

    Route::get('/assessments/questions/{questionId}/edit', function ($questionId) {
        return Inertia::render('Teacher/Assessments/Questions/Edit', ['questionId' => $questionId]);
    })->name('assessments.questions.edit');

    Route::get('/assessments/{assessmentId}/edit', function ($assessmentId) {
        return Inertia::render('Teacher/Assessments/Edit', ['assessmentId' => $assessmentId]);
    })->name('assessments.edit');

    Route::get('/assessments/{assessmentId}', function ($assessmentId) {
        return Inertia::render('Teacher/Assessments/Show', ['assessmentId' => $assessmentId]);
    })->name('assessments.show');

    Route::get('/assessments/{assessmentId}/{studentId}', function ($assessmentId, $studentId) {
        return Inertia::render('Teacher/Assessments/StudentShow', [
            'assessmentId' => $assessmentId,
            'studentId' => $studentId,
        ]);
    })->name('assessments.students.show');

    // Resource Assessments
    Route::get('/resources/assessments', function () {
        return Inertia::render('Teacher/Resources/Assessments/Index');
    })->name('resources.assessments.index');

    Route::get('/resources/assessments/{assessmentId}', function ($assessmentId) {
        return Inertia::render('Teacher/Resources/Assessments/Show', ['assessmentId' => $assessmentId]);
    })->name('resources.assessments.show');

    // Gradebook
    Route::get('/gradebook', function () {
        return Inertia::render('Teacher/Gradebook/Index');
    })->name('gradebook.index');

    Route::get('/gradebook/{classId}', function ($classId) {
        return Inertia::render('Teacher/Gradebook/Show', ['classId' => $classId]);
    })->name('gradebook.show');
});

// ============================================================
// Admin Routes
// ============================================================
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/homepage', function () {
        return Inertia::render('Admin/Homepage');
    })->name('homepage');

    // Accounts
    Route::get('/accounts', function () {
        return Inertia::render('Admin/Accounts/Index');
    })->name('accounts.index');

    Route::get('/accounts/create', function () {
        return Inertia::render('Admin/Accounts/Create');
    })->name('accounts.create');

    Route::get('/accounts/{accountId}', function ($accountId) {
        return Inertia::render('Admin/Accounts/Show', ['accountId' => $accountId]);
    })->name('accounts.show');

    Route::get('/accounts/{accountId}/edit', function ($accountId) {
        return Inertia::render('Admin/Accounts/Edit', ['accountId' => $accountId]);
    })->name('accounts.edit');

    // Academic
    Route::get('/academic', function () {
        return Inertia::render('Admin/Academic/Index');
    })->name('academic.index');

    Route::get('/academic/years/{yearId}', function ($yearId) {
        return Inertia::render('Admin/Academic/Years/Show', ['yearId' => $yearId]);
    })->name('academic.years.show');

    Route::get('/academic/subjects/{subjectId}', function ($subjectId) {
        return Inertia::render('Admin/Academic/Subjects/Show', ['subjectId' => $subjectId]);
    })->name('academic.subjects.show');

    Route::get('/academic/groups/{groupId}', function ($groupId) {
        return Inertia::render('Admin/Academic/Groups/Show', ['groupId' => $groupId]);
    })->name('academic.groups.show');

    // Classes
    Route::get('/classes', function () {
        return Inertia::render('Admin/Classes/Index');
    })->name('classes.index');

    Route::get('/classes/create', function () {
        return Inertia::render('Admin/Classes/Create');
    })->name('classes.create');

    Route::get('/classes/{classId}', function ($classId) {
        return Inertia::render('Admin/Classes/Show', ['classId' => $classId]);
    })->name('classes.show');
});

// ============================================================
// Legacy Dashboard (redirect to student homepage)
// ============================================================
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// ============================================================
// Profile Routes (from Breeze)
// ============================================================
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
