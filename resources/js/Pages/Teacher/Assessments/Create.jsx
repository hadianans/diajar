import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AssessmentWizardLayout from '@/Components/shared/layout/AssessmentWizardLayout';
import WizardStepBasicInfo from '@/Components/features/teacher-assessments/WizardStepBasicInfo';
import WizardStepQuestionBank from '@/Components/features/teacher-assessments/WizardStepQuestionBank';
import WizardStepReview from '@/Components/features/teacher-assessments/WizardStepReview';
import useApiGet from '@/hooks/useApiGet';
import api from '@/utils/api';
import { showError } from '@/utils/swal';

export default function Create() {
    const { data: classes } = useApiGet('/classes');
    const { data: chapters } = useApiGet('/chapters');
    const { data: questionsData, loading: questionsLoading } = useApiGet('/questions');

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        class_id: '',
        chapter_id: '',
        duration: 45,
        max_attempts: 1,
        pass_threshold: 70,
        start_date: '',
        due_date: '',
    });

    const allQuestions = questionsData?.data || questionsData || [];
    const selectedQuestions = allQuestions.filter(q => selectedQuestionIds.includes(q.id));
    const totalPoints = selectedQuestions.reduce((sum, q) => sum + (q.score || 0), 0);

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

    const handlePublish = async () => {
        setIsSaving(true);
        setErrors({});

        try {
            const payload = {
                class_id: parseInt(formData.class_id) || undefined,
                chapter_id: parseInt(formData.chapter_id) || undefined,
                title: formData.title,
                description: formData.description || null,
                start_date: formData.start_date || null,
                due_date: formData.due_date || null,
                duration: parseInt(formData.duration),
                max_attempts: parseInt(formData.max_attempts),
                pass_threshold: parseFloat(formData.pass_threshold),
                question_ids: selectedQuestionIds,
            };

            await api.post('/assessments', payload);
            router.visit(route('teacher.assessments.index'));
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
                // Jump back to step 1 if basic info errors
                const basicFields = ['class_id', 'chapter_id', 'title', 'duration', 'max_attempts', 'pass_threshold'];
                const hasBasicError = Object.keys(err.response.data.errors || {}).some(k => basicFields.includes(k));
                if (hasBasicError) setCurrentStep(1);
            } else {
                showError('Kesalahan', err.response?.data?.message || 'Kesalahan saat membuat penilaian');
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AssessmentWizardLayout 
            title="Buat Penilaian"
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            onBack={handleBack}
            onPreview={() => setCurrentStep(3)}
            selectedQuestionsCount={selectedQuestionIds.length}
            totalPoints={totalPoints}
            selectedQuestions={selectedQuestions}
        >
            <Head title="Buat Penilaian | LMS Diajar" />

            {currentStep === 1 && (
                <WizardStepBasicInfo 
                    onNext={() => setCurrentStep(2)} 
                    formData={formData}
                    onChange={setFormData}
                    errors={errors}
                    classes={classes || []}
                    chapters={chapters || []}
                />
            )}
            
            {currentStep === 2 && (
                <WizardStepQuestionBank 
                    onBack={() => setCurrentStep(1)} 
                    onNext={() => setCurrentStep(3)} 
                    questions={allQuestions}
                    selectedIds={selectedQuestionIds}
                    onToggleSelect={handleToggleSelect}
                    loading={questionsLoading}
                />
            )}
            
            {currentStep === 3 && (
                <WizardStepReview 
                    onBack={() => setCurrentStep(2)} 
                    selectedQuestions={selectedQuestions}
                    formData={formData}
                    onPublish={handlePublish}
                    isSaving={isSaving}
                    errors={errors}
                />
            )}
        </AssessmentWizardLayout>
    );
}
