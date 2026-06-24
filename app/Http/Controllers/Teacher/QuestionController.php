<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\QuestionRequest;
use App\Models\AssessmentQuestion;
use App\Models\Option;
use App\Models\Question;
use App\Models\SubjectTeacher;
use App\Models\Taggable;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $teacherSubjectIds = SubjectTeacher::where('teacher_id', auth()->id())->pluck('subject_id');

        $query = Question::whereIn('subject_id', $teacherSubjectIds)
            ->with('tags');

        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }
        if ($request->filled('levels')) {
            $query->whereIn('levels', (array) $request->levels);
        }
        if ($request->filled('search')) {
            $query->where('question', 'like', '%' . $request->search . '%');
        }
        if ($request->filled('tag_ids')) {
            $query->whereHas('taggables', fn ($q) => $q->whereIn('tag_id', $request->tag_ids));
        }

        $sort = $request->input('sort', 'newest');
        $query->when($sort === 'newest', fn ($q) => $q->orderByDesc('created_at'))
              ->when($sort === 'level', fn ($q) => $q->orderBy('levels'))
              ->when($sort === 'score', fn ($q) => $q->orderByDesc('score'));

        $questions = $query->withCount('assessmentQuestions as usage_count')
            ->paginate(20)
            ->withQueryString();

        return $this->success($questions);
    }

    public function store(QuestionRequest $request): JsonResponse
    {
        $linked = SubjectTeacher::where('subject_id', $request->subject_id)
            ->where('teacher_id', auth()->id())
            ->exists();

        if (! $linked) {
            return $this->forbidden('You are not linked to this subject.');
        }

        $question = Question::create($request->only('subject_id', 'question', 'levels', 'explanation', 'score'));

        foreach ($request->options as $opt) {
            Option::create([
                'question_id' => $question->id,
                'option'      => $opt['option'],
                'is_correct'  => $opt['is_correct'],
            ]);
        }

        $this->syncTags($question, $request->input('tag_ids', []));
        $question->load('options', 'tags');

        return $this->created($question);
    }

    public function show(int $id): JsonResponse
    {
        $question = Question::with(['options', 'tags'])
            ->withCount('assessmentQuestions as usage_count')
            ->findOrFail($id);

        return $this->success($question);
    }

    public function update(QuestionRequest $request, int $id): JsonResponse
    {
        $question = Question::findOrFail($id);

        $linked = SubjectTeacher::where('subject_id', $question->subject_id)
            ->where('teacher_id', auth()->id())
            ->exists();

        if (! $linked) {
            return $this->forbidden();
        }

        $question->update($request->only('subject_id', 'question', 'levels', 'explanation', 'score'));

        // Replace options
        $question->options()->delete();
        foreach ($request->options as $opt) {
            Option::create([
                'question_id' => $question->id,
                'option'      => $opt['option'],
                'is_correct'  => $opt['is_correct'],
            ]);
        }

        $this->syncTags($question, $request->input('tag_ids', []));
        $question->load('options', 'tags');

        return $this->success($question);
    }

    public function destroy(int $id): JsonResponse
    {
        $question = Question::findOrFail($id);

        if (AssessmentQuestion::where('question_id', $question->id)->exists()) {
            return $this->conflict('Cannot delete: question is used in assessments.');
        }

        $question->options()->delete();
        Taggable::where('taggable_id', $question->id)->where('taggable_type', 'App\\Models\\Question')->delete();
        $question->delete();

        return $this->success(null, 'Question deleted');
    }

    private function syncTags(Question $question, array $tagIds): void
    {
        Taggable::where('taggable_id', $question->id)->where('taggable_type', 'App\\Models\\Question')->delete();

        foreach ($tagIds as $tagId) {
            Taggable::create([
                'tag_id'        => $tagId,
                'taggable_id'   => $question->id,
                'taggable_type' => 'App\\Models\\Question',
            ]);
        }
    }
}
