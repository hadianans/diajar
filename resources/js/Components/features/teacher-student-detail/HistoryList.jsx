import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function HistoryList({ title, items = [], isAssessment = false }) {
    return (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-[0_4px_12px_rgba(15,23,42,0.05)] h-full">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-stack-md">{title}</h3>
            
            <div className="space-y-stack-sm">
                {items.map((item, idx) => (
                    <div key={idx} className={`flex items-center gap-4 p-3 hover:bg-surface-container-low rounded-lg transition-colors ${idx !== items.length - 1 && isAssessment ? 'border-b border-outline-variant pb-stack-sm' : ''}`}>
                        <div className={`${item.iconBg} p-2 rounded-lg ${item.iconColor}`}>
                            <Icon name={item.icon} />
                        </div>
                        <div className="flex-1">
                            <p className="font-label-md text-label-md text-on-surface">{item.title}</p>
                            <p className="font-label-sm text-label-sm text-outline">{item.subtitle}</p>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            <p className="font-label-md text-label-md text-on-surface">{item.score}</p>
                            {item.statusBadge ? (
                                <span className={`${item.statusBadgeBg} ${item.statusBadgeColor} text-[10px] px-1 rounded uppercase font-bold mt-1`}>
                                    {item.statusBadgeText}
                                </span>
                            ) : (
                                <p className="font-label-sm text-label-sm text-secondary mt-1">{item.statusText}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
