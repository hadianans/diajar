<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class SubjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return match (true) {
            $this->isMethod('POST') && $this->routeIs('*teachers*') => [
                'teacher_ids' => 'required|array|min:1',
                'teacher_ids.*' => 'integer|exists:users,id',
            ],
            $this->isMethod('POST'), $this->isMethod('PUT') => [
                'subject_name' => 'required|string|max:255',
                'description'  => 'nullable|string',
            ],
            default => [],
        };
    }
}
