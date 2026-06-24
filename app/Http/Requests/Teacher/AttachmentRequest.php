<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class AttachmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'       => 'nullable|string|max:255',
            'description' => 'nullable|string|max:255',
            'file_url'    => 'nullable|string|max:255',
        ];
    }
}
