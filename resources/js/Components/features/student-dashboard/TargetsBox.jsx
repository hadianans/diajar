import React, { useState } from 'react';
import TargetItem from '@/Components/features/student-dashboard/TargetItem';

export default function TargetsBox({ initialTargets = [], onViewAllClick }) {
    const [targets, setTargets] = useState(initialTargets);

    const handleToggleTarget = (id) => {
        setTargets(prevTargets =>
            prevTargets.map(t =>
                t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
            )
        );
    };

    return (
        <section className="bg-white border border-outline-variant p-6 rounded-[24px] shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                    Your Targets
                </h3>
                {onViewAllClick && (
                    <button
                        onClick={onViewAllClick}
                        className="text-primary font-label-md text-label-md hover:underline font-semibold active:scale-95 transition-all duration-100"
                        type="button"
                    >
                        View All
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {targets.length === 0 ? (
                    <div className="py-6 text-center text-on-surface-variant text-label-md font-semibold">
                        No targets configured.
                    </div>
                ) : (
                    targets.map((target) => (
                        <TargetItem
                            key={target.id}
                            text={target.text}
                            isCompleted={target.isCompleted}
                            onToggle={() => handleToggleTarget(target.id)}
                        />
                    ))
                )}
            </div>
        </section>
    );
}
