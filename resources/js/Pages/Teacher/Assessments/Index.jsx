import React from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import AssessmentFilterTabs from '@/Components/features/teacher-assessments/AssessmentFilterTabs';
import AssessmentCard from '@/Components/features/teacher-assessments/AssessmentCard';

export default function Index() {
    
    const handleCreate = () => {
        router.visit(route('teacher.assessments.create'));
    };

    const customTitleSection = (
        <div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Assessments</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Design and track student performance evaluations.</p>
        </div>
    );

    const actions = (
        <button 
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all shadow-md"
        >
            <Icon name="add" />
            Create Assessment
        </button>
    );

    return (
        <DashboardTemplate role="teacher" customTitle={customTitleSection} actions={actions}>
            <Head title="Assessments" />
            
            <AssessmentFilterTabs />
            
            {/* Secondary Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-stack-lg">
                <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar py-1">
                    <button className="bg-primary text-on-primary px-4 py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap">All Chapters</button>
                    <button className="bg-surface-container-low border border-outline-variant text-on-surface-variant px-4 py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap hover:bg-surface-container-high transition-colors">Cell Structure</button>
                    <button className="bg-surface-container-low border border-outline-variant text-on-surface-variant px-4 py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap hover:bg-surface-container-high transition-colors">Genetics</button>
                    <button className="bg-surface-container-low border border-outline-variant text-on-surface-variant px-4 py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap hover:bg-surface-container-high transition-colors">Metabolism</button>
                </div>
                
                <div className="flex items-center gap-2 self-end">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Sort by:</span>
                    <button className="flex items-center gap-2 bg-white border border-outline-variant px-3 py-1.5 rounded-lg font-label-sm text-label-sm text-on-surface hover:border-primary transition-colors">
                        Newest
                        <Icon name="expand_more" className="text-[18px]" />
                    </button>
                </div>
            </div>

            {/* Assessment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
                <AssessmentCard 
                    id="1"
                    title="Biology Midterm Quiz"
                    chapter="Chapter 3: Genetics"
                    state="completed"
                    classAvg="78%"
                    participationCompleted={28}
                    participationTotal={32}
                    duration={45}
                    questionsCount={30}
                />
                
                <AssessmentCard 
                    id="2"
                    title="Cell Structure Final"
                    chapter="Chapter 2: Cell Structure"
                    state="pending"
                    classAvg="84%"
                    participationCompleted={32}
                    participationTotal={32}
                    duration={60}
                    questionsCount={50}
                />
                
                <AssessmentCard 
                    id="3"
                    title="Photosynthesis Pop Quiz"
                    chapter="Chapter 4: Metabolism"
                    state="active"
                    timeRemaining="12m 45s"
                    participationCompleted={12}
                    participationTotal={32}
                    duration={15}
                    questionsCount={10}
                    progressPercentage={37.5}
                />
            </div>
            
        </DashboardTemplate>
    );
}
