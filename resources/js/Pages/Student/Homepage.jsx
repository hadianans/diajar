import React, { useState, useEffect, useMemo } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import ContinueLearningCard from '@/Components/features/student-dashboard/ContinueLearningCard';
import ProgressRing from '@/Components/features/student-dashboard/ProgressRing';
import UpcomingDeadlines from '@/Components/features/student-dashboard/UpcomingDeadlines';
import TargetsBox from '@/Components/features/student-dashboard/TargetsBox';
import SavedLaterBox from '@/Components/features/student-dashboard/SavedLaterBox';
import RecommendedCarousel from '@/Components/features/student-dashboard/RecommendedCarousel';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';
import moment from 'moment';

export default function Homepage() {
    const { auth } = usePage().props;
    const user = auth?.user || {};
    const [greeting, setGreeting] = useState('Hi');

    // Data Fetching
    const { data: homeData, loading: loadingHome } = useApiGet('/home');
    const { data: bookmarksData, loading: loadingBookmarks } = useApiGet('/bookmarks');
    const { data: subjectsData, loading: loadingSubjects } = useApiGet('/subjects');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    // Derived Data Mapping
    const progress = homeData?.progress || { material_completion: 0, assignment_completion: 0, assessment_completion: 0 };
    const lastAccessed = homeData?.last_accessed_material;
    const learningTargets = homeData?.learning_targets || [];
    const nearestDeadlines = homeData?.nearest_deadlines || {};

    const deadlines = useMemo(() => {
        const list = [];
        if (nearestDeadlines.assignment) {
            list.push({
                id: `asn_${nearestDeadlines.assignment.id}`,
                title: nearestDeadlines.assignment.title,
                type: 'Assignment',
                dueDate: moment(nearestDeadlines.assignment.due_date).calendar(),
                icon: 'assignment',
                badgeBgClass: 'bg-error-container text-on-error-container',
                originalId: nearestDeadlines.assignment.id
            });
        }
        if (nearestDeadlines.assessment) {
            list.push({
                id: `ass_${nearestDeadlines.assessment.id}`,
                title: nearestDeadlines.assessment.title,
                type: 'Assessment',
                dueDate: moment(nearestDeadlines.assessment.due_date).calendar(),
                icon: 'quiz',
                badgeBgClass: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
                originalId: nearestDeadlines.assessment.id
            });
        }
        return list;
    }, [nearestDeadlines]);

    const targets = useMemo(() => {
        return learningTargets.map(t => ({
            id: t.id,
            text: t.title,
            isCompleted: t.progress === 100
        }));
    }, [learningTargets]);

    const bookmarks = useMemo(() => {
        if (!bookmarksData) return [];
        return bookmarksData.slice(0, 3).map(b => ({
            id: b.id,
            title: b.bookmarkable?.title || 'Unknown Item',
            imageUrl: null,
            altText: b.bookmarkable_type,
            originalType: b.bookmarkable_type,
            originalId: b.bookmarkable_id
        }));
    }, [bookmarksData]);

    const courses = useMemo(() => {
        if (!subjectsData) return [];
        return subjectsData.slice(0, 5).map(c => ({
            id: c.id,
            subject: c.subject?.subject_name || c.subject?.name || 'Subject',
            title: c.subject?.name || 'Class',
            duration: '',
            imageUrl: null
        }));
    }, [subjectsData]);

    const headerSection = (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Greeting */}
            <div className="flex justify-between items-center bg-white border border-outline-variant/40 rounded-2xl p-4 shadow-sm mt-4">
                <div>
                    <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-extrabold tracking-tight">
                        {greeting}, {user.first_name || user.full_name?.split(' ')[0] || 'Student'}!
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                        Welcome back to your learning hub
                    </p>
                </div>
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-fixed flex-shrink-0 bg-surface-container">
                    {user.picture ? (
                        <img className="w-full h-full object-cover" src={user.picture} alt="Avatar" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-primary">
                            {user.full_name ? user.full_name.substring(0, 2).toUpperCase() : 'ST'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Head title="Diajar LMS - Home" />

            <DashboardTemplate
                activeTab="Home"
                title="Diajar LMS"
                viewLabel="Student View"
                showBack={false}
                headerSection={headerSection}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
                    {/* Left Column: Course Cards, Actions, Deadlines, Suggestions */}
                    <div className="lg:col-span-8 flex flex-col gap-stack-lg">
                        
                        {/* Continue Learning card widget */}
                        {lastAccessed && lastAccessed.material ? (
                            <ContinueLearningCard
                                subject="Resume Learning"
                                title={lastAccessed.material.title}
                                type={lastAccessed.material.file_type || 'Material'}
                                progress={progress.material_completion || 0}
                                onContinueClick={() => router.visit(`/student/subjects/${lastAccessed.material.chapter?.subject_id || 1}/chapters/${lastAccessed.material.chapter_id}/lessons/${lastAccessed.material_id}`)}
                            />
                        ) : (
                            <div className="bg-surface-container-low rounded-[24px] p-6 border border-outline-variant text-center">
                                <h3 className="font-headline-sm text-headline-sm text-on-surface-variant mb-2">No active learning material</h3>
                                <p className="text-body-md text-outline">Start studying a subject to see your progress here.</p>
                            </div>
                        )}

                        {/* Assignments and Assessments Action cells */}
                        <section className="grid grid-cols-2 gap-gutter">
                            <button
                                onClick={() => router.visit('/student/assignments')}
                                className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant p-4 rounded-2xl active:scale-[0.98] transition-all hover:shadow-md hover:bg-surface-container-low text-left w-full shadow-sm"
                                type="button"
                            >
                                <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container flex-shrink-0">
                                    <Icon name="assignment" className="text-[20px]" />
                                </div>
                                <span className="font-label-md text-label-md text-on-surface font-bold">
                                    Assignments
                                </span>
                            </button>

                            <button
                                onClick={() => router.visit('/student/assessments')}
                                className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant p-4 rounded-2xl active:scale-[0.98] transition-all hover:shadow-md hover:bg-surface-container-low text-left w-full shadow-sm"
                                type="button"
                            >
                                <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container flex-shrink-0">
                                    <Icon name="quiz" className="text-[20px]" />
                                </div>
                                <span className="font-label-md text-label-md text-on-surface font-bold">
                                    Assessments
                                </span>
                            </button>
                        </section>

                        {/* Upcoming deadlines list */}
                        {deadlines.length > 0 && (
                            <UpcomingDeadlines
                                deadlines={deadlines}
                                onDeadlineClick={(deadline) => {
                                    if (deadline.type === 'Assignment') {
                                        router.visit(`/student/assignments/${deadline.originalId}`);
                                    } else {
                                        router.visit(`/student/assessments/${deadline.originalId}`);
                                    }
                                }}
                            />
                        )}

                        {/* Suggestions slider */}
                        {courses.length > 0 && (
                            <RecommendedCarousel
                                courses={courses}
                                onSeeMoreClick={() => router.visit('/student/subjects')}
                                onCourseClick={(course) => router.visit(`/student/subjects/${course.id}`)}
                            />
                        )}

                    </div>

                    {/* Right Column: Progress Rings, Targets, and Bookmarks */}
                    <div className="lg:col-span-4 flex flex-col gap-stack-lg">
                        
                        {/* Overall Progress rings summary container */}
                        <section className="bg-surface-container-low rounded-[24px] p-6 border border-outline-variant hover:shadow-md transition-shadow duration-300">
                            <h3 className="font-headline-md text-headline-md text-on-surface mb-6 font-bold">
                                Learning Progress
                            </h3>
                            <div className="flex justify-around items-center gap-2">
                                <ProgressRing percentage={progress.material_completion} label="Materials" colorClass="text-primary" />
                                <ProgressRing percentage={progress.assignment_completion} label="Homework" colorClass="text-secondary" />
                                <ProgressRing percentage={progress.assessment_completion} label="Tests" colorClass="text-tertiary" />
                            </div>
                        </section>

                        {/* Targets interactive checklist */}
                        <TargetsBox
                            initialTargets={targets}
                            onViewAllClick={() => router.visit('/student/dashboard')}
                        />

                        {/* Bookmark cells */}
                        <SavedLaterBox
                            savedItems={bookmarks}
                            onAddNewClick={() => router.visit('/student/subjects')}
                            onItemClick={(item) => alert('View bookmark: ' + item.title)}
                        />

                    </div>
                </div>

                {/* Mobile floating quick add button */}
                <button
                    onClick={() => router.visit('/student/dashboard')}
                    className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-primary text-on-primary rounded-2xl shadow-xl flex items-center justify-center active:scale-95 transition-transform hover:bg-primary/95 z-40"
                    type="button"
                    title="Quick Add Target"
                >
                    <Icon name="add" className="text-2xl text-white" />
                </button>
            </DashboardTemplate>
        </>
    );
}
