<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class MaterialRequest extends FormRequest
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
                'chapter_id'       => 'required|integer|exists:chapters,id',
                'subchapter_id'    => 'nullable|integer|exists:subchapters,id',
                'title'            => 'required|string|max:255',
                'description'      => 'nullable|string|max:255',
                'content'          => 'nullable|string',
                'order'            => 'nullable|integer',
                'file_type'        => 'required|in:video,text',
                'duration_seconds' => 'nullable|integer|min:0',
                'file_url'         => 'nullable|string|max:255',
                'status'           => 'required|in:draft,published',
                'tag_ids'          => 'nullable|array',
                'tag_ids.*'        => 'integer|exists:tags,id',
            ],
            'reorder' => [
                'orders'         => 'required|array|min:1',
                'orders.*.id'    => 'required|integer|exists:materials,id',
                'orders.*.order' => 'required|integer',
            ],
            default => [],
        };
    }
}
