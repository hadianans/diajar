import React from 'react';
import { Head } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import useApiGet from '@/hooks/useApiGet';
import moment from 'moment';

// Feature Components
import ClassSidebar from '@/Components/features/teacher-classes/ClassSidebar';
import StudentProfileHeader from '@/Components/features/teacher-student-detail/StudentProfileHeader';
import AcademicSummaryCard from '@/Components/features/teacher-student-detail/AcademicSummaryCard';
import GradeTrendChart from '@/Components/features/teacher-student-detail/GradeTrendChart';
import MaterialEngagementList from '@/Components/features/teacher-student-detail/MaterialEngagementList';
import SRLPlanCard from '@/Components/features/teacher-student-detail/SRLPlanCard';
import HistoryList from '@/Components/features/teacher-student-detail/HistoryList';
import LatestReflectionCard from '@/Components/features/teacher-student-detail/LatestReflectionCard';

export default function StudentShow({ classId, studentId }) {
    const { data: reportData, loading } = useApiGet(`/classes/${classId}/students/${studentId}`);

    if (loading) {
        return (
            <DashboardTemplate role="teacher" activeTab="classes" title="Memuat..." showBack={true} onBack={() => window.history.back()}>
                <div className="text-center py-12 text-on-surface-variant">Memuat laporan siswa...</div>
            </DashboardTemplate>
        );
    }

    if (!reportData) {
        return (
            <DashboardTemplate role="teacher" activeTab="classes" title="Tidak Ditemukan" showBack={true} onBack={() => window.history.back()}>
                <div className="text-center py-12 text-on-surface-variant">Laporan tidak ditemukan.</div>
            </DashboardTemplate>
        );
    }

    const { student, academic_summary, material_engagement, assignment_history, assessment_history, plans, reflections } = reportData;

    const studentDetails = {
        id: student.id,
        name: student.full_name || student.username,
        avatar: student.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.full_name || student.username)}&background=random`,
        group: 'Siswa Terdaftar', // Group name might not be passed
        className: 'Tampilan Kelas',
        year: ''
    };

    const assignments = assignment_history.map(a => ({
        id: a.id,
        title: a.classAssignment?.title || 'Tugas Tidak Diketahui',
        subtitle: moment(a.created_at).format('MMM D, YYYY'),
        score: a.status === 'graded' ? `${a.grade}/100` : a.status,
        statusText: a.status === 'graded' ? 'Dinilai' : 'Tertunda',
        icon: 'description', iconBg: 'bg-primary-container/10', iconColor: 'text-primary'
    }));

    const assessments = assessment_history.map(a => ({
        id: a.id,
        title: a.classAssessment?.title || 'Penilaian Tidak Diketahui',
        subtitle: `${moment(a.created_at).format('MMM D')} • Time: ${Math.round(a.time_spent_seconds / 60)}m`,
        score: a.grade !== null ? `${a.grade}/100` : '-',
        statusBadge: true, statusBadgeText: a.grade >= 80 ? 'Luar Biasa' : (a.grade >= 60 ? 'Lulus' : 'Perlu Perbaikan'),
        statusBadgeBg: a.grade >= 80 ? 'bg-secondary-container/20' : (a.grade >= 60 ? 'bg-primary-container/20' : 'bg-error-container/20'),
        statusBadgeColor: a.grade >= 80 ? 'text-secondary' : (a.grade >= 60 ? 'text-primary' : 'text-error'),
        icon: 'quiz', iconBg: 'bg-tertiary-container/10', iconColor: 'text-tertiary'
    }));

    const latestPlan = plans.length > 0 ? plans[0] : null;
    const latestReflection = reflections.length > 0 ? reflections[0] : null;

    return (
        <DashboardTemplate
            role="teacher"
            activeTab="classes"
            title="Laporan Kemajuan Siswa"
            showBack={true}
            onBack={() => window.history.back()}
        >
            <Head title={`Kemajuan Siswa | LMS Diajar`} />

            <div className="max-w-[1280px] mx-auto pb-12 w-full pt-4">
                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
                    
                    {/* 1. Student Profile Header (Spans 8 columns on desktop) */}
                    <section className="md:col-span-8">
                        <StudentProfileHeader {...studentDetails} />
                    </section>

                    {/* 2. Academic Performance Summary (Spans 4 columns) */}
                    <section className="md:col-span-4">
                        <AcademicSummaryCard 
                            avgAssignment={`${academic_summary.avg_assignment_grade}%`}
                            avgAssessment={academic_summary.avg_assessment_score} 
                            completion={academic_summary.material_completion} 
                            trend={0} 
                        />
                    </section>

                    {/* 3. Grade Trend Chart (Spans 12 columns) - MOCK for now */}
                    <section className="md:col-span-12">
                        <GradeTrendChart dataPoints={[]} />
                    </section>

                    {/* 4. Material Engagement (Spans 6 columns) */}
                    <section className="md:col-span-6">
                        <MaterialEngagementList 
                            totalCompleted={academic_summary.material_completion} 
                            totalItems={100} 
                            timeSpent={material_engagement.total_time_spent ? material_engagement.total_time_spent / 3600 : 0} 
                            chapters={[]} 
                        />
                    </section>

                    {/* 5. SRL Plans (Spans 6 columns) */}
                    <section className="md:col-span-6">
                        {latestPlan ? (
                            <SRLPlanCard 
                                title={latestPlan.title} 
                                linkedChapter="" 
                                targetDate={moment(latestPlan.target_date).format('MMM D')} 
                                progress={latestPlan.progress} 
                            />
                        ) : (
                            <div className="p-6 bg-surface-container rounded-2xl h-full flex items-center justify-center text-on-surface-variant">
                                Tidak ada rencana pembelajaran aktif.
                            </div>
                        )}
                    </section>

                    {/* 6. History Lists (Combined Grid Spacing) */}
                    <section className="md:col-span-8 space-y-gutter flex flex-col h-full">
                        <div className="flex-1">
                            <HistoryList title="Riwayat Tugas" items={assignments} isAssessment={false} />
                        </div>
                        <div className="flex-1">
                            <HistoryList title="Riwayat Penilaian" items={assessments} isAssessment={true} />
                        </div>
                    </section>

                    {/* 7. SRL Reflections (Spans 4 columns) */}
                    <section className="md:col-span-4 flex flex-col h-full">
                        {latestReflection ? (
                            <LatestReflectionCard 
                                taskName={latestReflection.title}
                                comment={latestReflection.content}
                                rating={latestReflection.confidence_level}
                                feeling="Confidence"
                                feelingEmoji="😊"
                            />
                        ) : (
                            <div className="p-6 bg-surface-container rounded-2xl h-full flex items-center justify-center text-on-surface-variant">
                                Tidak ada refleksi terbaru.
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </DashboardTemplate>
    );
}
