import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AssessmentWizardLayout from '@/Components/shared/layout/AssessmentWizardLayout';
import WizardStepBasicInfo from '@/Components/features/teacher-assessments/WizardStepBasicInfo';
import WizardStepQuestionBank from '@/Components/features/teacher-assessments/WizardStepQuestionBank';
import WizardStepReview from '@/Components/features/teacher-assessments/WizardStepReview';

export default function Create() {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);

    const allQuestions = [
        { id: 9902, level: 'Analyze', levelColorClass: 'bg-tertiary-container/10 text-tertiary-container', pts: 20, category: 'Biology', text: 'Compare and contrast the structural differences between plant and animal cells during the process of cytokinesis.' },
        { id: 8421, level: 'Remember', levelColorClass: 'bg-secondary-container text-on-secondary-container', pts: 10, category: 'Cytology', text: 'Which organelle is primarily responsible for protein synthesis within the cell?' },
        { id: 7712, level: 'Understand', levelColorClass: 'bg-orange-100 text-orange-800', pts: 25, category: '', text: 'Explain how the phospholipid bilayer\'s structure contributes to the cell membrane\'s selective permeability.' },
    ];

    const selectedQuestions = allQuestions.filter(q => selectedQuestionIds.includes(q.id));
    const totalPoints = selectedQuestions.reduce((sum, q) => sum + q.pts, 0);

    const handleBack = () => {
        router.visit(route('teacher.assessments.index'));
    };

    const handleToggleSelect = (id) => {
        if (selectedQuestionIds.includes(id)) {
            setSelectedQuestionIds(selectedQuestionIds.filter(qId => qId !== id));
        } else {
            setSelectedQuestionIds([...selectedQuestionIds, id]);
        }
    };

    return (
        <AssessmentWizardLayout 
            title="Create Assessment"
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            onBack={handleBack}
            onPreview={() => {}}
            selectedQuestionsCount={selectedQuestionIds.length}
            totalPoints={totalPoints}
            selectedQuestions={selectedQuestions}
        >
            {currentStep === 1 && (
                <WizardStepBasicInfo onNext={() => setCurrentStep(2)} />
            )}
            
            {currentStep === 2 && (
                <WizardStepQuestionBank 
                    onBack={() => setCurrentStep(1)} 
                    onNext={() => setCurrentStep(3)} 
                    questions={allQuestions}
                    selectedIds={selectedQuestionIds}
                    onToggleSelect={handleToggleSelect}
                />
            )}
            
            {currentStep === 3 && (
                <WizardStepReview 
                    onBack={() => setCurrentStep(2)} 
                    selectedQuestions={selectedQuestions}
                    totalScore={totalPoints}
                    totalTime={45}
                />
            )}
        </AssessmentWizardLayout>
    );
}
