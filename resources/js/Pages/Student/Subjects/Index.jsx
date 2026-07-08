import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import SubjectCard from '@/Components/features/student-subjects/SubjectCard';
import PromoBanner from '@/Components/features/student-subjects/PromoBanner';
import useApiGet from '@/hooks/useApiGet';

export default function Index() {
    const { data: subjectsData, loading } = useApiGet('/subjects');
    const [searchQuery, setSearchQuery] = useState('');

    const mappedSubjects = (subjectsData || []).map(item => ({
        id: item.id,
        title: item.subject?.subject_name || item.subject?.name || 'Subject',
        teacher: item.teacher?.full_name || 'Instructor',
        schedule: item.schedule_time ? `${item.schedule_day || ''} ${item.schedule_time}` : 'TBA',
        progress: item.material_completion || 0,
        icon: 'menu_book',
        iconColorClass: 'text-primary',
        iconBgClass: 'bg-primary-fixed',
        originalId: item.id
    }));

    const filteredSubjects = mappedSubjects.filter(subject => 
        subject.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        subject.teacher.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardTemplate 
            activeTab="Subject"
            title="Subjects"
            viewLabel="Student View"
            showBack={false}
        >
            <Head title="Subjects" />

            <div className="space-y-stack-lg max-w-7xl mx-auto">
                {/* Search Bar Section */}
                <section className="w-full">
                    <div className="relative group mt-4">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Icon name="search" className="text-outline" />
                        </div>
                        <input 
                            className="w-full h-14 pl-12 pr-4 bg-surface-container-low border-none rounded-xl text-body-md font-body-md focus:ring-2 focus:ring-primary transition-all duration-200 placeholder:text-outline-variant shadow-sm" 
                            placeholder="Search subjects or teachers..." 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </section>

                {/* Subjects List */}
                <section className="space-y-stack-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Available Courses</h2>
                        <button className="text-primary font-label-md hover:underline">Filter</button>
                    </div>
                    
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-8 text-on-surface-variant">Loading subjects...</div>
                        ) : filteredSubjects.length > 0 ? (
                            filteredSubjects.map(subject => (
                                <div key={subject.id} onClick={() => router.visit(`/student/subjects/${subject.id}`)}>
                                    <SubjectCard {...subject} />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-on-surface-variant bg-surface-container rounded-xl">
                                No subjects found matching your search.
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </DashboardTemplate>
    );
}
