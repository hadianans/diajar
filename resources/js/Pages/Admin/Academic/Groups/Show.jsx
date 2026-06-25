import React, { useMemo, useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Badge from '@/Components/shared/ui/Badge';
import Icon from '@/Components/shared/ui/Icon';
import GroupStats from '@/Components/features/academic/GroupStats';
import StudentTable from '@/Components/features/academic/StudentTable';
import useApiGet from '@/hooks/useApiGet';
import api from '@/utils/api';

export default function Show({ groupId }) {
    const { data, loading, refetch } = useApiGet(`/groups/${groupId}`);

    const handleBack = () => {
        router.visit('/admin/academic');
    };

    const handleActionClick = (actionName) => {
        alert(`Initiated action: ${actionName} flow...`);
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
        if (confirm('Are you sure you want to remove this student from the group?')) {
            try {
                await api.delete(`/groups/${groupId}/students/${studentId}`);
                alert('Student removed successfully.');
                refetch();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to remove student.');
            }
        }
    };

    if (loading) {
        return (
            <DashboardTemplate activeTab="Academic" title="Loading..." viewLabel="Admin View" showBack={true} onBack={handleBack}>
                <div className="w-full flex justify-center py-12 text-on-surface-variant">Loading group details...</div>
            </DashboardTemplate>
        );
    }

    if (!data || !data.group) {
        return (
            <DashboardTemplate activeTab="Academic" title="Not Found" viewLabel="Admin View" showBack={true} onBack={handleBack}>
                <div className="w-full flex justify-center py-12 text-error">Group not found.</div>
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
                        <Badge>{groupYear?.grade || 'No Grade'}</Badge>
                        <span className="text-on-surface-variant text-sm font-medium">Academic Year</span>
                    </div>
                    <h2 className="font-headline-lg text-headline-lg font-extrabold text-on-surface tracking-tight">
                        {groupDisplay} {groupYear?.grade ? `- ${groupYear.grade}` : ''}
                    </h2>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => handleActionClick('Add Students')} className="bg-primary hover:bg-primary-container hover:text-on-primary-container text-on-primary px-6 py-3 rounded-xl font-label-md transition-all flex items-center gap-2 shadow-sm" type="button">
                        <Icon name="person_add" className="text-sm" />
                        Add Students
                    </button>
                    <button onClick={() => handleActionClick('Import CSV')} className="bg-surface-container-highest text-on-surface-variant hover:bg-surface-dim px-6 py-3 rounded-xl font-label-md transition-all flex items-center gap-2" type="button">
                        <Icon name="upload_file" className="text-sm" />
                        Import CSV
                    </button>
                </div>
            </div>
        </section>
    );

    return (
        <>
            <Head title={`Academic Group ${groupDisplay}`} />
            
            <DashboardTemplate
                activeTab="Academic"
                title="Group Details"
                viewLabel="Admin View"
                showBack={true}
                onBack={handleBack}
                headerSection={headerSection}
                statsSection={<GroupStats totalStudents={data.student_count} unlinkedStudents="--" progressPercent={0} assignedCount={0} totalCapacity={0} />}
            >
                <StudentTable initialStudents={students} />
            </DashboardTemplate>
        </>
    );
}
