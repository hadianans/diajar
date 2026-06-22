import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function ClassFilters({
    selectedYear,
    selectedSubject,
    selectedGroup,
    teacherSearch,
    years = [],
    subjects = [],
    groups = [],
    onYearChange,
    onSubjectChange,
    onGroupChange,
    onTeacherSearchChange
}) {
    return (
        <section className="mb-stack-lg">
            <div className="flex overflow-x-auto no-scrollbar gap-stack-sm pb-2 -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0">
                
                {/* Academic Year Filter */}
                <div className="min-w-[140px] flex-shrink-0">
                    <label className="block text-[10px] uppercase font-bold text-outline mb-1 px-1 tracking-wider">
                        Year
                    </label>
                    <select
                        value={selectedYear}
                        onChange={(e) => onYearChange && onYearChange(e.target.value)}
                        className="w-full bg-surface-container-low border-none rounded-xl text-label-md font-label-md py-2 px-3 focus:ring-2 focus:ring-primary-container cursor-pointer"
                    >
                        {years.map((yr) => (
                            <option key={yr} value={yr}>{yr}</option>
                        ))}
                    </select>
                </div>

                {/* Subject Filter */}
                <div className="min-w-[140px] flex-shrink-0">
                    <label className="block text-[10px] uppercase font-bold text-outline mb-1 px-1 tracking-wider">
                        Subject
                    </label>
                    <select
                        value={selectedSubject}
                        onChange={(e) => onSubjectChange && onSubjectChange(e.target.value)}
                        className="w-full bg-surface-container-low border-none rounded-xl text-label-md font-label-md py-2 px-3 focus:ring-2 focus:ring-primary-container cursor-pointer"
                    >
                        <option value="All">All Subjects</option>
                        {subjects.map((sub) => (
                            <option key={sub} value={sub}>{sub}</option>
                        ))}
                    </select>
                </div>

                {/* Teacher Search Input */}
                <div className="min-w-[200px] flex-grow">
                    <label className="block text-[10px] uppercase font-bold text-outline mb-1 px-1 tracking-wider">
                        Teacher
                    </label>
                    <div className="relative">
                        <Icon
                            name="search"
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm"
                        />
                        <input
                            value={teacherSearch}
                            onChange={(e) => onTeacherSearchChange && onTeacherSearchChange(e.target.value)}
                            className="w-full bg-surface-container-low border-none rounded-xl text-label-md font-label-md py-2 pl-9 pr-3 focus:ring-2 focus:ring-primary-container"
                            placeholder="Filter by teacher..."
                            type="text"
                        />
                    </div>
                </div>

                {/* Group Filter */}
                <div className="min-w-[140px] flex-shrink-0">
                    <label className="block text-[10px] uppercase font-bold text-outline mb-1 px-1 tracking-wider">
                        Group
                    </label>
                    <select
                        value={selectedGroup}
                        onChange={(e) => onGroupChange && onGroupChange(e.target.value)}
                        className="w-full bg-surface-container-low border-none rounded-xl text-label-md font-label-md py-2 px-3 focus:ring-2 focus:ring-primary-container cursor-pointer"
                    >
                        <option value="All">All Groups</option>
                        {groups.map((grp) => (
                            <option key={grp} value={grp}>{grp}</option>
                        ))}
                    </select>
                </div>

            </div>
        </section>
    );
}
