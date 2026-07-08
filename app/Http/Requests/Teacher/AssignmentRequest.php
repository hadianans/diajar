<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class AssignmentRequest extends FormRequest
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
                'class_id'                          => 'required|integer|exists:classes,id',
                'chapter_id'                        => 'required|integer|exists:chapters,id',
                'material_id'                       => 'nullable|integer|exists:materials,id',
                'title'                             => 'required|string|max:255',
                'description'                       => 'nullable|string',
                'due_date'                          => 'nullable|date',
                'grade'                             => 'nullable|integer|min:0',
                'rubric'                            => 'nullable|array',
                'rubric.title'                      => 'required_with:rubric|string|max:255',
                'rubric.description'                => 'nullable|string',
                'rubric.criteria'                   => 'required_with:rubric|array|min:1',
                'rubric.criteria.*.title'           => 'required|string|max:255',
                'rubric.criteria.*.description'     => 'nullable|string',
                'rubric.criteria.*.weight'          => 'required|integer|min:0',
                'rubric.criteria.*.levels'          => 'required|array|min:1',
                'rubric.criteria.*.levels.*.label'  => 'required|string|max:255',
                'rubric.criteria.*.levels.*.score'  => 'required|integer|min:0',
                'rubric.criteria.*.levels.*.description' => 'nullable|string',
                'tag_ids'                           => 'nullable|array',
                'tag_ids.*'                         => 'integer|exists:tags,id',
            ],
            'update' => [
                'title'       => 'required|string|max:255',
                'description' => 'nullable|string',
                'due_date'    => 'nullable|date',
                'grade'       => 'nullable|integer|min:0',
                'status'      => 'nullable|in:open,closed',
                'tag_ids'     => 'nullable|array',
                'tag_ids.*'   => 'integer|exists:tags,id',
                'rubric'                            => 'nullable|array',
                'rubric.title'                      => 'required_with:rubric|string|max:255',
                'rubric.description'                => 'nullable|string',
                'rubric.criteria'                   => 'required_with:rubric|array|min:1',
                'rubric.criteria.*.title'           => 'required|string|max:255',
                'rubric.criteria.*.description'     => 'nullable|string',
                'rubric.criteria.*.weight'          => 'required|integer|min:0',
                'rubric.criteria.*.levels'          => 'required|array|min:1',
                'rubric.criteria.*.levels.*.label'  => 'required|string|max:255',
                'rubric.criteria.*.levels.*.score'  => 'required|integer|min:0',
                'rubric.criteria.*.levels.*.description' => 'nullable|string',
            ],
            default => [],
        };
    }
}
