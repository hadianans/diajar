import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function LatestReflectionCard({ taskName, comment, rating, feeling, feelingEmoji }) {
    return (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-[0_4px_12px_rgba(15,23,42,0.05)] flex flex-col h-full">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-stack-md">Latest Reflection</h3>
            
            <div className="bg-surface-container-low rounded-lg p-stack-sm flex-grow">
                <p className="font-label-sm text-label-sm text-primary mb-1">{taskName}</p>
                <p className="font-body-md text-body-md italic text-on-surface-variant">"{comment}"</p>
                
                <div className="mt-stack-md grid grid-cols-2 gap-2">
                    <div className="bg-surface-container-lowest p-2 rounded border border-outline-variant text-center">
                        <p className="font-label-sm text-label-sm text-outline">Comprehension</p>
                        <div className="flex justify-center text-primary mt-1">
                            {[...Array(5)].map((_, i) => (
                                <Icon key={i} name="star" className="text-sm fill-1" style={{ fontVariationSettings: "'FILL' 1" }} />
                            ))}
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest p-2 rounded border border-outline-variant text-center flex flex-col items-center justify-center">
                        <p className="font-label-sm text-label-sm text-outline">Feeling</p>
                        <p className="text-lg mt-1">{feelingEmoji} {feeling}</p>
                    </div>
                </div>
                
                <div className="mt-2 text-center">
                    <p className="font-label-sm text-label-sm text-outline">Material Quality: {rating}/5</p>
                </div>
            </div>
            
            <button className="w-full mt-stack-md border border-primary text-primary py-2 rounded-lg font-label-md text-label-md hover:bg-primary-container/10 transition-colors active:scale-95">
                View All Reflections
            </button>
        </div>
    );
}
