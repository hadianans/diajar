import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';

export default function ChapterListCard({ chapterId, number, title, description, materialsCount, assignmentsCount, assessmentsCount, completionProgress, onEdit, onDelete }) {
    const [isHovered, setIsHovered] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const handleClick = (e) => {
        if (e.target.closest('.dropdown-container')) return;
        router.visit(route('teacher.chapters.show', { chapterId }));
    };

    let progressColor = 'bg-secondary';
    let textProgressColor = 'text-secondary';
    if (completionProgress < 30) {
        progressColor = 'bg-error';
        textProgressColor = 'text-error';
    } else if (completionProgress < 70) {
        progressColor = 'bg-tertiary';
        textProgressColor = 'text-tertiary';
    }

    const formattedNumber = number.toString().padStart(2, '0');

    return (
        <div
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`bg-white p-6 rounded-xl border border-outline-variant shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] transition-transform cursor-pointer group ${isHovered ? 'translate-y-[-2px]' : ''}`}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-lg flex items-center justify-center font-headline-md shrink-0">
                        {formattedNumber}
                    </div>
                    <div>
                        <h3 className="font-headline-md text-on-surface group-hover:text-primary transition-colors">{title}</h3>
                        <p className="text-on-surface-variant font-body-md line-clamp-2">{description}</p>
                    </div>
                </div>
                <div className="relative dropdown-container">
                    <button 
                        className="p-1 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors" 
                        onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                    >
                        <Icon name="more_vert" />
                    </button>
                    {showMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}></div>
                            <div className="absolute right-0 mt-2 w-48 bg-surface-container-low border border-outline-variant rounded-xl shadow-lg z-20 overflow-hidden py-1">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit && onEdit(); }}
                                    className="w-full text-left px-4 py-3 hover:bg-surface-container-high text-on-surface font-body-md flex items-center gap-3 transition-colors"
                                >
                                    <Icon name="edit" className="text-[18px]" />
                                    Edit Chapter
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete && onDelete(); }}
                                    className="w-full text-left px-4 py-3 hover:bg-error-container/50 text-error font-body-md flex items-center gap-3 transition-colors"
                                >
                                    <Icon name="delete" className="text-[18px]" />
                                    Delete Chapter
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full text-on-surface-variant">
                    <Icon name="import_contacts" className="text-[18px]" />
                    <span className="text-label-md">{materialsCount} Materials</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full text-on-surface-variant">
                    <Icon name="assignment" className="text-[18px]" />
                    <span className="text-label-md">{assignmentsCount} Assignments</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full text-on-surface-variant">
                    <Icon name="quiz" className="text-[18px]" />
                    <span className="text-label-md">{assessmentsCount} {assessmentsCount === 1 ? 'Assessment' : 'Assessments'}</span>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-label-md text-on-surface-variant">Class Completion</span>
                    <span className={`text-label-md font-bold ${textProgressColor}`}>{completionProgress}%</span>
                </div>
                <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className={`h-full ${progressColor} transition-all duration-1000`} style={{ width: `${completionProgress}%` }}></div>
                </div>
            </div>
        </div>
    );
}
