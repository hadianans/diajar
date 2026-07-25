import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import AssessmentFilters from '@/Components/features/student-assessments/AssessmentFilters';
import AssessmentCard from '@/Components/features/student-assessments/AssessmentCard';
import useApiGet from '@/hooks/useApiGet';

export default function Index() {
    const { data: assessmentsData, loading } = useApiGet('/assessments');
    const [searchQuery, setSearchQuery] = useState('');

    const mappedAssessments = (assessmentsData || []).map(item => ({
        id: item.id,
        subject: item.classModel?.subject?.subject_name || item.classModel?.subject?.name || 'Mata Pelajaran',
        title: item.title,
        date: item.due_date ? `Tenggat: ${new Date(item.due_date).toLocaleString('id-ID', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}` : 'Tidak ada tenggat waktu',
        duration: item.duration_minutes ? `${item.duration_minutes} mnt` : 'Tanpa batas waktu',
        questionsCount: item.question_count || 0,
        status: item.attempt_status === 'no_attempt' ? 'Mendatang' : (item.attempt_status === 'in_progress' ? 'Sedang Berlangsung' : 'Selesai'),
        type: item.type || 'Kuis',
        priority: item.attempt_status === 'no_attempt' && item.due_date && new Date(item.due_date).getTime() - new Date().getTime() < 86400000 ? 'Prioritas Tinggi' : null,
        progress: item.attempt_status === 'in_progress' ? 50 : (item.attempt_status !== 'no_attempt' ? 100 : 0),
        progressText: item.attempt_status === 'in_progress' ? 'Sedang Berlangsung' : (item.attempt_status !== 'no_attempt' ? 'Selesai' : 'Belum Dimulai')
    }));

    const filteredAssessments = mappedAssessments.filter(assessment => 
        assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        assessment.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const headerSection = (
        <section>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Penilaian</h1>
            <p className="text-on-surface-variant text-body-md mt-1">Lacak dan kelola kuis dan ujian Anda di semua mata pelajaran.</p>
        </section>
    );

    return (
        <DashboardTemplate 
            activeTab="tasks"
            title="Penilaian"
            headerSection={headerSection}
        >
            <Head title="Penilaian" />

            <div className="max-w-3xl mx-auto space-y-stack-lg">
                <AssessmentFilters onSearch={setSearchQuery} />
                
                <div className="space-y-gutter">
                    {loading ? (
                        <div className="text-center py-8 text-on-surface-variant">Memuat penilaian...</div>
                    ) : filteredAssessments.length > 0 ? (
                        filteredAssessments.map(assessment => (
                            <div key={assessment.id} onClick={() => router.visit(`/student/assessments/${assessment.id}`)}>
                                <AssessmentCard 
                                    {...assessment} 
                                    onAction={(e) => {
                                        e.stopPropagation();
                                        console.log('Action', assessment.id);
                                    }}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-on-surface-variant bg-surface-container rounded-xl">
                            Tidak ada penilaian yang ditemukan.
                        </div>
                    )}
                </div>
            </div>
        </DashboardTemplate>
    );
}
