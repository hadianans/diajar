import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import AssessmentFilterTabs from '@/Components/features/teacher-assessments/AssessmentFilterTabs';
import AssessmentCard from '@/Components/features/teacher-assessments/AssessmentCard';
import useApiGet from '@/hooks/useApiGet';
import api from '@/utils/api';
import { showError, confirmDelete } from '@/utils/swal';
import moment from 'moment';

export default function Index() {
    const { data: assessments, loading, refetch } = useApiGet('/assessments');
    const [activeTab, setActiveTab] = useState('all');

    const handleCreate = () => {
        router.visit(route('teacher.assessments.create'));
    };

    const handleDelete = async (id) => {
        const confirmed = await confirmDelete('Hapus Penilaian?', 'Tindakan ini akan menghapus penilaian ini secara permanen.');
        if (!confirmed) return;
        try {
            await api.delete(`/assessments/${id}`);
            refetch();
        } catch (err) {
            showError('Kesalahan', err.response?.data?.message || 'Kesalahan saat menghapus penilaian');
        }
    };

    // Compute filter counts and filtered list
    const { filteredAssessments, counts } = useMemo(() => {
        if (!assessments) return { filteredAssessments: [], counts: {} };

        const all = assessments;
        const scheduled = all.filter(a => a.lifecycle_status === 'scheduled');
        const active = all.filter(a => a.lifecycle_status === 'active');
        const completed = all.filter(a => a.lifecycle_status === 'completed');

        const counts = {
            all: all.length,
            scheduled: scheduled.length,
            active: active.length,
            completed: completed.length,
        };

        let filtered = all;
        if (activeTab !== 'all') {
            filtered = all.filter(a => a.lifecycle_status === activeTab);
        }

        return { filteredAssessments: filtered, counts };
    }, [assessments, activeTab]);

    const calculateTimeRemaining = (dueDate) => {
        if (!dueDate) return null;
        const diff = moment(dueDate).diff(moment(), 'minutes');
        if (diff <= 0) return null;
        if (diff > 24 * 60) return `${Math.floor(diff / (24 * 60))} hari tersisa`;
        const hours = Math.floor(diff / 60);
        const mins = diff % 60;
        if (hours > 0) return `${hours}j ${mins}m`;
        return `${mins}m`;
    };

    const customTitleSection = (
        <div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Penilaian</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Rancang dan lacak evaluasi kinerja siswa.</p>
        </div>
    );

    const actions = (
        <button 
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all shadow-md"
        >
            <Icon name="add" />
            Buat Penilaian
        </button>
    );

    const headerSection = (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            {customTitleSection}
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => router.visit(route('teacher.assessments.questions.index'))}
                    className="flex items-center justify-center gap-2 bg-surface-container-high text-on-surface px-6 py-3 rounded-lg font-label-md text-label-md hover:bg-surface-container-highest active:scale-95 transition-all shadow-sm"
                >
                    <Icon name="database" />
                    Bank Soal
                </button>
                {actions}
            </div>
        </div>
    );

    return (
        <DashboardTemplate role="teacher" activeTab="assessments" headerSection={headerSection}>
            <Head title="Penilaian | LMS Diajar" />
            
            <AssessmentFilterTabs 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
                counts={counts}
            />

            {/* Assessment Grid */}
            {loading ? (
                <div className="text-center py-12 text-on-surface-variant">Memuat penilaian...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
                    {filteredAssessments.length > 0 ? (
                        filteredAssessments.map(a => (
                            <AssessmentCard 
                                key={a.id}
                                id={a.id.toString()}
                                title={a.title}
                                chapter={a.chapter?.name || "Tidak Dikategorikan"}
                                state={a.lifecycle_status}
                                classAvg={a.avg_score ? `${a.avg_score}%` : "-"}
                                participationCompleted={a.attempt_count || 0}
                                participationTotal={a.class_model?.group_year?.student_groups_count || a.attempt_count || 0}
                                duration={a.duration || 0}
                                questionsCount={a.question_count || 0}
                                timeRemaining={a.lifecycle_status === 'active' ? calculateTimeRemaining(a.due_date) : null}
                                progressPercentage={a.attempt_count ? Math.min((a.attempt_count / (a.class_model?.group_year?.student_groups_count || 30)) * 100, 100) : 0}
                                onDelete={() => handleDelete(a.id)}
                            />
                        ))
                    ) : (
                        <div className="col-span-full p-8 text-center text-on-surface-variant bg-surface-container rounded-2xl">
                            {activeTab === 'all' ? 'Anda tidak memiliki penilaian.' : `Tidak ada penilaian ${activeTab}.`}
                        </div>
                    )}
                </div>
            )}
            
        </DashboardTemplate>
    );
}
