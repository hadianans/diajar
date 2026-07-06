import React, { useState, useMemo, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import ChapterFilterBar from '@/Components/features/teacher-chapters/ChapterFilterBar';
import ChapterListCard from '@/Components/features/teacher-chapters/ChapterListCard';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';
import api from '@/utils/api';
import ChapterModal from '@/Components/features/teacher-chapters/modals/ChapterModal';

export default function Index() {
    const { url } = usePage();
    const [searchQuery, setSearchQuery] = useState('');
    const { data: chapters, loading, refetch } = useApiGet(searchQuery ? `/chapters?search=${encodeURIComponent(searchQuery)}` : '/chapters');
    const { data: classesData } = useApiGet('/classes');
    
    const [showModal, setShowModal] = useState(false);
    const [editingChapter, setEditingChapter] = useState(null);

    // Extract grades and groups from classesData
    const gradesAndGroups = useMemo(() => {
        if (!classesData) return {};
        const map = {};
        classesData.forEach(cls => {
            cls.group_years?.forEach(gy => {
                if (gy.grade) {
                    if (!map[gy.grade]) map[gy.grade] = [];
                    if (gy.group && !map[gy.grade].find(g => g.id === gy.group.id)) {
                        map[gy.grade].push(gy.group);
                    }
                }
            });
        });
        return map;
    }, [classesData]);

    const grades = useMemo(() => {
        return Object.keys(gradesAndGroups).map(Number).sort((a, b) => a - b);
    }, [gradesAndGroups]);

    const initialTab = useMemo(() => {
        try {
            const search = url.split('?')[1];
            if (search) {
                const params = new URLSearchParams(search);
                return params.get('grade') || '';
            }
        } catch (e) { }
        return '';
    }, [url]);

    const [activeTab, setActiveTab] = useState(initialTab);

    // Set default tab when grades are loaded
    useEffect(() => {
        if (grades.length > 0 && !activeTab) {
            setActiveTab(grades[0].toString());
        }
    }, [grades, activeTab]);

    const handleTabChange = (grade) => {
        setActiveTab(grade.toString());
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('grade', grade);
        window.history.replaceState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
    };

    // Filter chapters based on active tab
    const displayedChapters = useMemo(() => {
        if (!chapters) return [];
        if (grades.length <= 1) return chapters;
        return chapters.filter(ch => ch.target_grade?.toString() === activeTab);
    }, [chapters, activeTab, grades]);

    const headerSection = (
        <section className="mb-stack-lg">
            <div className="flex flex-col gap-1">
                <span className="text-primary font-label-md tracking-wider uppercase">Curriculum</span>
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">My Chapters</h2>
                <p className="text-on-surface-variant font-body-md">Manage your curriculum chapters, review materials, and track overall structure.</p>
            </div>
        </section>
    );

    const handleCreateChapter = () => {
        setEditingChapter(null);
        setShowModal(true);
    };

    const handleDeleteChapter = async (chapterId) => {
        if (!confirm('Are you sure you want to delete this chapter?')) return;
        try {
            await api.delete(`/chapters/${chapterId}`);
            refetch();
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting chapter');
        }
    };

    return (
        <DashboardTemplate role="teacher" activeTab="chapters" title="Chapters" headerSection={headerSection}>
            <Head title="Chapters | Diajar LMS" />

            <ChapterFilterBar onSearch={setSearchQuery} />

            {grades.length > 1 && (
                <div className="flex border-b border-outline-variant mb-6 overflow-x-auto no-scrollbar">
                    {grades.map(grade => (
                        <button
                            key={grade}
                            onClick={() => handleTabChange(grade)}
                            className={`px-6 py-4 font-title-sm text-title-sm transition-colors whitespace-nowrap border-b-2 ${activeTab === grade.toString() ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}`}
                        >
                            Grade {grade}
                        </button>
                    ))}
                </div>
            )}

            {loading ? (
                <div className="text-center py-12 text-on-surface-variant">Loading chapters...</div>
            ) : (
                <div className="flex flex-col gap-stack-md relative pb-24">
                    {displayedChapters.length > 0 ? (
                        displayedChapters.map((ch, idx) => (
                            <ChapterListCard
                                key={ch.id}
                                chapterId={ch.id}
                                number={idx + 1}
                                title={ch.name}
                                description={ch.description || 'No description provided.'}
                                tags={ch.tags}
                                targetGroups={ch.target_groups}
                                availableGroups={gradesAndGroups[ch.target_grade] || []}
                                materialsCount={ch.materials_count || 0}
                                assignmentsCount={ch.class_assignments_count || 0}
                                assessmentsCount={ch.class_assessments_count || 0}
                                completionProgress={0}
                                onEdit={() => {
                                    setEditingChapter(ch);
                                    setShowModal(true);
                                }}
                                onDelete={() => handleDeleteChapter(ch.id)}
                            />
                        ))
                    ) : (
                        <div className="p-8 text-center text-on-surface-variant bg-surface-container rounded-2xl">
                            You haven't created any chapters for this selection yet.
                        </div>
                    )}
                </div>
            )}

            {/* Floating Action Button */}
            <button
                onClick={handleCreateChapter}
                className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-on-primary rounded-2xl shadow-xl flex items-center justify-center active:scale-90 transition-transform group z-40"
            >
                <Icon name="add" className="text-[32px] group-hover:rotate-90 transition-transform" />
                <div className="absolute right-16 bg-inverse-surface text-inverse-on-surface px-3 py-1 rounded text-label-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    New Chapter
                </div>
            </button>

            <ChapterModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={() => {
                    setShowModal(false);
                    refetch();
                }}
                initialData={editingChapter}
                classesData={classesData}
            />
        </DashboardTemplate>
    );
}
