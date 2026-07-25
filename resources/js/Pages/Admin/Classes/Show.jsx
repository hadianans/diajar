import React, { useState, useMemo, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import ClassSummaryCard from '@/Components/features/classes/ClassSummaryCard';
import LinkedCohortCard from '@/Components/features/classes/LinkedCohortCard';
import StudentsAccessCard from '@/Components/features/classes/StudentsAccessCard';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';
import api from '@/utils/api';
import { showSuccess, showError, showInfo, confirmDelete } from '@/utils/swal';
import ClassScheduleModal from '@/Components/features/classes/ClassScheduleModal';
import GroupYearSelectionModal from '@/Components/features/academic/modals/GroupYearSelectionModal';

const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function Show({ classId }) {
    const { data: cls, loading, refetch: refetchClass } = useApiGet(`/classes/${classId}`);
    const { data: groupsData } = useApiGet(cls ? `/groups?exclude_subject_id=${cls.subject_id}&except_class_id=${cls.id}` : null);

    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [isCohortModalOpen, setIsCohortModalOpen] = useState(false);
    const [groupYears, setGroupYears] = useState([]);

    useEffect(() => {
        if (groupsData) {
            const allGroupYears = groupsData.map(gy => ({
                id: gy.id,
                group_name: gy.group?.name || 'Tidak diketahui',
                grade: gy.grade
            }));
            setGroupYears(allGroupYears);
        }
    }, [groupsData]);

    const handleBack = () => {
        router.visit('/admin/classes');
    };

    const handleActionClick = (actionName) => {
        showInfo('Tindakan Dimulai', `Alur ${actionName}...`);
    };

    const handleDeleteClass = async () => {
        const confirmed = await confirmDelete('Hapus kelas ini?', 'Semua data kelas, log, dan konfigurasi akan dihapus secara permanen. Ini tidak dapat dibatalkan.');
        if (confirmed) {
            try {
                await api.delete(`/classes/${classId}`);
                showSuccess('Kelas berhasil dihapus.');
                router.visit('/admin/classes');
            } catch (err) {
                showError('Kesalahan', err.response?.data?.message || 'Gagal menghapus kelas.');
            }
        }
    };

    const handleEditScheduleClick = () => {
        setIsScheduleModalOpen(true);
    };

    const handleCohortSubmit = async (selectedIds) => {
        try {
            await api.patch(`/classes/${classId}/cohorts`, {
                group_years_ids: selectedIds
            });
            refetchClass();
            setIsCohortModalOpen(false);
            showSuccess('Kohort berhasil diperbarui!');
        } catch (err) {
            showError('Kesalahan', err.response?.data?.message || 'Gagal memperbarui kohort.');
        }
    };

    const students = useMemo(() => {
        if (!cls?.group_years) return [];
        const allStudents = [];
        cls.group_years.forEach(gy => {
            if (gy.student_groups) {
                gy.student_groups.forEach(sg => {
                    const st = sg.student;
                    if (st) {
                        if (!allStudents.find(s => s.id === st.id)) {
                            allStudents.push({
                                id: st.id,
                                name: st.full_name,
                                avatarUrl: st.picture || null,
                                initials: st.full_name ? st.full_name.substring(0, 2).toUpperCase() : 'NA'
                            });
                        }
                    }
                });
            }
        });
        return allStudents;
    }, [cls]);

    if (loading) {
        return (
            <DashboardTemplate activeTab="Classes" title="Memuat..." viewLabel="Tampilan Admin" showBack={true} onBack={handleBack}>
                <div className="w-full flex justify-center py-12 text-on-surface-variant">Memuat detail kelas...</div>
            </DashboardTemplate>
        );
    }

    if (!cls) {
        return (
            <DashboardTemplate activeTab="Classes" title="Tidak Ditemukan" viewLabel="Tampilan Admin" showBack={true} onBack={handleBack}>
                <div className="w-full flex justify-center py-12 text-error">Kelas tidak ditemukan.</div>
            </DashboardTemplate>
        );
    }

    const subjectName = cls.subject?.name || cls.subject?.subject_name || 'Mata Pelajaran Tidak Diketahui';
    const teacherName = cls.teacher?.full_name || 'Belum ditugaskan';
    const groupName = cls.group_years && cls.group_years.length > 0
        ? cls.group_years.map(gy => gy.group?.name ? gy.group.name : 'Tidak diketahui').join(', ')
        : 'Grup Tidak Diketahui';
    const yearName = cls.group_years?.[0]?.school_year?.name || cls.school_year?.name || 'Tahun Tidak Diketahui';
    const scheduleStr = cls.day_schedule !== null && cls.time_schedule ? `${days[cls.day_schedule]} • ${cls.time_schedule.substring(0, 5)}` : 'Belum diatur';
    const isComplete = cls.group_years && cls.group_years.length > 0 && cls.day_schedule !== null && cls.time_schedule;
    const title = `${subjectName} — ${teacherName}`;

    // Hero title info card
    const headerSection = (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero details */}
            <div className="flex flex-col gap-2">
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-background font-extrabold tracking-tight">
                    {title}
                </h2>
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-md text-label-md font-bold">
                        Tahun Akademik {yearName}
                    </span>
                    {isComplete ? (
                        <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md flex items-center gap-1 font-bold">
                            <Icon name="check_circle" className="text-[16px] fill-icon" style={{ fontVariationSettings: "'FILL' 1" }} />
                            Terkonfigurasi Penuh
                        </span>
                    ) : (
                        <span className="px-3 py-1 rounded-full bg-error-container text-on-error-container font-label-md text-label-md flex items-center gap-1 font-bold">
                            <Icon name="error" className="text-[16px] fill-icon" style={{ fontVariationSettings: "'FILL' 1" }} />
                            Pengaturan Tidak Lengkap
                        </span>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Head title={`Konfigurasi Kelas - ${title}`} />

            <DashboardTemplate
                activeTab="Classes"
                title="Konfigurasi Kelas"
                viewLabel="Tampilan Admin"
                showBack={true}
                onBack={handleBack}
                headerSection={headerSection}
            >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
                    {/* Left Column: Summary and Group Card */}
                    <div className="md:col-span-7 flex flex-col gap-gutter">
                        <ClassSummaryCard
                            subject={subjectName}
                            teacher={teacherName}
                            schedule={scheduleStr}
                            academicYear={yearName}
                            onEditScheduleClick={handleEditScheduleClick}
                        />

                        <LinkedCohortCard
                            cohortName={groupName}
                            activeStudentsCount={students.length}
                            onChangeGroupClick={() => setIsCohortModalOpen(true)}
                            onCohortClick={() => handleActionClick('Lihat Detail Grup Siswa')}
                        />
                    </div>

                    {/* Right Column: Students Preview Box */}
                    <div className="md:col-span-5">
                        <StudentsAccessCard
                            students={students}
                            onViewAllClick={() => handleActionClick('Lihat Semua Siswa yang Memiliki Akses')}
                            onStudentClick={(s) => handleActionClick(`Lihat detail Profil Siswa untuk ${s.name}`)}
                        />
                    </div>
                </div>

                {/* Danger Zone */}
                <section className="mt-12 w-full animate-in fade-in duration-700 delay-300">
                    <h3 className="font-title-md text-title-md text-error font-bold mb-4">Zona Bahaya</h3>
                    <div className="border border-error/30 bg-error-container/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
                        <div className="flex-1">
                            <h4 className="font-label-lg text-label-lg text-on-surface font-bold flex items-center gap-2">
                                <Icon name="warning" className="text-error text-[20px]" />
                                Hapus kelas ini
                            </h4>
                            <p className="text-body-md text-on-surface-variant mt-2 max-w-3xl leading-relaxed">
                                Setelah Anda menghapus kelas, tindakan ini tidak dapat dibatalkan. Semua tautan siswa, kohort, jadwal, dan konfigurasi terkait akan dihapus secara permanen dari basis data. Harap pastikan.
                            </p>
                        </div>
                        <button
                            onClick={handleDeleteClass}
                            className="shrink-0 w-full md:w-auto px-6 py-3 rounded-xl bg-error text-on-error font-label-md text-label-md hover:bg-[#B3261E] transition-colors active:scale-95 flex justify-center items-center gap-2 font-bold shadow-sm"
                            type="button"
                        >
                            <Icon name="delete_forever" className="text-[20px]" />
                            <span>Hapus Kelas</span>
                        </button>
                    </div>
                </section>
            </DashboardTemplate>

            <ClassScheduleModal
                show={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                classId={classId}
                currentDay={cls?.day_schedule}
                currentTime={cls?.time_schedule}
                onSuccess={() => {
                    setIsScheduleModalOpen(false);
                    refetchClass();
                }}
            />

            <GroupYearSelectionModal
                show={isCohortModalOpen}
                onClose={() => setIsCohortModalOpen(false)}
                onApply={handleCohortSubmit}
                groupYears={groupYears}
                initialSelected={cls?.group_years?.map(gy => gy.id) || []}
            />
        </>
    );
}
