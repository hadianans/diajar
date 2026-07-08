import React, { useState, useMemo, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import VideoPlayer from '@/Components/features/student-subjects/VideoPlayer';
import LessonTabs from '@/Components/features/student-subjects/LessonTabs';
import LessonActions from '@/Components/features/student-subjects/LessonActions';
import PromoBanner from '@/Components/features/student-subjects/PromoBanner';
import ReflectionForm from '@/Components/features/reflections/ReflectionForm';
import useApiGet from '@/hooks/useApiGet';
import api from '@/utils/api';
import { getFileDetails } from '@/utils/getFileDetails';

export default function Show({
    subjectId,
    chapterId,
    lessonId
}) {
    const { data: materialData, loading, setData } = useApiGet(`/materials/${lessonId}`);

    const [accessLogId, setAccessLogId] = useState(null);

    // SRL Form State
    const [activeAction, setActiveAction] = useState(null); // 'plan' | 'reflection' | null
    const [planDate, setPlanDate] = useState('');
    const [planNotes, setPlanNotes] = useState('');
    const [isSavingPlan, setIsSavingPlan] = useState(false);

    const [isSavingReflection, setIsSavingReflection] = useState(false);

    // Fetch reflections and plans
    const { data: reflectionsData, refetch: refetchReflections } = useApiGet('/reflections');
    const { data: plansData, refetch: refetchPlans } = useApiGet(chapterId ? `/plans?chapter_id=${chapterId}` : null);
    const { data: reviewData, refetch: refetchReview } = useApiGet(lessonId ? `/materials/${lessonId}/review` : null);

    const existingReflection = useMemo(() => {
        if (!reflectionsData) return null;
        return reflectionsData.find(ref =>
            ref.reflectables?.some(r => r.reflectable_type === 'App\\Models\\Material' && r.reflectable_id === parseInt(lessonId))
        );
    }, [reflectionsData, lessonId]);

    const existingPlan = useMemo(() => {
        if (!plansData) return null;
        return plansData.find(plan =>
            plan.planables?.some(p => p.planable_type === 'App\\Models\\Material' && p.planable_id === parseInt(lessonId))
        );
    }, [plansData, lessonId]);

    // Prefill plan form
    useEffect(() => {
        if (existingPlan) {
            setPlanDate(existingPlan.target_date ? existingPlan.target_date.split('T')[0] : '');
            setPlanNotes(existingPlan.description || '');
        } else {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setPlanDate(tomorrow.toISOString().split('T')[0]);
            setPlanNotes('');
        }
    }, [existingPlan]);

    const reflectionInitialData = useMemo(() => {
        if (!existingReflection && !reviewData) return null;
        let emotions = [];
        if (existingReflection) {
            try {
                emotions = typeof existingReflection.emotions === 'string'
                    ? JSON.parse(existingReflection.emotions)
                    : (existingReflection.emotions || []);
            } catch (e) {
                emotions = [];
            }
        }
        return {
            ...(existingReflection || {}),
            emotions,
            material_quality: reviewData?.score || 0
        };
    }, [existingReflection, reviewData]);

    // Fetch chapter materials to sequence previous/next links aligned by subchapters
    const { data: allMaterialsData } = useApiGet(
        subjectId && chapterId ? `/subjects/${subjectId}/chapters/${chapterId}/materials` : null
    );

    const flattenedMaterials = useMemo(() => {
        if (!allMaterialsData) return [];
        const result = [];
        Object.entries(allMaterialsData).forEach(([subId, mats]) => {
            if (mats.length === 0) return;
            const firstMat = mats[0];
            const subOrder = subId === 'root' ? -1 : (firstMat.subchapter?.order || 999);
            result.push({
                subId,
                order: subOrder,
                mats: [...mats].sort((a, b) => a.order - b.order)
            });
        });
        result.sort((a, b) => a.order - b.order);
        return result.flatMap(sub => sub.mats.map(m => m.id));
    }, [allMaterialsData]);

    const navigation = useMemo(() => {
        if (flattenedMaterials.length === 0) return { prevId: null, nextId: null };
        const idx = flattenedMaterials.indexOf(parseInt(lessonId));
        return {
            prevId: idx > 0 ? flattenedMaterials[idx - 1] : null,
            nextId: idx !== -1 && idx < flattenedMaterials.length - 1 ? flattenedMaterials[idx + 1] : null
        };
    }, [flattenedMaterials, lessonId]);

    // Track access start
    useEffect(() => {
        if (materialData && !accessLogId) {
            api.post(`/materials/${lessonId}/access/start`)
                .then(res => setAccessLogId(res.log_id))
                .catch(err => console.error('Error starting access:', err));
        }

        return () => {
            if (accessLogId) {
                api.patch(`/material-access-logs/${accessLogId}/end`, { interaction_data: { type: 'exit' } })
                    .catch(console.error);
            }
        };
    }, [materialData, lessonId, accessLogId]);

    const lesson = useMemo(() => {
        if (!materialData) return null;
        return {
            id: materialData.id,
            subjectId: subjectId,
            chapterId: chapterId,
            subjectTitle: 'Course',
            chapterNumber: 1,
            chapterTitle: materialData.chapter?.name || 'Chapter',
            subchapterTitle: materialData.subchapter?.name || 'General',
            title: materialData.title,
            duration: materialData.duration || 'N/A',
            progress: materialData.is_completed ? 100 : 0,
            overview: {
                description: materialData.description || 'No description available.',
                points: []
            },
            resources: materialData.attachments?.map(att => {
                const details = getFileDetails(att.file_url);
                return {
                    id: att.id,
                    title: att.title,
                    meta: 'Attachment',
                    icon: details.icon,
                    bgClass: details.bgClass,
                    textClass: details.textClass,
                    actionIcon: 'download',
                    url: att.file_url
                };
            }) || [],
            isCompleted: materialData.is_completed,
            isBookmarked: materialData.is_bookmarked,
            prevId: navigation.prevId,
            nextId: navigation.nextId,
            relatedAssessment: materialData.related_assessment,
            fileType: materialData.file_type,
            fileUrl: materialData.file_url
        };
    }, [materialData, subjectId, chapterId, navigation]);

    const handleToggleComplete = async () => {
        try {
            if (lesson.isCompleted) {
                await api.patch(`/materials/${lessonId}/incomplete`);
                setData({ ...materialData, is_completed: false });
            } else {
                setActiveAction('reflection');
                setTimeout(() => {
                    const el = document.getElementById('reflection-form-section');
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            }
        } catch (error) {
            console.error('Error toggling completion status', error);
        }
    };

    const handleToggleBookmark = async () => {
        try {
            await api.post('/bookmarks/toggle', {
                bookmarkable_id: lessonId,
                bookmarkable_type: 'App\\Models\\Material'
            });
            setData({ ...materialData, is_bookmarked: !lesson.isBookmarked });
        } catch (error) {
            console.error('Error toggling bookmark', error);
        }
    };

    const handleSavePlan = async (e) => {
        e.preventDefault();
        if (!planDate) return;
        setIsSavingPlan(true);
        try {
            if (existingPlan) {
                await api.put(`/plans/${existingPlan.id}`, {
                    title: `Study: ${lesson.title}`,
                    target_date: planDate,
                    description: planNotes,
                });
                alert('Study plan updated successfully!');
            } else {
                await api.post('/plans', {
                    class_id: subjectId,
                    chapter_id: chapterId,
                    title: `Study: ${lesson.title}`,
                    target_date: planDate,
                    description: planNotes,
                    planables: [
                        {
                            planable_id: lessonId,
                            planable_type: 'App\\Models\\Material'
                        }
                    ]
                });
                alert('Study plan created successfully!');
            }
            refetchPlans();
            setActiveAction(null);
        } catch (err) {
            console.error(err);
            alert('Failed to save study plan');
        } finally {
            setIsSavingPlan(false);
        }
    };

    const handleSaveReflection = async (data) => {
        setIsSavingReflection(true);
        try {
            if (existingReflection) {
                await api.put(`/reflections/${existingReflection.id}`, {
                    title: `Reflection: ${lesson.title}`,
                    content: data.content,
                    comprehension_level: data.comprehension_level,
                    emotions: data.emotions,
                });
            } else {
                await api.post('/reflections', {
                    title: `Reflection: ${lesson.title}`,
                    content: data.content,
                    comprehension_level: data.comprehension_level,
                    emotions: data.emotions,
                    reflectable_id: lessonId,
                    reflectable_type: 'App\\Models\\Material'
                });
            }

            if (data.material_quality > 0) {
                await api.post(`/materials/${lessonId}/review`, {
                    score: data.material_quality
                });
                refetchReview();
            }

            if (!lesson.isCompleted) {
                await api.patch(`/materials/${lessonId}/complete`);
                setData({ ...materialData, is_completed: true });
            }

            alert('Reflection submitted and lesson marked as completed!');
            refetchReflections();
            setActiveAction(null);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to submit reflection.');
        } finally {
            setIsSavingReflection(false);
        }
    };

    // Header section for the DashboardTemplate
    const headerSection = lesson ? (
        <section>
            <nav className="flex items-center gap-2 text-label-sm font-label-sm text-outline mb-2 overflow-x-auto no-scrollbar whitespace-nowrap">
                <Link href={route('student.subjects.index')} className="hover:underline hover:text-on-surface transition-colors">
                    My Courses
                </Link>
                <Icon name="chevron_right" className="text-[14px]" />
                <Link href={route('student.subjects.chapters.show', { subjectId: subjectId, chapterId: chapterId })} className="hover:underline hover:text-on-surface transition-colors">
                    {lesson.chapterTitle}
                </Link>
                <Icon name="chevron_right" className="text-[14px]" />
                <span className="text-primary-container font-semibold">{lesson.subchapterTitle}</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
                        {lesson.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1 text-on-surface-variant">
                            <Icon name="play_circle" className="text-[18px]" />
                            <span className="font-label-sm text-label-sm">{materialData?.file_type || 'Material'}</span>
                        </div>
                        {lesson.duration !== 'N/A' && (
                            <div className="flex items-center gap-1 text-on-surface-variant">
                                <Icon name="schedule" className="text-[18px]" />
                                <span className="font-label-sm text-label-sm">{lesson.duration}</span>
                            </div>
                        )}
                        {materialData?.tags?.map(tag => (
                            <span key={tag.id} className="px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold uppercase tracking-wider">{tag.name}</span>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleToggleBookmark}
                        className={`p-2 h-10 w-10 flex items-center justify-center rounded-xl bg-surface-container-highest shadow-sm hover:scale-105 transition-transform ${lesson.isBookmarked ? 'text-primary' : 'text-on-surface-variant'}`}
                        title={lesson.isBookmarked ? "Remove bookmark" : "Save lesson"}
                    >
                        <Icon name="bookmark" style={{ fontVariationSettings: lesson.isBookmarked ? "'FILL' 1" : "'FILL' 0" }} />
                    </button>
                    <div className="flex flex-col items-end">
                        <span className="text-label-sm font-label-sm text-outline-variant mb-1">
                            {lesson.isCompleted ? 'Completed' : 'In Progress'}
                        </span>
                        <div className="w-32 h-2 bg-outline-variant/30 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${lesson.progress}%` }}></div>
                        </div>
                        <span className="text-[10px] font-bold text-primary mt-1">{lesson.progress}% Completed</span>
                    </div>
                </div>
            </div>
        </section>
    ) : null;

    if (loading) {
        return (
            <DashboardTemplate role="student" activeTab="Subject" title="Loading..." showBack={false}>
                <div className="text-center py-12">Loading lesson details...</div>
            </DashboardTemplate>
        );
    }

    if (!lesson) {
        return (
            <DashboardTemplate role="student" activeTab="Subject" title="Not Found" showBack={false}>
                <div className="text-center py-12">Lesson not found.</div>
            </DashboardTemplate>
        );
    }

    return (
        <DashboardTemplate
            activeTab="Subject"
            title="Lesson Details"
            showBack={false}
            headerSection={headerSection}
        >
            <Head title={`${lesson.title} - ${lesson.chapterTitle}`} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8 mt-4">
                {/* Video & Primary Content */}
                <div className="lg:col-span-8 space-y-stack-md">
                    {lesson.fileType === 'video' && lesson.fileUrl && (
                        <VideoPlayer
                            title={lesson.title}
                            duration={lesson.duration}
                            progress={lesson.progress}
                            url={lesson.fileUrl}
                        />
                    )}

                    {lesson.fileType === 'text' && lesson.fileUrl && !materialData?.content && (
                        <div className="flex flex-col items-center justify-center p-8 bg-surface-container-low border border-outline-variant rounded-2xl">
                            <Icon name="description" className="text-4xl text-primary mb-4" />
                            <p className="text-body-lg text-on-surface mb-4">This lesson contains an attached document.</p>
                            <a
                                href={lesson.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-md hover:bg-primary/90 transition-colors flex items-center gap-2"
                            >
                                <Icon name="open_in_new" className="text-[18px]" />
                                View Document
                            </a>
                        </div>
                    )}

                    <LessonTabs
                        overviewContent={lesson.overview}
                        resources={lesson.resources}
                        content={materialData?.content}
                    />
                </div>

                {/* Side Sidebar: Learning Actions */}
                <div className="lg:col-span-4 space-y-gutter">
                    <LessonActions
                        isCompleted={lesson.isCompleted}
                        onMarkCompleted={handleToggleComplete}
                        onPrevious={() => {
                            if (lesson.prevId) router.visit(`/student/subjects/${subjectId}/${chapterId}/${lesson.prevId}`);
                        }}
                        onNext={() => {
                            if (lesson.nextId) router.visit(`/student/subjects/${subjectId}/${chapterId}/${lesson.nextId}`);
                        }}
                        hasNext={!!lesson.nextId}
                        hasPrev={!!lesson.prevId}
                        onAddStudyPlan={() => setActiveAction(activeAction === 'plan' ? null : 'plan')}
                        onWriteReflection={() => setActiveAction(activeAction === 'reflection' ? null : 'reflection')}
                        onTakeQuiz={() => {
                            if (lesson.relatedAssessment) {
                                router.visit(`/student/assessments/${lesson.relatedAssessment.id}`);
                            } else {
                                alert('No assessment tied to this lesson.');
                            }
                        }}
                        hasQuiz={!!lesson.relatedAssessment}
                    />

                    {/* SRL Forms Container */}
                    {activeAction === 'plan' && (
                        <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm mt-4 animate-fadeIn">
                            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/40 mb-5">
                                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                                    {existingPlan ? 'Edit Study Plan' : 'Study Plan'}
                                </h3>
                                <button onClick={() => setActiveAction(null)} className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors">
                                    <Icon name="close" className="text-xl" />
                                </button>
                            </div>
                            <form onSubmit={handleSavePlan} className="space-y-5">
                                <div>
                                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Target Date</label>
                                    <input
                                        type="date"
                                        className="w-full bg-surface-container-low border border-transparent focus:border-primary rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface outline-none transition-all"
                                        value={planDate}
                                        onChange={e => setPlanDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Study Notes</label>
                                    <textarea
                                        className="w-full bg-surface-container-low border border-transparent focus:border-primary rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface outline-none transition-all min-h-[120px] resize-y"
                                        placeholder="What is your main focus or goal?"
                                        value={planNotes}
                                        onChange={e => setPlanNotes(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSavingPlan}
                                    className="w-full py-3 bg-primary text-on-primary rounded-full font-label-lg text-label-lg hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
                                >
                                    {isSavingPlan ? 'Saving...' : existingPlan ? 'Update Plan' : 'Save Plan'}
                                </button>
                            </form>
                        </div>
                    )}

                    {activeAction === 'reflection' && (
                        <div id="reflection-form-section" className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm mt-4 animate-fadeIn">
                            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/40 mb-6">
                                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                                    {existingReflection ? 'Edit Reflection' : 'Write Reflection'}
                                </h3>
                                <button onClick={() => setActiveAction(null)} className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors">
                                    <Icon name="close" className="text-xl" />
                                </button>
                            </div>
                            <ReflectionForm
                                initialData={reflectionInitialData}
                                onSubmit={handleSaveReflection}
                                onCancel={() => setActiveAction(null)}
                                loading={isSavingReflection}
                            />
                        </div>
                    )}
                </div>
            </div>
        </DashboardTemplate>
    );
}
