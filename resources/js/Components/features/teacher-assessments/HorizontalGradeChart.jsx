import React, { useEffect, useState } from 'react';

export default function HorizontalGradeChart({ data }) {
    // data: [{ label: '90-100 (A)', count: 4, countLabel: '4 students', colorClass: 'bg-secondary', percentage: 25 }, ...]
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="lg:col-span-1 bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm">
            <h3 className="font-headline-md text-headline-md mb-6">Grade Distribution</h3>
            <div className="flex flex-col gap-5">
                {data.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                        <div className="flex justify-between font-label-sm text-label-sm mb-1">
                            <span>{item.label}</span>
                            <span className="font-bold">{item.countLabel}</span>
                        </div>
                        <div className="h-6 w-full bg-surface-container rounded-sm overflow-hidden">
                            <div 
                                className={`${item.colorClass} h-full rounded-sm transition-all duration-[800ms] ease-out`} 
                                style={{ 
                                    width: mounted ? `${item.percentage}%` : '0%',
                                    transitionDelay: `${idx * 100}ms`
                                }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
