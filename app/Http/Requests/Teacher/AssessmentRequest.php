<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class AssessmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $action = $this->route()?->getActionMethod() ?? $this->method();

        return match ($action) {
            'store' => [
                'class_id'       => 'required|integer|exists:classes,id',
                'chapter_id'     => 'required|integer|exists:chapters,id',
                'material_id'    => 'nullable|integer|exists:materials,id',
                'title'          => 'required|string|max:255',
                'description'    => 'nullable|string',
                'start_date'     => 'nullable|date',
                'due_date'       => 'nullable|date',
                'duration'       => 'required|integer|min:1',
                'max_attempts'   => 'required|integer|min:1',
                'pass_threshold' => 'required|numeric|min:0|max:100',
                'question_ids'   => 'required|array|min:1',
                'question_ids.*' => 'integer|exists:questions,id',
                'tag_ids'        => 'nullable|array',
                'tag_ids.*'      => 'integer|exists:tags,id',
            ],
            'update' => [
                'title'          => 'required|string|max:255',
                'description'    => 'nullable|string',
                'start_date'     => 'nullable|date',
                'due_date'       => 'nullable|date',
                'duration'       => 'required|integer|min:1',
                'max_attempts'   => 'required|integer|min:1',
                'pass_threshold' => 'required|numeric|min:0|max:100',
                'tag_ids'        => 'nullable|array',
                'tag_ids.*'      => 'integer|exists:tags,id',
            ],
            default => [],
        };
    }
}
