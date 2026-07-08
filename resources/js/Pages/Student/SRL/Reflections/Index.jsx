import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';
import moment from 'moment';

export default function ReflectionsIndex() {
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (typeFilter) queryParams.append('type', typeFilter);

    const { data: reflectionsData, loading } = useApiGet(`/reflections?${queryParams.toString()}`);
    const reflections = reflectionsData?.data || [];

    const handleBack = () => router.visit('/student/dashboard');

    const headerSection = (
        <section className="flex flex-col gap-stack-sm pt-4">
            <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">Growth Journal</h2>
            <p className="text-body-md text-on-surface-variant">Review your past reflections and strategies.</p>
        </section>
    );

    const getEmotionsDisplay = (emotionsJson) => {
        try {
            const emotions = typeof emotionsJson === 'string' ? JSON.parse(emotionsJson) : emotionsJson;
            if (!Array.isArray(emotions) || emotions.length === 0) return null;
            return emotions.join(', ');
        } catch {
            return null;
        }
    };

    return (
        <DashboardTemplate 
            role="student"
            activeTab="dashboard"
            title="Reflections"
            headerSection={headerSection}
            onBack={handleBack}
        >
            <Head title="My Reflections - Diajar" />

            <div className="flex flex-col gap-stack-lg pb-12">
                
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30">
                    <div className="flex items-center bg-surface w-full md:w-96 rounded-full px-4 py-2 border border-outline-variant">
                        <Icon name="search" className="text-on-surface-variant mr-2" />
                        <input 
                            type="text" 
                            placeholder="Search journal entries..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-transparent outline-none text-body-md text-on-surface"
                        />
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <select 
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="bg-surface border border-outline-variant rounded-full px-4 py-2 text-label-md text-on-surface outline-none focus:border-primary flex-1 md:flex-none"
                        >
                            <option value="">All Types</option>
                            <option value="material">Material</option>
                            <option value="assignment">Assignment</option>
                            <option value="assessment">Assessment</option>
                        </select>
                    </div>
                </div>

                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loading ? (
                        <div className="col-span-1 md:col-span-2 text-center p-12 text-on-surface-variant">Loading journal entries...</div>
                    ) : reflections.length > 0 ? (
                        reflections.map(ref => (
                            <div key={ref.id} className="bg-surface p-6 rounded-2xl border border-outline-variant/30 flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-headline-sm text-headline-sm text-on-surface line-clamp-1">
                                        {ref.title}
                                    </h3>
                                    <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold shrink-0 shadow-sm" title={`Comprehension Level: ${ref.comprehension_level}/5`}>
                                        {ref.comprehension_level}
                                    </div>
                                </div>
                                
                                <p className="text-body-md text-on-surface-variant line-clamp-3">
                                    {ref.content}
                                </p>
                                
                                <div className="mt-auto pt-4 border-t border-outline-variant/30 flex flex-col gap-2">
                                    {getEmotionsDisplay(ref.emotions) && (
                                        <div className="text-label-sm text-on-surface-variant flex items-center gap-2">
                                            <Icon name="mood" className="text-[16px]" />
                                            {getEmotionsDisplay(ref.emotions)}
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-label-sm text-on-surface-variant">
                                        <span className="flex items-center gap-1">
                                            <Icon name="event" className="text-[16px]" />
                                            {moment(ref.created_at).format('MMM D, YYYY')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-1 md:col-span-2 text-center p-12 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                            <Icon name="history_edu" className="text-primary text-display-md mb-2 opacity-50" />
                            <h4 className="text-headline-sm font-headline-sm text-on-surface">No Entries Found</h4>
                            <p className="text-body-md text-on-surface-variant mt-2 max-w-sm mx-auto">
                                You don't have any reflections matching these filters. Try completing a task and writing a reflection!
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </DashboardTemplate>
    );
}
