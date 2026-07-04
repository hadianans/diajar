<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class GroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return match (true) {
            $this->isMethod('POST') && ($this->routeIs('*students*') || $this->is('*students*')) => [
                'student_ids'   => 'required|array|min:1',
                'student_ids.*' => 'integer|exists:users,id',
                'year_id'       => 'required|integer|exists:school_years,id',
            ],
            $this->isMethod('POST') && $this->input('groups') => [
                'groups'           => 'required|array|min:1',
                'groups.*.name'    => 'required|string|max:255',
                'groups.*.grade'   => 'required|integer|min:1|max:12',
                'year_id'          => 'required|integer|exists:school_years,id',
            ],
            $this->isMethod('POST') => [
                'name'    => 'required|string|max:255',
                'year_id' => 'required|integer|exists:school_years,id',
                'grade'   => 'required|integer',
            ],
            $this->isMethod('PUT') => [
                'name' => 'required|string|max:255',
            ],
            $this->isMethod('PATCH') => [
                'grade' => 'required|integer',
            ],
            default => [],
        };
    }
}
