<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return match ($this->method()) {
            'POST'  => $this->storeRules(),
            'PUT'   => $this->updateRules(),
            'PATCH' => $this->passwordRules(),
            default => [],
        };
    }

    protected function storeRules(): array
    {
        return [
            'full_name' => 'required|string|max:255',
            'username'  => 'required|string|max:255|unique:users,username',
            'email'     => 'required|email|max:255|unique:users,email',
            'password'  => 'required|string|min:8|confirmed',
            'role'      => 'required|in:admin,teacher,student',
            'gender'    => 'required|boolean',
            'is_active' => 'required|boolean',
            'picture'   => 'nullable|string|max:255',
        ];
    }

    protected function updateRules(): array
    {
        $userId = $this->route('id');

        return [
            'full_name'             => 'required|string|max:255',
            'username'              => ['required', 'string', 'max:255', Rule::unique('users')->ignore($userId)],
            'email'                 => ['required', 'email', 'max:255', Rule::unique('users')->ignore($userId)],
            'role'                  => 'required|in:admin,teacher,student',
            'gender'                => 'required|boolean',
            'is_active'             => 'required|boolean',
            'role_change_confirmed' => 'sometimes|boolean',
            'picture'               => 'nullable|string|max:255',
        ];
    }

    protected function passwordRules(): array
    {
        return [
            'password' => 'required|string|min:8|confirmed',
        ];
    }
}
