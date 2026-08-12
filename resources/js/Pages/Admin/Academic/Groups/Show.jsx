import React, { useMemo, useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Badge from '@/Components/shared/ui/Badge';
import Icon from '@/Components/shared/ui/Icon';
import GroupStats from '@/Components/features/academic/GroupStats';
import StudentTable from '@/Components/features/academic/StudentTable';
import StudentModal from '@/Components/features/academic/modals/StudentModal';
import useApiGet from '@/hooks/useApiGet';
import api from '@/utils/api';
import { showSuccess, showError, showInfo, confirmDelete } from '@/utils/swal';

export default function Show({ groupId }) {
    const { data, loading, refetch } = useApiGet(`/groups/${groupId}`);
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

    const handleBack = () => {
        router.visit('/admin/academic');
    };

    const handleActionClick = (actionName) => {
        if (actionName === 'Tambah Siswa') {
            setIsStudentModalOpen(true);
        } else {
            showInfo('Tindakan Dimulai', `Alur ${actionName}...`);
        }
    };

    const students = useMemo(() => {
        if (!data?.students) return [];
        return data.students.map(s => ({
            id: s.id,
            name: s.full_name,
            email: s.email
        }));
    }, [data]);

    const handleRemoveStudent = async (studentId) => {
        const confirmed = await confirmDelete('Hapus Siswa?', 'Apakah Anda yakin ingin menghapus siswa ini dari grup?');
        if (confirmed) {
            try {
                await api.delete(`/groups/${groupId}/students/${studentId}`, {
                    data: { year_id: data?.group_year?.year_id }
                });
                showSuccess('Siswa berhasil dihapus.');
                refetch();
            } catch (err) {
                showError('Kesalahan', err.response?.data?.message || 'Gagal menghapus siswa.');
            }
        }
    };

    if (loading) {
        return (
            <DashboardTemplate activeTab="Academic" title="Memuat..." viewLabel="Tampilan Admin" showBack={true} onBack={handleBack}>
                <div className="w-full flex justify-center py-12 text-on-surface-variant">Memuat detail grup...</div>
            </DashboardTemplate>
        );
    }

    if (!data || !data.group) {
        return (
            <DashboardTemplate activeTab="Academic" title="Tidak Ditemukan" viewLabel="Tampilan Admin" showBack={true} onBack={handleBack}>
                <div className="w-full flex justify-center py-12 text-error">Grup tidak ditemukan.</div>
            </DashboardTemplate>
        );
    }

    const group = data.group;
    const groupYear = data.group_year;
    const groupDisplay = group.name;

    // Header section
    const headerSection = (
        <section className="mb-stack-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Badge>{groupYear?.grade || 'Tidak Ada Kelas'}</Badge>
                        <span className="text-on-surface-variant text-sm font-medium">Tahun Akademik</span>
                    </div>
                    <h2 className="font-headline-lg text-headline-lg font-extrabold text-on-surface tracking-tight">
                        {groupDisplay} {groupYear?.grade ? `- Kelas ${groupYear.grade}` : ''}
                    </h2>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => handleActionClick('Tambah Siswa')} className="bg-primary hover:bg-primary-container hover:text-on-primary-container text-on-primary px-6 py-3 rounded-xl font-label-md transition-all flex items-center gap-2 shadow-sm" type="button">
                        <Icon name="person_add" className="text-sm" />
                        Tambah Siswa
                    </button>
                    <button onClick={() => handleActionClick('Impor CSV')} className="bg-surface-container-highest text-on-surface-variant hover:bg-surface-dim px-6 py-3 rounded-xl font-label-md transition-all flex items-center gap-2" type="button">
                        <Icon name="upload_file" className="text-sm" />
                        Impor CSV
                    </button>
                </div>
            </div>
        </section>
    );

    return (
        <>
            <Head title={`Grup Akademik ${groupDisplay}`} />
            
            <DashboardTemplate
                activeTab="Academic"
                title="Detail Grup"
                viewLabel="Tampilan Admin"
                showBack={true}
                onBack={handleBack}
                headerSection={headerSection}
                statsSection={<GroupStats totalStudents={data.student_count} unlinkedStudents="--" progressPercent={0} assignedCount={0} totalCapacity={0} />}
            >
                <StudentTable initialStudents={students} onUnlink={handleRemoveStudent} />
            </DashboardTemplate>

            <StudentModal 
                show={isStudentModalOpen}
                onClose={() => setIsStudentModalOpen(false)}
                onSuccess={() => {
                    setIsStudentModalOpen(false);
                    refetch();
                }}
                groupId={groupId}
                yearId={groupYear?.year_id}
            />
        </>
    );
}
