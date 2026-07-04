import React, { useState, useMemo, useEffect } from 'react';
import ClassFilters from '@/Components/features/classes/ClassFilters';
import ClassSortBar from '@/Components/features/classes/ClassSortBar';
import ClassGridCard from '@/Components/features/classes/ClassGridCard';

export default function ClassesBentoGrid({ initialClasses = [], onClassClick }) {
    // Filter states
    const [selectedYear, setSelectedYear] = useState('2024/2025');
    const [selectedSubject, setSelectedSubject] = useState('All');
    const [selectedGroup, setSelectedGroup] = useState('All');
    const [teacherSearch, setTeacherSearch] = useState('');

    // Sort states
    const [sortBy, setSortBy] = useState('Subject');
    const [isDescending, setIsDescending] = useState(false);

    // Auto-select a valid year when data loads
    useEffect(() => {
        if (initialClasses.length > 0) {
            const availableYears = Array.from(new Set(initialClasses.map(c => c.year)));
            if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
                // Default to the first available year (or you can sort and pick the most recent)
                setSelectedYear(availableYears.sort().reverse()[0]); 
            }
        }
    }, [initialClasses, selectedYear]);

    // Derived metadata sets for filters
    const years = useMemo(() => {
        const set = new Set(initialClasses.map(c => c.year));
        return Array.from(set).sort();
    }, [initialClasses]);

    const subjects = useMemo(() => {
        const set = new Set(initialClasses.map(c => c.subject));
        return Array.from(set).sort();
    }, [initialClasses]);

    const groups = useMemo(() => {
        const set = new Set();
        initialClasses.forEach(c => {
            if (c.group && c.group !== 'Unknown Group') {
                c.group.split(', ').forEach(g => set.add(g));
            }
        });
        return Array.from(set).sort();
    }, [initialClasses]);

    // Filtering logic
    const filteredClasses = useMemo(() => {
        return initialClasses.filter((cls) => {
            const matchesYear = cls.year === selectedYear;
            const matchesSubject = selectedSubject === 'All' || cls.subject === selectedSubject;
            
            const matchesGroup = selectedGroup === 'All' || cls.group.split(', ').includes(selectedGroup);
            
            const matchesTeacher = teacherSearch.trim() === '' || 
                cls.teacher.toLowerCase().includes(teacherSearch.toLowerCase());

            return matchesYear && matchesSubject && matchesGroup && matchesTeacher;
        });
    }, [initialClasses, selectedYear, selectedSubject, selectedGroup, teacherSearch]);

    // Sorting logic
    const sortedClasses = useMemo(() => {
        const sorted = [...filteredClasses];
        sorted.sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'Subject') {
                comparison = a.subject.localeCompare(b.subject);
            } else if (sortBy === 'Teacher') {
                comparison = a.teacher.localeCompare(b.teacher);
            } else if (sortBy === 'Grade') {
                comparison = a.group.localeCompare(b.group);
            } else if (sortBy === 'Recent') {
                // Mock sorting by complete first, then incomplete
                comparison = (b.isComplete ? 1 : 0) - (a.isComplete ? 1 : 0);
            }
            return isDescending ? -comparison : comparison;
        });
        return sorted;
    }, [filteredClasses, sortBy, isDescending]);

    const handleToggleDirection = () => {
        setIsDescending(!isDescending);
    };

    return (
        <div>
            {/* Filter controls */}
            <ClassFilters
                selectedYear={selectedYear}
                selectedSubject={selectedSubject}
                selectedGroup={selectedGroup}
                teacherSearch={teacherSearch}
                years={years}
                subjects={subjects}
                groups={groups}
                onYearChange={setSelectedYear}
                onSubjectChange={setSelectedSubject}
                onGroupChange={setSelectedGroup}
                onTeacherSearchChange={setTeacherSearch}
            />

            {/* Sort bar control */}
            <ClassSortBar
                sortBy={sortBy}
                onSortChange={setSortBy}
                isDescending={isDescending}
                onToggleDirection={handleToggleDirection}
            />

            {/* Classes Grid */}
            {sortedClasses.length === 0 ? (
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 text-center text-on-surface-variant font-body-md shadow-sm">
                    No classes found matching selected filter criteria.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {sortedClasses.map((cls, index) => (
                        <ClassGridCard
                            key={cls.id || index}
                            year={cls.year}
                            subject={cls.subject}
                            teacher={cls.teacher}
                            group={cls.group}
                            schedule={cls.schedule}
                            studentsCount={cls.studentsCount}
                            isComplete={cls.isComplete}
                            onClick={() => onClassClick && onClassClick(cls)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
