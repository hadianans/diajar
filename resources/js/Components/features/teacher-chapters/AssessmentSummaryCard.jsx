import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function AssessmentSummaryCard({ title, duration, attempts, totalStudents, averageScore, studentInitials = [] }) {
    return (
        <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 left-0 h-1 w-full bg-tertiary-container"></div>
            
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">{title}</h4>
                <Icon name="assessment" className="text-on-surface-variant text-[18px]" />
            </div>
            
            <p className="text-label-sm font-label-sm text-outline-variant mb-4">Duration: {duration} mins</p>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-surface-container-low p-2 rounded-lg">
                    <p className="text-[10px] text-outline-variant uppercase font-bold">Attempts</p>
                    <p className="font-headline-md text-headline-md text-on-surface">{attempts}/{totalStudents}</p>
                </div>
                <div className="bg-surface-container-low p-2 rounded-lg">
                    <p className="text-[10px] text-outline-variant uppercase font-bold">Avg. Score</p>
                    <p className="font-headline-md text-headline-md text-secondary">{averageScore}%</p>
                </div>
            </div>
            
            {studentInitials.length > 0 && (
                <div className="flex -space-x-2">
                    {studentInitials.slice(0, 3).map((initials, idx) => (
                        <div key={idx} className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container-high flex items-center justify-center text-[10px] font-bold">
                            {initials}
                        </div>
                    ))}
                    {studentInitials.length > 3 && (
                        <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container flex items-center justify-center text-[10px] font-bold text-outline">
                            +{studentInitials.length - 3}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
