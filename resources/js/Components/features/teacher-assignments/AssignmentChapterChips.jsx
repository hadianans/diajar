import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function AssignmentChapterChips({ chapters = [], selectedChapterId, onSelect }) {
    if (!chapters || chapters.length === 0) return null;

    return (
        <div className="flex gap-2 py-3 overflow-x-auto hide-scrollbar">
            <button
                onClick={() => onSelect?.(null)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors active:scale-95 ${
                    !selectedChapterId
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                }`}
            >
                All Chapters
            </button>
            {chapters.map(ch => (
                <button
                    key={ch.id}
                    onClick={() => onSelect?.(ch.id)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors active:scale-95 ${
                        selectedChapterId === ch.id
                            ? 'bg-primary text-on-primary shadow-sm'
                            : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                    }`}
                >
                    <Icon name="menu_book" className="text-[16px]" />
                    {ch.name}
                </button>
            ))}
        </div>
    );
}
