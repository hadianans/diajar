import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import SubjectCard from '@/Components/features/student-subjects/SubjectCard';
import PromoBanner from '@/Components/features/student-subjects/PromoBanner';

// Mock Data
const subjectsData = [
    {
        id: 1,
        title: 'Mathematics',
        teacher: 'Dr. Sarah Thompson',
        schedule: 'Mon & Wed, 09:00 AM',
        progress: 75,
        icon: 'calculate',
        iconColorClass: 'text-primary',
        iconBgClass: 'bg-primary-fixed',
    },
    {
        id: 2,
        title: 'Biology',
        teacher: 'Prof. Miller',
        schedule: 'Tue & Thu, 11:30 AM',
        progress: 32,
        icon: 'biotech',
        iconColorClass: 'text-tertiary',
        iconBgClass: 'bg-tertiary-fixed',
    },
    {
        id: 3,
        title: 'Physics',
        teacher: 'Dr. Alan Grant',
        schedule: 'Friday, 02:00 PM',
        progress: 10,
        icon: 'auto_awesome',
        iconColorClass: 'text-on-surface-variant',
        iconBgClass: 'bg-surface-variant',
    },
    {
        id: 4,
        title: 'History',
        teacher: 'Mrs. Elena Rossi',
        schedule: 'Mon & Wed, 01:00 PM',
        progress: 95,
        icon: 'menu_book',
        iconColorClass: 'text-secondary',
        iconBgClass: 'bg-secondary-fixed-dim/20',
    }
];

export default function Index() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSubjects = subjectsData.filter(subject => 
        subject.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        subject.teacher.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardTemplate 
            role="student"
            activeTab="subjects"
            title="Subjects"
            viewLabel="Student View"
        >
            <Head title="Subjects" />

            <div className="space-y-stack-lg max-w-7xl mx-auto">
                {/* Search Bar Section */}
                <section className="w-full">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Icon name="search" className="text-outline" />
                        </div>
                        <input 
                            className="w-full h-14 pl-12 pr-4 bg-surface-container-low border-none rounded-xl text-body-md font-body-md focus:ring-2 focus:ring-primary transition-all duration-200 placeholder:text-outline-variant" 
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
                        {filteredSubjects.length > 0 ? (
                            filteredSubjects.map(subject => (
                                <SubjectCard key={subject.id} {...subject} />
                            ))
                        ) : (
                            <div className="text-center py-8 text-on-surface-variant">
                                No subjects found matching your search.
                            </div>
                        )}
                    </div>
                </section>

                {/* Upsell Banner */}
                <PromoBanner 
                    title="New Course Alert"
                    description="Discover advanced Quantum Physics starting next semester."
                    buttonText="Pre-enroll now"
                    icon="science"
                    onAction={() => console.log('Pre-enroll action')}
                />
            </div>
        </DashboardTemplate>
    );
}
