import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function QuickAccess({ items = [] }) {
    return (
        <div>
            <h4 className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant mb-4">
                Quick Access
            </h4>
            <div className="grid grid-cols-2 gap-4">
                {items.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={item.onClick}
                        className="bg-white p-4 rounded-2xl border border-outline-variant flex flex-col items-center justify-center text-center gap-2 hover:bg-primary-container/5 hover:border-primary/30 transition-all duration-300 group shadow-sm active:scale-[0.97] w-full"
                        type="button"
                    >
                        <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-300 flex-shrink-0">
                            <Icon name={item.icon} />
                        </div>
                        <span className="font-label-md text-label-md text-on-surface font-semibold">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
