import React, { useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import LinkedTeachersBox from '@/Components/features/academic/LinkedTeachersBox';
import SubjectStatsBox from '@/Components/features/academic/SubjectStatsBox';
import SubjectClassCard from '@/Components/features/academic/SubjectClassCard';
import TeacherModal from '@/Components/features/academic/modals/TeacherModal';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';
import api from '@/utils/api';
import { showSuccess, showError, showInfo, confirmDelete } from '@/utils/swal';

const previewImageUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCbqlx1v1t2GV9BBmKKmVSMMU4KpSOUdKake4dHr9dWoiVWFh-q0En3iYsIjcoOIOXzP2KoEh39sgSwXoqTxMx_G0cQWQG40ZhkyO20hr7F58uUIu5_FjO28NcyP3B-zZesO2A4fTja7Y-F-9rLAmwe5Ie1ff6Yjd3JLHWQST6ZlKHclHr_jHu7RqG5Kn4UtlOqGt8h2Q_RgTaZ6xhlc7OA2I7pQtNEdhlBbPcKs9wwXM_yp9zx5BPks3Bwsz6S7kJQszJ6sDPinM';

export default function Show({ subjectId }) {
    const { data: subject, loading, refetch } = useApiGet(`/subjects/${subjectId}`);
    const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);

    const handleBack = () => {
        router.visit('/admin/academic');
    };

    const handleActionClick = (actionName) => {
        if (actionName === 'Tautkan Guru') {
            setIsTeacherModalOpen(true);
        } else {
            showInfo('Tindakan Dimulai', `Alur ${actionName}...`);
        }
    };

    const handleUnlinkTeacher = async (teacher) => {
        const confirmed = await confirmDelete('Putuskan Tautan Guru?', `Apakah Anda yakin ingin memutuskan tautan ${teacher.name}?`);
        if (confirmed) {
            try {
                await api.delete(`/subjects/${subjectId}/teachers/${teacher.id}`);
                showSuccess('Tautan guru berhasil diputuskan.');
                refetch();
            } catch (err) {
                showError('Kesalahan', err.response?.data?.message || 'Gagal memutuskan tautan guru.');
            }
        }
    };

    const handleDeleteSubject = async () => {
        const confirmed = await confirmDelete('Hapus Mata Pelajaran?', 'Ini akan menghapus mata pelajaran ini secara permanen.');
        if (confirmed) {
            try {
                await api.delete(`/subjects/${subjectId}`);
                showSuccess('Mata Pelajaran berhasil dihapus.');
                router.visit('/admin/academic');
            } catch (err) {
                showError('Kesalahan', err.response?.data?.message || 'Gagal menghapus mata pelajaran.');
            }
        }
    };

    const teachers = useMemo(() => {
        if (!subject?.subject_teachers) return [];
        return subject.subject_teachers.map(st => {
            const t = st.teacher;
            return {
                id: t.id,
                name: t.full_name,
                email: t.email,
                initials: t.full_name ? t.full_name.substring(0, 2).toUpperCase() : 'NA'
            };
        });
    }, [subject]);

    const activeClasses = useMemo(() => {
        if (!subject?.classes) return [];
        return subject.classes.map(c => {
            const groupName = c.group_years && c.group_years.length > 0 
                ? c.group_years.map(gy => gy.group?.name ? gy.group.name : 'Tidak diketahui').join(', ') 
                : 'Grup Tidak Diketahui';
            const yearName = c.group_years?.[0]?.school_year?.name || c.school_year?.name || 'Tahun Tidak Diketahui';
            return {
                group: groupName,
                teacher: c.teacher?.full_name || 'Belum ditugaskan',
                academicYear: yearName
            };
        });
    }, [subject]);

    const statsData = useMemo(() => {
        return [
            { label: 'Guru yang Ditautkan', value: teachers.length.toString() },
            { label: 'Kelas Aktif', value: activeClasses.length.toString() }
        ];
    }, [teachers, activeClasses]);

    if (loading) {
        return (
            <DashboardTemplate activeTab="Academic" title="Memuat..." viewLabel="Tampilan Admin" showBack={true} onBack={handleBack}>
                <div className="w-full flex justify-center py-12 text-on-surface-variant">Memuat detail mata pelajaran...</div>
            </DashboardTemplate>
        );
    }

    if (!subject) {
        return (
            <DashboardTemplate activeTab="Academic" title="Tidak Ditemukan" viewLabel="Tampilan Admin" showBack={true} onBack={handleBack}>
                <div className="w-full flex justify-center py-12 text-error">Mata pelajaran tidak ditemukan.</div>
            </DashboardTemplate>
        );
    }

    const subjectDisplay = subject.subject_name || 'Mata Pelajaran';
    const canDelete = activeClasses.length === 0 && teachers.length === 0;

    return (
        <>
            <Head title={`Detail Mata Pelajaran - ${subjectDisplay}`} />

            <DashboardTemplate
                activeTab="Academic"
                title="Detail Mata Pelajaran"
                viewLabel="Tampilan Admin"
                showBack={true}
                onBack={handleBack}
            >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-stack-lg">
                    {/* Left Column: Primary Content */}
                    <div className="md:col-span-8 flex flex-col gap-stack-lg">
                        
                        {/* Subject Header Card */}
                        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm overflow-hidden relative hover:shadow-md transition-shadow duration-300">
                            {/* Decorative background logo */}
                            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
                                <Icon
                                    name="urology"
                                    className="text-[120px] translate-x-8 -translate-y-8"
                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                />
                            </div>
                            
                            <div className="relative z-10">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-extrabold tracking-tight">
                                        {subjectDisplay}
                                    </h2>
                                    <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-label-sm font-label-sm rounded-full font-bold">
                                        Mata Pelajaran
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-on-surface-variant mt-6">
                                    <Icon name="calendar_today" className="text-[18px]" />
                                    <span className="font-label-md text-label-md font-medium">
                                        Dibuat pada: {new Date(subject.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* Linked Teachers List Section */}
                        <LinkedTeachersBox
                            teachers={teachers}
                            onLinkTeacherClick={() => handleActionClick('Tautkan Guru')}
                            onUnlinkTeacher={handleUnlinkTeacher}
                        />

                        {/* Active Classes Card */}
                        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                            <div className="p-6 border-b border-outline-variant">
                                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                                    Kelas Aktif
                                </h3>
                            </div>
                            <div className="p-6">
                                {activeClasses.length > 0 ? (
                                    <div className="flex flex-col gap-4">
                                        {activeClasses.map((cls, idx) => (
                                            <SubjectClassCard
                                                key={idx}
                                                group={cls.group}
                                                teacher={cls.teacher}
                                                academicYear={cls.academicYear}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-on-surface-variant font-body-md">Tidak ada kelas aktif untuk mata pelajaran ini.</p>
                                )}
                            </div>
                        </section>

                        {/* Destructive Actions Zone */}
                        <div className="mt-8 pt-8 border-t border-outline-variant">
                            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl border ${canDelete ? 'bg-error/10 border-error' : 'bg-error/5 border-error/10'}`}>
                                <div className="flex flex-col">
                                    <span className="font-label-md text-label-md text-error font-bold">
                                        Zona Bahaya
                                    </span>
                                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                                        {canDelete 
                                            ? "Mata pelajaran ini tidak ditautkan ke kelas atau guru mana pun dan dapat dihapus."
                                            : "Penghapusan dibatasi selama kelas atau guru aktif ditautkan ke mata pelajaran ini."}
                                    </p>
                                </div>
                                <button
                                    onClick={handleDeleteSubject}
                                    disabled={!canDelete}
                                    className={`px-6 py-2.5 rounded-lg font-label-md text-label-md flex items-center gap-2 transition-all ${
                                        canDelete 
                                            ? 'bg-error text-on-error hover:bg-error/90 active:scale-95' 
                                            : 'bg-outline-variant text-on-surface-variant cursor-not-allowed opacity-60'
                                    }`}
                                    type="button"
                                >
                                    <Icon name="delete" className="text-[18px]" />
                                    Hapus Mata Pelajaran
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Sidebar Stats */}
                    <div className="md:col-span-4">
                        <SubjectStatsBox
                            subjectName={subjectDisplay}
                            stats={statsData}
                            previewImageUrl={previewImageUrl}
                        />
                    </div>
                </div>
            </DashboardTemplate>

            <TeacherModal
                show={isTeacherModalOpen}
                onClose={() => setIsTeacherModalOpen(false)}
                onSuccess={() => {
                    setIsTeacherModalOpen(false);
                    refetch();
                }}
                subjectId={subjectId}
                linkedTeacherIds={teachers.map(t => t.id)}
            />
        </>
    );
}
