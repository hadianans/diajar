<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class SubchapterRequest extends FormRequest
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
                'name'        => 'required|string|max:255',
                'description' => 'nullable|string|max:255',
                'order'       => 'nullable|integer',
            ],
            'reorder' => [
                'orders'         => 'required|array|min:1',
                'orders.*.id'    => 'required|integer|exists:subchapters,id',
                'orders.*.order' => 'required|integer',
            ],
            default => [],
        };
    }
}
