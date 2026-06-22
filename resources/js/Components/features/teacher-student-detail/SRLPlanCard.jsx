import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function SRLPlanCard({ title, linkedChapter, targetDate, progress }) {
    return (
        <div className="bg-surface-container-high border border-primary-container/20 rounded-xl p-stack-md shadow-[0_4px_12px_rgba(15,23,42,0.05)] flex flex-col justify-between h-full">
            <div>
                <div className="flex items-center gap-2 mb-stack-sm">
                    <Icon name="psychology" className="text-primary" />
                    <h3 className="font-headline-md text-headline-md text-on-surface">Active SRL Plan</h3>
                </div>
                
                <div className="bg-surface-container-lowest p-stack-sm rounded-lg border border-outline-variant">
                    <p className="font-label-md text-label-md text-primary">{title}</p>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">Linked: {linkedChapter} • Target: {targetDate}</p>
                    
                    <div className="mt-stack-sm flex items-center gap-3">
                        <div className="flex-1 h-3 bg-surface-container-low rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${progress}%` }}></div>
                        </div>
                        <span className="font-label-sm text-label-sm text-on-surface">{progress}%</span>
                    </div>
                </div>
            </div>
            
            <div className="mt-stack-md flex justify-between items-center">
                <span className="inline-flex items-center gap-1 text-secondary font-label-sm text-label-sm bg-secondary-container/30 px-2 py-1 rounded">
                    <Icon name="check_circle" className="text-sm fill-1" style={{ fontVariationSettings: "'FILL' 1" }} />
                    On Track
                </span>
                <button className="text-primary font-label-md text-label-md hover:underline">
                    Update Plan
                </button>
            </div>
        </div>
    );
}
