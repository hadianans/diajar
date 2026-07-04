import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';

export default function StudentListCard({ classId, studentId, name, group, avatar, completion, grade, assmScore, isUrgent = false, srlBadge = false }) {
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
        router.visit(route('teacher.classes.students.show', { classId: classId, studentId: studentId }));
    };

    let progressBarColor = 'bg-secondary';
    if (completion < 30 || isUrgent) {
        progressBarColor = 'bg-error';
    } else if (completion < 70) {
        progressBarColor = 'bg-tertiary';
    }

    return (
        <div 
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`bg-surface-container-lowest p-4 rounded-xl shadow-[0_1px_3px_0_rgba(15,23,42,0.05)] border border-outline-variant flex items-center gap-4 transition-transform cursor-pointer ${isHovered ? 'bg-surface-variant scale-[0.98]' : 'active:scale-[0.98]'}`}
        >
            <div className={`w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ${isUrgent ? 'border-2 border-error' : ''}`}>
                <img className="w-full h-full object-cover" alt={name} src={avatar} />
            </div>
            
            <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-headline-md text-headline-md text-on-surface truncate">{name}</h3>
                    <span className="bg-surface-container text-on-surface-variant px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{group}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-on-surface-variant">
                    <div className="flex-grow w-full">
                        <div className="flex justify-between items-center mb-1">
                            <span className={`text-[10px] font-semibold ${isUrgent ? 'text-error' : (completion < 70 ? 'text-tertiary' : '')}`}>
                                {completion}% Completion
                            </span>
                            {isUrgent && <Icon name="priority_high" className="text-error text-sm" />}
                            {!isUrgent && completion < 70 && <Icon name="warning" className="text-tertiary text-sm" />}
                        </div>
                        <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                            <div className={`h-full ${progressBarColor}`} style={{ width: `${completion}%` }}></div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-between sm:justify-end mt-1 sm:mt-0">
                        <div className="text-left sm:text-right flex sm:block items-center gap-2 sm:gap-0">
                            <div className={`text-[10px] font-bold ${isUrgent ? 'text-error' : (completion >= 80 ? 'text-primary' : 'text-on-surface')}`}>
                                {grade} Grade
                            </div>
                            <div className="text-[10px] text-on-surface-variant">{assmScore}% Assm.</div>
                        </div>
                        {srlBadge ? (
                            <Icon name="workspace_premium" className="text-tertiary fill-1" style={{ fontVariationSettings: "'FILL' 1" }} title="SRL Badge Active" />
                        ) : (
                            <Icon name="workspace_premium" className="text-outline-variant opacity-20" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
