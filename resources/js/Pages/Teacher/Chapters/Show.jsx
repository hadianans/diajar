import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import ChapterHeader from '@/Components/features/teacher-chapters/ChapterHeader';
import CurriculumAccordion from '@/Components/features/teacher-chapters/CurriculumAccordion';
import LessonItem from '@/Components/features/teacher-chapters/LessonItem';
import AssignmentSummaryCard from '@/Components/features/teacher-chapters/AssignmentSummaryCard';
import AssessmentSummaryCard from '@/Components/features/teacher-chapters/AssessmentSummaryCard';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';
import api from '@/utils/api';
import ChapterModal from '@/Components/features/teacher-chapters/modals/ChapterModal';
import SubchapterModal from '@/Components/features/teacher-chapters/modals/SubchapterModal';

export default function Show({ chapterId }) {
    const { data: chapter, loading, refetch, setData } = useApiGet(`/chapters/${chapterId}`);
    const [showEditModal, setShowEditModal] = useState(false);

    // Subchapter states
    const [showSubModal, setShowSubModal] = useState(false);
    const [editingSubchapter, setEditingSubchapter] = useState(null);

    const handleDeleteChapter = async () => {
        if (!confirm('Are you sure you want to delete this chapter?')) return;
        try {
            await api.delete(`/chapters/${chapterId}`);
            router.visit('/teacher/chapters');
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting chapter');
        }
    };

    const handleAddSubchapter = () => {
        setEditingSubchapter(null);
        setShowSubModal(true);
    };

    const handleEditSubchapter = (sub) => {
        setEditingSubchapter(sub);
        setShowSubModal(true);
    };

    const handleDeleteSubchapter = async (subId) => {
        if (!confirm('Are you sure you want to delete this subchapter?')) return;
        try {
            await api.delete(`/chapters/${chapterId}/subchapters/${subId}`);
            refetch();
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting subchapter');
        }
    };

    const handleEditMaterial = (lessonId) => {
        router.visit(route('teacher.chapters.lessons.edit', { lessonId }));
    };

    const handleDeleteMaterial = async (lessonId) => {
        if (!confirm('Are you sure you want to delete this material?')) return;
        try {
            await api.delete(`/materials/${lessonId}`);
            refetch();
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting material');
        }
    };

    const handleReorderSubchapter = async (subchaptersList, index, direction) => {
        if ((direction === -1 && index === 0) || (direction === 1 && index === subchaptersList.length - 1)) return;
        const newOrder = [...subchaptersList];
        const temp = newOrder[index];
        newOrder[index] = newOrder[index + direction];
        newOrder[index + direction] = temp;
        
        // Optimistic UI update
        setData({ ...chapter, subchapters: newOrder });

        const orders = newOrder.map((item, idx) => ({ id: item.id, order: idx + 1 }));
        try {
            await api.patch(`/chapters/${chapterId}/subchapters/reorder`, { orders });
            refetch();
        } catch (err) {
            console.error('Failed to reorder subchapters', err);
            alert(err.response?.data?.message || 'Failed to reorder subchapters');
            refetch(); // Revert on failure
        }
    };

    const handleReorderMaterial = async (materialsList, index, direction, subchapterId = null) => {
        if ((direction === -1 && index === 0) || (direction === 1 && index === materialsList.length - 1)) return;
        const newOrder = [...materialsList];
        const temp = newOrder[index];
        newOrder[index] = newOrder[index + direction];
        newOrder[index + direction] = temp;

        // Optimistic UI update
        if (subchapterId) {
            const newSubchapters = chapter.subchapters.map(sub => 
                sub.id === subchapterId ? { ...sub, materials: newOrder } : sub
            );
            setData({ ...chapter, subchapters: newSubchapters });
        } else {
            setData({ ...chapter, materials: newOrder });
        }

        const orders = newOrder.map((item, idx) => ({ id: item.id, order: idx + 1 }));
        try {
            await api.patch(`/materials/reorder`, { orders });
            refetch();
        } catch (err) {
            console.error('Failed to reorder materials', err);
            alert(err.response?.data?.message || 'Failed to reorder materials');
            refetch(); // Revert on failure
        }
    };

    if (loading) {
        return (
            <DashboardTemplate role="teacher" title="Loading..." showBack={true} onBack={() => window.history.back()}>
                <div className="text-center py-12 text-on-surface-variant">Loading chapter...</div>
            </DashboardTemplate>
        );
    }

    if (!chapter) {
        return (
            <DashboardTemplate role="teacher" title="Not Found" showBack={true} onBack={() => window.history.back()}>
                <div className="text-center py-12 text-on-surface-variant">Chapter not found.</div>
            </DashboardTemplate>
        );
    }

    const headerSection = (
        <ChapterHeader
            title={chapter.name}
            description={chapter.description || "No description provided."}
            coverImage={chapter.cover_image || "https://lh3.googleusercontent.com/aida-public/AB6AXuCVZh3r-NE7MIgc4V1wqC0qiWpXgd3KoV67K2XGipW6aTqBpI6dwLKCiwPiYlsqlpWNbJFUxmaHcvcyY4fUPrvlvNkq-UdkBF-NglJtffaeIRJRwsJbZuzkjDW4URD2Ze5CVUGVGeb-_9L6N_eQ3wQXtx0sWjRnaTxkRJkys7P2wGKoTeaxTU80Xla4Mziu7e8t76C96YgIFGX0H2grNxtTsMLKPNsQfr-pxXHNeIZjeFSBfCODaCCSpAS8eI9pg0tbHpYpbbcm0ww"}
        />
    );

    return (
        <DashboardTemplate
            role="teacher"
            activeTab="chapters"
            title="Chapter Management"
            showBack={true}
            onBack={() => window.location.href = '/teacher/chapters'}
            headerSection={headerSection}
            actions={(
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowEditModal(true)}
                        className="transition-colors duration-200 active:scale-95 text-primary hover:bg-surface-container-high p-2 rounded-full"
                        title="Edit Chapter"
                    >
                        <Icon name="edit" />
                    </button>
                    <button
                        onClick={handleDeleteChapter}
                        className="transition-colors duration-200 active:scale-95 text-error hover:bg-error-container/20 p-2 rounded-full"
                        title="Delete Chapter"
                    >
                        <Icon name="delete" />
                    </button>
                </div>
            )}
        >
            <Head title={`${chapter.name} - Chapter Management`} />

            <ChapterModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSuccess={() => {
                    setShowEditModal(false);
                    refetch();
                }}
                initialData={chapter}
            />

            <SubchapterModal
                show={showSubModal}
                onClose={() => setShowSubModal(false)}
                onSuccess={() => {
                    setShowSubModal(false);
                    refetch();
                }}
                initialData={editingSubchapter}
                chapterId={chapterId}
            />

            {/* Content Tree Section */}
            <section className="mb-stack-lg">
                <div className="flex items-center justify-between mb-stack-md mt-4">
                    <h3 className="font-headline-md text-headline-md text-on-surface">Curriculum Content</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => router.visit(`/teacher/chapters/${chapterId}/lessons/create`)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-container text-on-primary-container rounded-lg font-label-md hover:bg-primary-container/80 transition-colors active:scale-95"
                        >
                            <Icon name="add_circle" className="text-[18px]" />
                            <span className="hidden sm:inline">Add Material</span>
                        </button>
                        <button
                            onClick={handleAddSubchapter}
                            className="flex items-center gap-2 px-4 py-2 bg-surface-container-high text-on-surface rounded-lg font-label-md hover:bg-surface-container-highest transition-colors active:scale-95"
                        >
                            <Icon name="create_new_folder" className="text-[18px]" />
                            <span className="hidden sm:inline">Add Subchapter</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Uncategorized Materials */}
                    {chapter.materials && chapter.materials.length > 0 && (
                        <CurriculumAccordion title="Chapter Introduction & Ungrouped Materials" materialsCount={chapter.materials.length} defaultOpen={true}>
                            {chapter.materials.map((mat, idx) => (
                                <LessonItem
                                    key={mat.id}
                                    chapterId={chapterId}
                                    lessonId={mat.id}
                                    title={mat.title}
                                    type={mat.file_type}
                                    onMoveUp={idx > 0 ? () => handleReorderMaterial(chapter.materials, idx, -1) : undefined}
                                    onMoveDown={idx < chapter.materials.length - 1 ? () => handleReorderMaterial(chapter.materials, idx, 1) : undefined}
                                    onEdit={() => handleEditMaterial(mat.id)}
                                    onDelete={() => handleDeleteMaterial(mat.id)}
                                />
                            ))}
                        </CurriculumAccordion>
                    )}

                    {/* Subchapters */}
                    {chapter.subchapters && chapter.subchapters.map((sub, sIdx) => (
                        <CurriculumAccordion
                            key={sub.id}
                            title={sub.name}
                            materialsCount={sub.materials?.length || 0}
                            defaultOpen={true}
                            onEdit={() => handleEditSubchapter(sub)}
                            onDelete={() => handleDeleteSubchapter(sub.id)}
                            onMoveUp={sIdx > 0 ? () => handleReorderSubchapter(chapter.subchapters, sIdx, -1) : undefined}
                            onMoveDown={sIdx < chapter.subchapters.length - 1 ? () => handleReorderSubchapter(chapter.subchapters, sIdx, 1) : undefined}
                            onAddMaterial={() => router.visit(`/teacher/chapters/${chapterId}/lessons/create?subchapter_id=${sub.id}`)}
                        >
                            {sub.materials?.map((mat, mIdx) => (
                                <LessonItem
                                    key={mat.id}
                                    chapterId={chapterId}
                                    lessonId={mat.id}
                                    title={mat.title}
                                    type={mat.file_type}
                                    onMoveUp={mIdx > 0 ? () => handleReorderMaterial(sub.materials, mIdx, -1, sub.id) : undefined}
                                    onMoveDown={mIdx < sub.materials.length - 1 ? () => handleReorderMaterial(sub.materials, mIdx, 1, sub.id) : undefined}
                                    onEdit={() => handleEditMaterial(mat.id)}
                                    onDelete={() => handleDeleteMaterial(mat.id)}
                                />
                            ))}
                        </CurriculumAccordion>
                    ))}

                    {(!chapter.materials?.length && !chapter.subchapters?.length) && (
                        <div className="p-6 bg-surface-container rounded-2xl text-center text-on-surface-variant">
                            No materials added to this chapter yet.
                        </div>
                    )}
                </div>
            </section>

            {/* Assignments & Assessments Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg pb-32">
                {/* Assignments Section */}
                <section>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-stack-md">Assignments</h3>
                    <div className="space-y-4">
                        {chapter.class_assignments && chapter.class_assignments.length > 0 ? (
                            chapter.class_assignments.map(assign => (
                                <AssignmentSummaryCard
                                    key={assign.id}
                                    title={assign.title}
                                    linkedMaterial="Linked assignment"
                                    submitted={assign.submissions_count || 0}
                                    totalStudents={30} // Mock total students as it's not per-class easily here
                                    submissionRate={Math.round(((assign.submissions_count || 0) / 30) * 100)}
                                    graded={0} // To be added later if needed
                                    gradedRate={0}
                                />
                            ))
                        ) : (
                            <div className="p-4 text-center text-sm text-on-surface-variant">No assignments linked to this chapter.</div>
                        )}
                        <button
                            onClick={() => router.visit('/teacher/assignments/create')}
                            className="w-full py-3 flex items-center justify-center gap-2 bg-primary/5 border border-primary/20 rounded-lg text-label-md font-label-md text-primary hover:bg-primary/10 transition-colors"
                        >
                            <Icon name="assignment_add" />
                            Add assignment
                        </button>
                    </div>
                </section>

                {/* Assessments Section */}
                <section>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-stack-md">Assessments</h3>
                    <div className="space-y-4">
                        {chapter.class_assessments && chapter.class_assessments.length > 0 ? (
                            chapter.class_assessments.map(assess => (
                                <AssessmentSummaryCard
                                    key={assess.id}
                                    title={assess.title}
                                    duration={assess.duration_minutes || 0}
                                    attempts={assess.attempts_count || 0}
                                    totalStudents={30}
                                    averageScore={0}
                                    studentInitials={[]}
                                />
                            ))
                        ) : (
                            <div className="p-4 text-center text-sm text-on-surface-variant">No assessments linked to this chapter.</div>
                        )}
                        <button
                            onClick={() => router.visit('/teacher/assessments/create')}
                            className="w-full py-3 flex items-center justify-center gap-2 bg-tertiary-container/5 border border-tertiary-container/20 rounded-lg text-label-md font-label-md text-tertiary hover:bg-tertiary-container/10 transition-colors"
                        >
                            <Icon name="post_add" />
                            Add assessment
                        </button>
                    </div>
                </section>
            </div>
        </DashboardTemplate>
    );
}
