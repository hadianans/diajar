<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class SchoolYearRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return match ($this->method()) {
            'POST' => [
                'name'       => 'required|string|max:20',
                'date_start' => 'required|date',
                'date_end'   => 'required|date|after:date_start',
                'status'     => 'required|in:active,archive',
            ],
            'PUT' => [
                'name'       => 'required|string|max:20',
                'date_start' => 'required|date',
                'date_end'   => 'required|date|after:date_start',
            ],
            default => [],
        };
    }
}
