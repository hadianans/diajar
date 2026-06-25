import React from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import ChapterHeader from '@/Components/features/teacher-chapters/ChapterHeader';
import CurriculumAccordion from '@/Components/features/teacher-chapters/CurriculumAccordion';
import LessonItem from '@/Components/features/teacher-chapters/LessonItem';
import AssignmentSummaryCard from '@/Components/features/teacher-chapters/AssignmentSummaryCard';
import AssessmentSummaryCard from '@/Components/features/teacher-chapters/AssessmentSummaryCard';
import FloatingActionBar from '@/Components/features/teacher-chapters/FloatingActionBar';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';

export default function Show({ chapterId }) {
    const { data: chapter, loading } = useApiGet(`/chapters/${chapterId}`);

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
                <button 
                    onClick={() => router.visit(`/teacher/chapters/${chapterId}/edit`)}
                    className="transition-colors duration-200 active:scale-95 text-primary hover:bg-surface-container-high p-2 rounded-full"
                >
                    <Icon name="edit" />
                </button>
            )}
        >
            <Head title={`${chapter.name} - Chapter Management`} />

            {/* Content Tree Section */}
            <section className="mb-stack-lg">
                <div className="flex items-center justify-between mb-stack-md mt-4">
                    <h3 className="font-headline-md text-headline-md text-on-surface">Curriculum Content</h3>
                </div>

                <div className="space-y-4">
                    {/* Uncategorized Materials */}
                    {chapter.materials && chapter.materials.length > 0 && (
                        <CurriculumAccordion title="General Materials" materialsCount={chapter.materials.length} defaultOpen={true}>
                            {chapter.materials.map(mat => (
                                <LessonItem 
                                    key={mat.id} 
                                    chapterId={chapterId} 
                                    lessonId={mat.id} 
                                    title={mat.title} 
                                    type={mat.type} 
                                />
                            ))}
                        </CurriculumAccordion>
                    )}

                    {/* Subchapters */}
                    {chapter.subchapters && chapter.subchapters.map(sub => (
                        <CurriculumAccordion key={sub.id} title={sub.name} materialsCount={sub.materials?.length || 0} defaultOpen={true}>
                            {sub.materials?.map(mat => (
                                <LessonItem 
                                    key={mat.id} 
                                    chapterId={chapterId} 
                                    lessonId={mat.id} 
                                    title={mat.title} 
                                    type={mat.type} 
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

            <FloatingActionBar
                onAddSubchapter={() => console.log('add subchapter')}
                onAddMaterial={() => router.visit(`/teacher/chapters/${chapterId}/lessons/create`)}
                onAddTask={() => console.log('add task')}
            />

        </DashboardTemplate>
    );
}
