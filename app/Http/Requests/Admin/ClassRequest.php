<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ClassRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $action = $this->route()->getActionMethod();

        return match ($action) {
            'store' => [
                'subject_id'        => 'required|integer|exists:subjects,id',
                'teacher_id'        => 'required|integer|exists:users,id',
                'group_years_ids'   => 'required|array|min:1',
                'group_years_ids.*' => 'integer|exists:group_years,id',
                'day_schedule'      => 'nullable|integer|between:0,6',
                'time_schedule'     => 'nullable|date_format:H:i',
                'assignment_weight' => 'required|numeric|min:0|max:100',
                'assessment_weight' => 'required|numeric|min:0|max:100',
            ],
            'updateSchedule' => [
                'day_schedule'  => 'required|integer|between:0,6',
                'time_schedule' => 'required|date_format:H:i',
            ],
            'updateGradingScheme' => [
                'assignment_weight' => 'required|numeric|min:0|max:100',
                'assessment_weight' => 'required|numeric|min:0|max:100',
            ],
            default => [],
        };
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($v) {
            $action = $this->route()->getActionMethod();
            if (in_array($action, ['store', 'updateGradingScheme'])) {
                $aw = (float) $this->input('assignment_weight', 0);
                $as = (float) $this->input('assessment_weight', 0);
                if (abs(($aw + $as) - 100) > 0.01) {
                    $v->errors()->add('assignment_weight', 'assignment_weight + assessment_weight must equal 100.');
                }
            }
        });
    }
}
