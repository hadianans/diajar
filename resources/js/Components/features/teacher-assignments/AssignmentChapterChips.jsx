import React, { useState } from 'react';

export default function AssignmentChapterChips() {
    const [activeChip, setActiveChip] = useState('All Chapters');

    const chips = [
        'All Chapters',
        'Cell Structure',
        'Molecular Basis',
        'Evolution'
    ];

    return (
        <section className="flex gap-2 overflow-x-auto hide-scrollbar py-2">
            {chips.map((chip) => (
                <button 
                    key={chip}
                    onClick={() => setActiveChip(chip)}
                    className={`px-4 py-2 rounded-full text-label-sm font-label-sm whitespace-nowrap transition-colors ${
                        activeChip === chip 
                            ? 'bg-primary text-on-primary border border-transparent' 
                            : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                >
                    {chip}
                </button>
            ))}
        </section>
    );
}
