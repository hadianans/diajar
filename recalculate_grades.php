<?php

use App\Models\AssessmentAttempt;
use App\Models\AssessmentAnswer;
use App\Models\ClassAssessmentQuestion;

$attempts = AssessmentAttempt::whereNotNull('grade')->get();

foreach ($attempts as $attempt) {
    $totalScore = AssessmentAnswer::where('attempt_id', $attempt->id)
        ->where('is_correct', true)
        ->join('class_questions', 'assessment_answers.question_id', '=', 'class_questions.id')
        ->sum('class_questions.score');

    $maxPossibleScore = ClassAssessmentQuestion::where('class_assessment_id', $attempt->class_assessment_id)
        ->join('class_questions', 'class_assessment_questions.class_question_id', '=', 'class_questions.id')
        ->sum('class_questions.score');

    if ($maxPossibleScore > 0) {
        $finalGrade = round(($totalScore / $maxPossibleScore) * 100, 1);
        $attempt->update(['grade' => $finalGrade]);
        echo "Updated attempt {$attempt->id} with grade {$finalGrade}%\n";
    }
}

echo "Done.\n";
