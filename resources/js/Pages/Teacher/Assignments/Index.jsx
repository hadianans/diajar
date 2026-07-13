import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import AssignmentFilterTabs from '@/Components/features/teacher-assignments/AssignmentFilterTabs';
import AssignmentChapterChips from '@/Components/features/teacher-assignments/AssignmentChapterChips';
import AssignmentListCard from '@/Components/features/teacher-assignments/AssignmentListCard';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';
import api from '@/utils/api';
import { showError, confirmDelete } from '@/utils/swal';

export default function Index() {
    const { data: assignments, loading, refetch } = useApiGet('/assignments');
    const { data: chapters } = useApiGet('/chapters');

    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedChapterId, setSelectedChapterId] = useState(null);

    // Derive filter counts from the raw data
    const counts = useMemo(() => {
        if (!assignments) return {};
        return {
            all: assignments.length,
            needsGrading: assignments.filter(a => (a.pending_submissions || 0) > 0).length,
            graded: assignments.filter(a => (a.pending_submissions || 0) === 0 && (a.graded_submissions || 0) > 0).length,
            closed: assignments.filter(a => a.status === 'closed').length,
        };
    }, [assignments]);

    // Filter assignments based on active tab and selected chapter
    const filtered = useMemo(() => {
        if (!assignments) return [];
        let result = [...assignments];

        // Filter by status tab
        if (activeFilter === 'needs_grading') {
            result = result.filter(a => (a.pending_submissions || 0) > 0);
        } else if (activeFilter === 'graded') {
            result = result.filter(a => (a.pending_submissions || 0) === 0 && (a.graded_submissions || 0) > 0);
        } else if (activeFilter === 'closed') {
            result = result.filter(a => a.status === 'closed');
        }

        // Filter by chapter
        if (selectedChapterId) {
            result = result.filter(a => a.chapter_id === selectedChapterId);
        }

        return result;
    }, [assignments, activeFilter, selectedChapterId]);

    const handleDelete = async (id) => {
        const confirmed = await confirmDelete('Delete Assignment?', 'This will permanently remove this assignment.');
        if (!confirmed) return;
        try {
            await api.delete(`/assignments/${id}`);
            refetch();
        } catch (err) {
            showError('Error', err.response?.data?.message || 'Error deleting assignment');
        }
    };

    const handleCreate = () => {
        router.visit(route('teacher.assignments.create'));
    };

    const handleEdit = (id) => {
        router.visit(route('teacher.assignments.edit', { assignmentId: id }));
    };

    const headerSection = (
        <div className="flex justify-between items-center w-full">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Overview</h2>
            <button
                onClick={handleCreate}
                className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-label-md text-label-md shadow-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
            >
                <Icon name="add" className="text-[18px]" />
                Create Assignment
            </button>
        </div>
    );

    return (
        <DashboardTemplate role="teacher" activeTab="assignments" title="Assignments" headerSection={headerSection}>
            <Head title="Assignments | Diajar LMS" />

            <AssignmentFilterTabs
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                counts={counts}
            />
            <AssignmentChapterChips
                chapters={chapters || []}
                selectedChapterId={selectedChapterId}
                onSelect={setSelectedChapterId}
            />

            {/* Sort Control */}
            <div className="flex justify-between items-center py-1">
                <p className="text-on-surface-variant font-label-sm text-label-sm">
                    {filtered.length} assignment{filtered.length !== 1 ? 's' : ''}
                </p>
                <button className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm hover:text-primary transition-colors">
                    <span>Sort by: Pending</span>
                    <Icon name="expand_more" className="text-[18px]" />
                </button>
            </div>

            {/* Assignment Cards List */}
            {loading ? (
                <div className="text-center py-12 text-on-surface-variant">Loading assignments...</div>
            ) : (
                <div className="grid lg:grid-cols-2 gap-4 pb-24">
                    {filtered.length > 0 ? (
                        filtered.map(assignment => (
                            <AssignmentListCard
                                key={assignment.id}
                                id={assignment.id.toString()}
                                title={assignment.title}
                                chapter={assignment.chapter?.name || "Uncategorized"}
                                statusText={assignment.status === 'closed' ? 'Closed' : `${assignment.pending_submissions || 0} Pending`}
                                statusIcon={assignment.status === 'closed' ? 'lock' : (assignment.pending_submissions > 0 ? "priority_high" : "check_circle")}
                                statusColorClass={
                                    assignment.status === 'closed' ? 'bg-surface-container-high text-on-surface-variant' :
                                        (assignment.pending_submissions > 0 ? "bg-error-container text-on-error-container" : "bg-primary-container text-on-primary-container")
                                }
                                submissions={assignment.total_submissions || 0}
                                totalStudents={30}
                                graded={assignment.graded_submissions || 0}
                                average={assignment.avg_grade ? `${assignment.avg_grade}/100` : "-"}
                                initials={[]}
                                onDelete={() => handleDelete(assignment.id)}
                                onEdit={() => handleEdit(assignment.id)}
                            />
                        ))
                    ) : (
                        <div className="p-8 text-center text-on-surface-variant bg-surface-container rounded-2xl">
                            {activeFilter === 'all' ? 'You have no active assignments.' : `No assignments match the "${activeFilter.replace('_', ' ')}" filter.`}
                        </div>
                    )}
                </div>
            )}

        </DashboardTemplate>
    );
}
