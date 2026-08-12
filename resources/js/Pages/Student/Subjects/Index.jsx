import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import Icon from '@/Components/shared/ui/Icon';
import SubjectCard from '@/Components/features/student-subjects/SubjectCard';
import PromoBanner from '@/Components/features/student-subjects/PromoBanner';
import useApiGet from '@/hooks/useApiGet';

const dayMap = {
    '1': 'Senin', '2': 'Selasa', '3': 'Rabu', '4': 'Kamis', '5': 'Jumat', '6': 'Sabtu', '7': 'Minggu',
    'Monday': 'Senin', 'Tuesday': 'Selasa', 'Wednesday': 'Rabu', 'Thursday': 'Kamis', 'Friday': 'Jumat', 'Saturday': 'Sabtu', 'Sunday': 'Minggu'
};

const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
        return `${parts[0]}:${parts[1]}`;
    }
    return timeStr;
};

export default function Index() {
    const { data: subjectsData, loading } = useApiGet('/subjects');
    const [searchQuery, setSearchQuery] = useState('');

    const mappedSubjects = (subjectsData || []).map(item => ({
        id: item.id,
        title: item.subject?.subject_name || item.subject?.name || 'Subject',
        teacher: item.teacher?.full_name || 'Instructor',
        schedule: item.time_schedule ? `${dayMap[item.day_schedule] || item.day_schedule || ''}, ${formatTime(item.time_schedule)}` : 'TBA',
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
                            placeholder="Cari mata pelajaran atau pengajar..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </section>

                {/* Subjects List */}
                <section className="space-y-stack-md">
                    <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2 tracking-tight">Kursus Saya</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant">Kelola dan lacak semua mata pelajaran yang Anda ikuti.</p>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Mata Pelajaran Tersedia</h2>
                        <button className="text-primary font-label-md hover:underline">Filter</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {loading ? (
                            <div className="col-span-full text-center py-12 text-on-surface-variant font-body-lg">Memuat mata pelajaran...</div>
                        ) : filteredSubjects.length > 0 ? (
                            filteredSubjects.map(subject => (
                                <SubjectCard key={subject.id} {...subject} />
                            ))
                        ) : (
                            <p className="col-span-full text-body-md text-on-surface-variant italic p-6 text-center border rounded-xl bg-surface-container-low border-outline-variant/50">Tidak ada materi pembelajaran aktif yang ditemukan.</p>
                        )}
                    </div>
                </section>
            </div>
        </DashboardTemplate>
    );
}
