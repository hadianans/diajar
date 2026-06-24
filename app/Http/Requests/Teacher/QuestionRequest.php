<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class QuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $action = $this->route()?->getActionMethod() ?? $this->method();

        return match ($action) {
            'store', 'update' => [
                'subject_id'         => 'required|integer|exists:subjects,id',
                'question'           => 'required|string',
                'levels'             => 'nullable|in:0,1,2,3,4,5',
                'explanation'        => 'nullable|string',
                'score'              => 'required|numeric|min:0',
                'options'            => 'required|array|min:2',
                'options.*.option'   => 'required|string',
                'options.*.is_correct' => 'required|boolean',
                'tag_ids'            => 'nullable|array',
                'tag_ids.*'          => 'integer|exists:tags,id',
            ],
            default => [],
        };
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($v) {
            $options = $this->input('options', []);
            $correctCount = collect($options)->where('is_correct', true)->count();
            if ($correctCount !== 1 && count($options) > 0) {
                $v->errors()->add('options', 'Exactly one option must be marked as correct.');
            }
        });
    }
}
