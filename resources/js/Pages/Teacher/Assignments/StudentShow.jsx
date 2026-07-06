import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import GradingWorkspaceLayout from '@/Components/shared/layout/GradingWorkspaceLayout';
import SubmissionViewer from '@/Components/features/teacher-assignments/SubmissionViewer';
import RubricGradingPanel from '@/Components/features/teacher-assignments/RubricGradingPanel';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';
import api from '@/utils/api';

export default function StudentShow({ assignmentId, studentId }) {
    const { data, loading, mutate } = useApiGet(`/assignments/${assignmentId}/submissions/${studentId}`);
    const [saving, setSaving] = useState(false);
    const [localFeedback, setLocalFeedback] = useState('');
    const [localRubricPoints, setLocalRubricPoints] = useState({});

    // Sync local state when data is loaded
    React.useEffect(() => {
        if (data?.submission) {
            setLocalFeedback(data.submission.feedback || '');
        }
        if (data?.rubric_points) {
            setLocalRubricPoints(data.rubric_points);
        }
    }, [data]);

    const handleLevelSelect = (criterionId, levelId) => {
        setLocalRubricPoints(prev => ({
            ...prev,
            [criterionId]: {
                class_criterion_id: criterionId,
                class_rubric_level_id: levelId
            }
        }));
    };

    const handleBack = () => {
        router.visit(route('teacher.assignments.show', { assignmentId: assignmentId }));
    };

    const handleNext = () => {
        if (data?.next_student_id) {
            router.visit(route('teacher.assignments.students.show', { assignmentId: assignmentId, studentId: data.next_student_id }));
        }
    };

    const handleSaveDraft = async () => {
        if (!data || saving) return;
        setSaving(true);
        try {
            await api.patch(`/assignments/${assignmentId}/submissions/${studentId}/score`, {
                rubric_points: Object.values(localRubricPoints).map(pt => ({
                    class_criterion_id: pt.class_criterion_id,
                    class_rubric_level_id: pt.class_rubric_level_id
                })),
                feedback: localFeedback
            });
            mutate();
        } catch (err) {
            console.error('Failed to save draft', err);
        } finally {
            setSaving(false);
        }
    };

    const handleSubmitGrade = async () => {
        if (!data || saving) return;
        setSaving(true);
        try {
            await api.patch(`/assignments/${assignmentId}/submissions/${studentId}/submit-grade`, {
                rubric_points: Object.values(localRubricPoints).map(pt => ({
                    class_criterion_id: pt.class_criterion_id,
                    class_rubric_level_id: pt.class_rubric_level_id
                })),
                feedback: localFeedback
            });
            mutate();
            handleNext();
        } catch (err) {
            console.error('Failed to submit grade', err);
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <GradingWorkspaceLayout title="Loading..." onBack={handleBack} headerCenter={<></>} headerRight={<></>} footerLeft={<></>} footerRight={<></>}>
                <div className="text-center py-12 text-on-surface-variant">Loading submission...</div>
            </GradingWorkspaceLayout>
        );
    }

    if (!data || !data.submission) {
        return (
            <GradingWorkspaceLayout title="Not Found" onBack={handleBack} headerCenter={<></>} headerRight={<></>} footerLeft={<></>} footerRight={<></>}>
                <div className="text-center py-12 text-on-surface-variant">Submission not found.</div>
            </GradingWorkspaceLayout>
        );
    }

    const { submission, rubric, rubric_points, next_student_id } = data;
    const studentName = submission.student?.full_name || submission.student?.username || 'Unknown Student';

    const headerCenter = (
        <div className="flex flex-col">
            <h1 className="text-headline-md font-headline-md font-bold text-primary">{studentName}</h1>
            <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${submission.status === 'graded' ? 'bg-primary' : 'bg-error'}`}></span>
                <span className="text-label-sm font-label-sm text-on-surface-variant capitalize">{submission.status}</span>
            </div>
        </div>
    );

    const headerRight = (
        <button 
            onClick={handleNext}
            disabled={!next_student_id}
            className={`px-4 py-2 rounded-lg font-label-md text-label-md transition-all ${next_student_id ? 'bg-primary text-on-primary hover:bg-opacity-90 active:scale-95' : 'bg-surface-variant text-on-surface-variant opacity-50 cursor-not-allowed'}`}
        >
            Next
        </button>
    );

    const footerLeft = (
        <button onClick={handleSaveDraft} disabled={saving} className="flex flex-col items-center justify-center text-outline px-6 py-2 hover:opacity-90 scale-98 active:brightness-95 transition-all w-full md:w-auto">
            <Icon name="save" />
            <span className="text-label-md font-label-md">{saving ? 'Saving...' : 'Save Draft'}</span>
        </button>
    );

    const footerRight = (
        <button onClick={handleSubmitGrade} disabled={saving} className="flex flex-col items-center justify-center bg-primary text-on-primary rounded-xl px-6 py-2 hover:opacity-90 scale-98 active:brightness-95 transition-all w-full md:w-auto">
            <Icon name="check_circle" filled />
            <span className="text-label-md font-label-md">Submit Grade</span>
        </button>
    );

    // Map backend rubric to frontend structure
    const rubricCriteria = (rubric?.criteria || []).map(c => {
        const pt = rubric_points ? rubric_points[c.id] : null;
        let selectedLevel = null;
        let selectedPts = 0;
        
        if (pt) {
            selectedLevel = c.levels.find(l => l.id === pt.class_rubric_level_id);
            if (selectedLevel) selectedPts = selectedLevel.score;
        }
        
        return {
            id: c.id,
            title: c.title, 
            weight: c.weight,
            selected: selectedLevel ? selectedLevel.label : null,
            selectedPts: selectedPts,
            levels: c.levels.map(l => ({
                id: l.id,
                title: l.label, 
                pts: l.score, 
                description: l.description 
            }))
        };
    });

    const handleFeedbackChange = (newFeedback) => {
        setLocalFeedback(newFeedback);
    };

    return (
        <GradingWorkspaceLayout 
            title={`Grading: ${studentName}`}
            onBack={handleBack}
            headerCenter={headerCenter}
            headerRight={headerRight}
            footerLeft={footerLeft}
            footerRight={footerRight}
        >
            <SubmissionViewer 
                fileName={submission.file_name || "Submission_File.pdf"} 
                imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBhnbh7N6XTIFwGGSMe08ZZ0oecWuGVKDFjHTiRCWeduIxW2c3WQc3sI_rJp8snjlZ5GyhiwBVp8n-Xz7_XkSEXNYQy8Q0pn2UWd_C6MFNEWMupVZ9dMg0SrSqeqIb16y67Uk2wmYKXijXz_GTlucxjhW5Csp3I5C5vxbg-U6HMAupoFnkweG8KD_XV-lUMoHSxgbJEHyjPzdYOyNnNFlKIpKrQy-gDRtVX0Z9gf5NxrrMA4owi_C3zwzJWjTbm0t-_6iKx_HZGrqs"
            />
            
            {rubricCriteria.length > 0 ? (
                <RubricGradingPanel 
                    criteria={rubricCriteria} 
                    feedback={localFeedback}
                    onLevelSelect={handleLevelSelect}
                    onFeedbackChange={handleFeedbackChange}
                    grade={submission.grade || 0}
                    maxGrade={data.assignment?.grade || 100}
                />
            ) : (
                <div className="flex-1 bg-surface-container-lowest border-l border-outline-variant p-6 flex flex-col justify-center items-center h-full">
                    <p className="text-on-surface-variant font-body-md text-center">No rubric assigned for this assignment.</p>
                </div>
            )}
            
        </GradingWorkspaceLayout>
    );
}
