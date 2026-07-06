<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class ChapterRequest extends FormRequest
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
                'subject_id'    => 'required|integer|exists:subjects,id',
                'name'          => 'required|string|max:255',
                'description'   => 'nullable|string',
                'order'         => 'nullable|integer',
                'target_grade'  => 'nullable|integer',
                'target_groups' => 'nullable|array',
                'target_groups.*' => 'integer',
                'tags'          => 'nullable|array|max:3',
                'tags.*'        => 'string|max:50',
            ],
            'update' => [
                'name'          => 'required|string|max:255',
                'description'   => 'nullable|string',
                'order'         => 'nullable|integer',
                'target_grade'  => 'nullable|integer',
                'target_groups' => 'nullable|array',
                'target_groups.*' => 'integer',
                'tags'          => 'nullable|array|max:3',
                'tags.*'        => 'string|max:50',
            ],
            'reorder' => [
                'orders'        => 'required|array|min:1',
                'orders.*.id'   => 'required|integer|exists:chapters,id',
                'orders.*.order' => 'required|integer',
            ],
            default => [],
        };
    }
}
