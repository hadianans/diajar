import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import SubmissionViewer from '@/Components/features/teacher-assignments/SubmissionViewer';
import RubricGradingPanel from '@/Components/features/teacher-assignments/RubricGradingPanel';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';
import api from '@/utils/api';

export default function StudentShow({ assignmentId, studentId }) {
    const { data, loading, refetch } = useApiGet(`/assignments/${assignmentId}/submissions/${studentId}`);
    const [saving, setSaving] = useState(false);
    const [localFeedback, setLocalFeedback] = useState('');
    const [localRubricPoints, setLocalRubricPoints] = useState({});
    const [isEditing, setIsEditing] = useState(true);

    // Sync local state when data is loaded
    React.useEffect(() => {
        if (data?.submission) {
            setLocalFeedback(data.submission.feedback || '');
            setIsEditing(data.submission.status !== 'graded');
        }
        if (data?.rubric_points) {
            setLocalRubricPoints(data.rubric_points);
        }
    }, [data]);

    const handleLevelSelect = (criterionId, levelId) => {
        if (!isEditing) return;
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
            await refetch();
            setIsEditing(false);
            // Only auto-next if we're not just updating an already graded submission
            if (data.submission.status !== 'graded') {
                handleNext();
            }
        } catch (err) {
            console.error('Failed to submit grade', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <DashboardTemplate role="teacher" activeTab="assignments" title="Memuat..." showBack={true} onBack={handleBack}>
                <div className="text-center py-12 text-on-surface-variant">Memuat kiriman...</div>
            </DashboardTemplate>
        );
    }

    if (!data || !data.submission) {
        return (
            <DashboardTemplate role="teacher" activeTab="assignments" title="Tidak Ditemukan" showBack={true} onBack={handleBack}>
                <div className="text-center py-12 text-on-surface-variant">Kiriman tidak ditemukan.</div>
            </DashboardTemplate>
        );
    }

    const { submission, rubric, rubric_points, next_student_id } = data;
    const studentName = submission.student?.full_name || submission.student?.username || 'Siswa Tidak Diketahui';

    const headerRight = (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container border border-outline-variant">
                <span className={`w-2 h-2 rounded-full ${submission.status === 'graded' ? 'bg-primary' : 'bg-error'}`}></span>
                <span className="text-label-sm font-label-sm text-on-surface-variant capitalize">{submission.status}</span>
            </div>
            <button 
                onClick={handleNext}
                disabled={!next_student_id}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-label-md transition-all ${next_student_id ? 'bg-primary text-on-primary hover:brightness-110 active:scale-95 shadow-sm' : 'bg-surface-variant text-on-surface-variant opacity-50 cursor-not-allowed'}`}
            >
                Siswa Berikutnya
                <Icon name="arrow_forward" className="text-[16px]" />
            </button>
        </div>
    );

    // Map backend rubric to frontend structure
    const rubricCriteria = (rubric?.criteria || []).map(c => {
        const pt = localRubricPoints ? localRubricPoints[c.id] : null;
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

    const liveGrade = rubric?.criteria?.reduce((acc, c) => {
        const pt = localRubricPoints[c.id];
        if (pt) {
            const level = c.levels.find(l => l.id === pt.class_rubric_level_id);
            if (level) {
                const maxScore = Math.max(...c.levels.map(l => l.score)) || 1;
                return acc + ((level.score / maxScore) * c.weight);
            }
        }
        return acc;
    }, 0) || 0;
    const finalLiveGrade = Math.round(liveGrade * 10) / 10; // Round to 1 decimal place

    const handleFeedbackChange = (newFeedback) => {
        if (!isEditing) return;
        setLocalFeedback(newFeedback);
    };

    return (
        <DashboardTemplate 
            role="teacher" 
            activeTab="assignments" 
            title={`Penilaian: ${studentName}`}
            showBack={true}
            onBack={handleBack}
            actions={headerRight}
        >
            <Head title={`Penilaian: ${studentName}`} />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12 mt-2 w-full max-w-[1600px] mx-auto">
                <SubmissionViewer 
                    fileName={submission.path_url ? submission.path_url.split('/').pop() : "Tidak Ada File yang Diserahkan"} 
                    pathUrl={submission.path_url}
                />
                
                {rubricCriteria.length > 0 ? (
                    <div className="lg:col-span-5 flex flex-col relative h-[442px] lg:h-[calc(100vh-8rem)]">
                        <div className="flex-1 overflow-hidden relative border border-outline-variant rounded-xl bg-surface-container-lowest">
                            <div className="absolute inset-0 overflow-y-auto hide-scrollbar p-2 pb-24">
                                <RubricGradingPanel 
                                    criteria={rubricCriteria} 
                                    feedback={localFeedback}
                                    onLevelSelect={handleLevelSelect}
                                    onFeedbackChange={handleFeedbackChange}
                                    grade={isEditing ? finalLiveGrade : (submission.grade || 0)}
                                    maxGrade={data.assignment?.grade || 100}
                                    readOnly={!isEditing}
                                />
                            </div>
                        </div>
                        <div className="mt-4 shrink-0 flex gap-3">
                            {isEditing ? (
                                <>
                                    {submission.status === 'graded' && (
                                        <button 
                                            onClick={() => {
                                                setIsEditing(false);
                                                setLocalFeedback(submission.feedback || '');
                                                setLocalRubricPoints(data.rubric_points || {});
                                            }}
                                            disabled={saving}
                                            className="flex-1 flex items-center justify-center border border-outline text-on-surface rounded-xl px-6 py-3.5 hover:bg-surface-container-low active:scale-95 transition-all shadow-sm"
                                        >
                                            <span className="text-label-lg font-label-lg">Batal</span>
                                        </button>
                                    )}
                                    <button 
                                        onClick={handleSubmitGrade} 
                                        disabled={saving} 
                                        className="flex-[2] flex items-center justify-center bg-primary text-on-primary rounded-xl px-6 py-3.5 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-primary/20 disabled:opacity-50"
                                    >
                                        <Icon name="check_circle" filled className="mr-2" />
                                        <span className="text-label-lg font-label-lg">{saving ? 'Menyimpan...' : (submission.status === 'graded' ? 'Simpan Perubahan' : 'Serahkan Nilai')}</span>
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={() => setIsEditing(true)} 
                                    className="flex items-center justify-center bg-secondary text-on-secondary rounded-xl px-6 py-3.5 hover:brightness-110 active:scale-95 transition-all w-full shadow-md shadow-secondary/20"
                                >
                                    <Icon name="edit" filled className="mr-2" />
                                    <span className="text-label-lg font-label-lg">Edit Nilai</span>
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant p-6 flex flex-col justify-center items-center h-[442px] lg:h-[calc(100vh-8rem)] rounded-xl">
                        <Icon name="fact_check" className="text-4xl text-outline mb-2" />
                        <p className="text-on-surface-variant font-body-md text-center max-w-[200px]">Tidak ada rubrik yang ditetapkan untuk tugas ini.</p>
                    </div>
                )}
            </div>
        </DashboardTemplate>
    );
}
