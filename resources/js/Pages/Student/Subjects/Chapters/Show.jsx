import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import LessonItem from '@/Components/features/student-subjects/LessonItem';
import PlanModal from '@/Components/features/student-subjects/PlanModal';
import AssignmentCard from '@/Components/features/student-assignments/AssignmentCard';
import AssessmentCard from '@/Components/features/student-assessments/AssessmentCard';
import useApiGet from '@/hooks/useApiGet';

export default function Show({ subjectId, chapterId }) {
    const { data: subjectsData, loading: loadingSubjects } = useApiGet('/subjects');

    const classModel = useMemo(() => {
        if (!subjectsData) return null;
        return subjectsData.find(s => s.id == subjectId);
    }, [subjectsData, subjectId]);

    const actualSubjectId = classModel?.subject_id;
    const subjectTitle = classModel?.subject?.subject_name || classModel?.subject?.name || 'Subject';

    const { data: chaptersData, loading: loadingChapters } = useApiGet(actualSubjectId ? `/subjects/${actualSubjectId}/chapters` : null);
    
    const { data: assignmentsData, loading: loadingAssignments } = useApiGet(actualSubjectId ? `/assignments?subject_id=${actualSubjectId}` : null);
    const { data: assessmentsData, loading: loadingAssessments } = useApiGet(actualSubjectId ? `/assessments?subject_id=${actualSubjectId}` : null);

    const chapterDataInfo = useMemo(() => {
        if (!chaptersData) return null;
        return chaptersData.find(c => c.id == chapterId);
    }, [chaptersData, chapterId]);

    const { data: materialsData, loading: loadingMaterials } = useApiGet(
        actualSubjectId && chapterId ? `/subjects/${actualSubjectId}/chapters/${chapterId}/materials` : null
    );

    const subchapters = useMemo(() => {
        if (!materialsData) return [];
        const result = [];
        Object.entries(materialsData).forEach(([subId, mats]) => {
            if (mats.length === 0) return;

            const firstMat = mats[0];
            const subTitle = subId === 'root' ? 'General' : (firstMat.subchapter?.name || 'Lessons');
            const subOrder = subId === 'root' ? -1 : (firstMat.subchapter?.order || 999);

            result.push({
                id: subId,
                title: subTitle,
                order: subOrder,
                lessons: mats.map(m => ({
                    id: m.id,
                    title: m.title,
                    type: m.file_type === 'video' ? 'Video' : 'Reading',
                    fileUrl: m.file_url,
                    duration: m.duration || 'N/A',
                    tag: m.tags && m.tags.length > 0 ? m.tags[0].name : '',
                    status: m.is_completed ? 'completed' : 'pending',
                    isBookmarked: m.is_bookmarked,
                    originalId: m.id
                }))
            });
        });
        return result.sort((a, b) => a.order - b.order);
    }, [materialsData]);

    const [searchQuery, setSearchQuery] = useState('');
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [selectedItemForPlan, setSelectedItemForPlan] = useState(null);
    const [selectedItemTypeForPlan, setSelectedItemTypeForPlan] = useState('App\\Models\\Material');
    const [selectedExistingPlan, setSelectedExistingPlan] = useState(null);
    
    const getInitialTab = () => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('tab') || 'Materials';
        }
        return 'Materials';
    };
    const [activeTab, setActiveTab] = useState(getInitialTab);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (typeof window !== 'undefined') {
            const url = new URL(window.location);
            url.searchParams.set('tab', tab);
            window.history.replaceState({}, '', url);
        }
    };

    const { data: plansData, refetch: refetchPlans } = useApiGet(`/plans?chapter_id=${chapterId}`);

    const handlePlanClick = (id, title, type = 'App\\Models\\Material') => {
        setSelectedItemForPlan({ id, title });
        setSelectedItemTypeForPlan(type);

        let foundPlan = null;
        if (plansData) {
            foundPlan = Array.isArray(plansData) ? plansData.find(plan =>
                plan.planables?.some(p => p.planable_type === type && p.planable_id === id)
            ) : null;
        }

        setSelectedExistingPlan(foundPlan);
        setIsPlanModalOpen(true);
    };

    const chapterAssignments = useMemo(() => {
        if (!assignmentsData) return [];
        const list = Array.isArray(assignmentsData) ? assignmentsData : [];
        return list.filter(a => a.chapter_id === parseInt(chapterId) || a.chapter?.id === parseInt(chapterId));
    }, [assignmentsData, chapterId]);

    const chapterAssessments = useMemo(() => {
        if (!assessmentsData) return [];
        const list = Array.isArray(assessmentsData) ? assessmentsData : [];
        return list.filter(a => a.chapter_id === parseInt(chapterId) || a.chapter?.id === parseInt(chapterId));
    }, [assessmentsData, chapterId]);

    const loading = loadingSubjects || loadingChapters || loadingMaterials || loadingAssignments || loadingAssessments;

    if (loading) {
        return (
            <DashboardTemplate role="student" activeTab="Subject" title="Loading..." showBack={true} onBack={() => window.history.back()}>
                <div className="text-center py-12">Loading chapter materials...</div>
            </DashboardTemplate>
        );
    }

    if (!chapterDataInfo) {
        return (
            <DashboardTemplate role="student" activeTab="Subject" title="Not Found" showBack={true} onBack={() => window.history.back()}>
                <div className="text-center py-12">Chapter not found.</div>
            </DashboardTemplate>
        );
    }

    return (
        <DashboardTemplate
            activeTab="Subject"
            title={`Chapter ${chapterDataInfo.order || 1}: ${chapterDataInfo.name || chapterDataInfo.title}`}
            showBack={true}
            onBack={() => window.history.back()}
        >
            <Head title={`${chapterDataInfo.name || chapterDataInfo.title} - ${subjectTitle}`} />

            <div className="max-w-2xl mx-auto pb-8 mt-4">
                {/* Chapter Context */}
                <section className="mt-stack-md">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wider">
                            {subjectTitle}
                        </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                        {chapterDataInfo.description}
                    </p>
                </section>

                {/* Search & Controls */}
                <section className="mt-stack-lg space-y-4">
                    <div className="relative flex items-center">
                        <Icon name="search" className="absolute left-4 text-outline" />
                        <input
                            className="w-full h-12 pl-12 pr-4 bg-surface-container-low border-none rounded-xl font-body-md text-body-md focus:ring-2 focus:ring-primary focus:bg-surface transition-all shadow-sm"
                            placeholder="Search materials..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </section>

                {/* Tabs */}
                <div className="flex border-b border-outline-variant space-x-8 my-6">
                    {['Materials', 'Assignments', 'Assessments'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            className={`pb-4 font-label-lg text-label-lg transition-colors border-b-2 ${activeTab === tab
                                ? 'border-primary text-primary'
                                : 'border-transparent text-on-surface-variant hover:text-on-surface'
                                }`}
                        >
                            {tab}
                            {tab === 'Assignments' && chapterAssignments.length > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-primary-container text-on-primary-container rounded-full text-xs">
                                    {chapterAssignments.length}
                                </span>
                            )}
                            {tab === 'Assessments' && chapterAssessments.length > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-primary-container text-on-primary-container rounded-full text-xs">
                                    {chapterAssessments.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="mt-stack-lg space-y-10">
                    {activeTab === 'Materials' && (() => {
                        if (subchapters.length === 0) {
                            return <div className="text-center py-8 text-on-surface-variant bg-surface-container rounded-xl">No materials available for this chapter.</div>;
                        }

                        const visibleSubchapters = subchapters.map(sub => {
                            const filteredLessons = sub.lessons.filter(lesson =>
                                lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
                            );
                            return { ...sub, lessons: filteredLessons };
                        }).filter(sub => sub.lessons.length > 0);

                        if (visibleSubchapters.length === 0) {
                            return <div className="text-center py-8 text-on-surface-variant bg-surface-container rounded-xl">No materials match your search.</div>;
                        }

                        return visibleSubchapters.map((subchapter, subIdx) => (
                            <section key={`subchapter-${subchapter.id || subIdx}`}>
                                <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-md">{subchapter.title}</h2>
                                <div className="space-y-stack-sm">
                                    {subchapter.lessons.map((lesson, idx) => {
                                        const hasPlan = Array.isArray(plansData) && plansData.some(plan => 
                                            plan.planables?.some(p => p.planable_type === 'App\\Models\\Material' && p.planable_id === lesson.id)
                                        );
                                        return (
                                            <LessonItem
                                                key={`lesson-${lesson.id}-${idx}-${lesson.title.replace(/\s+/g, '-')}`}
                                                subjectId={subjectId}
                                                chapterId={chapterId}
                                                onPlanClick={handlePlanClick}
                                                hasPlan={hasPlan}
                                                {...lesson}
                                            />
                                        );
                                    })}
                                </div>
                            </section>
                        ));
                    })()}

                    {activeTab === 'Assignments' && (
                        chapterAssignments.length === 0 ? (
                            <div className="text-center py-8 text-on-surface-variant bg-surface-container rounded-xl">No assignments for this chapter.</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {chapterAssignments.map(a => {
                                    const hasPlan = Array.isArray(plansData) && plansData.some(plan => 
                                        plan.planables?.some(p => p.planable_type === 'App\\Models\\ClassAssignment' && p.planable_id === a.id)
                                    );
                                    return (
                                        <AssignmentCard
                                            key={`assignment-${a.id}`}
                                            id={a.id}
                                            title={a.title}
                                            dueDate={a.due_date}
                                            status={a.display_status === 'not_submitted' ? 'To-do' : a.display_status === 'graded' ? 'Graded' : 'Submitted'}
                                            progress={a.display_status === 'not_submitted' ? 0 : 100}
                                            hasPlan={hasPlan}
                                            onPlanClick={(id, title) => handlePlanClick(id, title, 'App\\Models\\ClassAssignment')}
                                        />
                                    );
                                })}
                            </div>
                        )
                    )}

                    {activeTab === 'Assessments' && (
                        chapterAssessments.length === 0 ? (
                            <div className="text-center py-8 text-on-surface-variant bg-surface-container rounded-xl">No assessments for this chapter.</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {chapterAssessments.map(a => {
                                    const hasPlan = Array.isArray(plansData) && plansData.some(plan => 
                                        plan.planables?.some(p => p.planable_type === 'App\\Models\\ClassAssessment' && p.planable_id === a.id)
                                    );
                                    return (
                                        <AssessmentCard
                                            key={`assessment-${a.id}`}
                                            id={a.id}
                                            title={a.title}
                                            date={a.start_date || a.due_date}
                                            duration={a.duration_minutes ? `${a.duration_minutes} mins` : 'N/A'}
                                            questionsCount={a.question_count}
                                            status={a.attempt_status === 'no_attempt' ? 'Not Started' : a.attempt_status === 'in_progress' ? 'In Progress' : 'Graded'}
                                            type="Exam"
                                            actionUrl={route('student.assessments.show', a.id)}
                                            hasPlan={hasPlan}
                                            onPlanClick={(id, title) => handlePlanClick(id, title, 'App\\Models\\ClassAssessment')}
                                        />
                                    );
                                })}
                            </div>
                        )
                    )}
                </div>
            </div>

            <PlanModal
                show={isPlanModalOpen}
                onClose={() => {
                    setIsPlanModalOpen(false);
                    refetchPlans();
                }}
                item={selectedItemForPlan}
                itemType={selectedItemTypeForPlan}
                classId={classModel?.id}
                chapterId={chapterId}
                existingPlan={selectedExistingPlan}
            />
        </DashboardTemplate>
    );
}
