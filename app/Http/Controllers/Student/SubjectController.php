<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Bookmark;
use App\Models\ClassModel;
use App\Models\Material;
use App\Models\MaterialCompletion;
use App\Models\StudentGroup;
use App\Models\Taggable;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $studentId = auth()->id();
        $groupYearIds = StudentGroup::where('student_id', $studentId)->pluck('group_year_id');

        $classes = ClassModel::whereIn('group_years_id', $groupYearIds)
            ->whereNull('deleted_at')
            ->with([
                'subject:id,subject_name',
                'teacher:id,full_name,picture',
            ])
            ->get();

        if ($request->filled('search')) {
            $s = strtolower($request->search);
            $classes = $classes->filter(function ($c) use ($s) {
                return str_contains(strtolower($c->subject?->subject_name ?? ''), $s)
                    || str_contains(strtolower($c->teacher?->full_name ?? ''), $s);
            })->values();
        }

        $classes->each(function ($class) use ($studentId) {
            $totalMaterials = Material::where('status', 'published')
                ->whereHas('chapter', fn ($q) => $q->where('subject_id', $class->subject_id))
                ->count() ?: 1;

            $completed = MaterialCompletion::where('student_id', $studentId)
                ->where('is_completed', true)
                ->whereHas('material', fn ($q) => $q->where('status', 'published')
                    ->whereHas('chapter', fn ($q2) => $q2->where('subject_id', $class->subject_id)))
                ->count();

            $class->material_completion = round(($completed / $totalMaterials) * 100, 1);
        });

        return $this->success($classes);
    }

    public function chapters(int $subjectId): JsonResponse
    {
        $studentId = auth()->id();

        $chapters = \App\Models\Chapter::where('subject_id', $subjectId)
            ->orderBy('order')
            ->withCount([
                'materials as total_materials' => fn ($q) => $q->where('status', 'published'),
                'materials as video_count' => fn ($q) => $q->where('status', 'published')->where('file_type', 'video'),
                'materials as text_count' => fn ($q) => $q->where('status', 'published')->where('file_type', 'text'),
                'subchapters',
            ])
            ->get();

        $chapters->each(function ($ch) use ($studentId) {
            $total = $ch->total_materials ?: 1;
            $completed = MaterialCompletion::where('student_id', $studentId)
                ->where('is_completed', true)
                ->whereHas('material', fn ($q) => $q->where('chapter_id', $ch->id)->where('status', 'published'))
                ->count();

            $ch->completion = round(($completed / $total) * 100, 1);
        });

        return $this->success($chapters);
    }

    public function lessons(int $subjectId, int $chapterId, Request $request): JsonResponse
    {
        $studentId = auth()->id();

        $query = Material::where('chapter_id', $chapterId)
            ->where('status', 'published')
            ->with(['subchapter:id,name,order', 'tags'])
            ->orderBy('order');

        if ($request->filled('file_type')) {
            $query->where('file_type', $request->file_type);
        }
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }
        if ($request->filled('tag_ids')) {
            $query->whereHas('taggables', fn ($q) => $q->whereIn('tag_id', (array) $request->tag_ids));
        }

        $materials = $query->get();

        $materials->each(function ($m) use ($studentId) {
            $m->is_completed = MaterialCompletion::where('student_id', $studentId)
                ->where('material_id', $m->id)
                ->where('is_completed', true)
                ->exists();

            $m->is_bookmarked = Bookmark::where('student_id', $studentId)
                ->where('bookmarkable_id', $m->id)
                ->where('bookmarkable_type', 'App\\Models\\Material')
                ->exists();
        });

        // Group by subchapter
        $grouped = $materials->groupBy(fn ($m) => $m->subchapter_id ?? 'root');

        return $this->success($grouped);
    }
}
