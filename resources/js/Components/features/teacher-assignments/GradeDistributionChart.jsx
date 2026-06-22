import React, { useEffect, useState } from 'react';

export default function GradeDistributionChart({ data }) {
    // data = [{ label: '90-100', percentage: 66, colorClass: 'bg-primary-container' }, ...]
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Trigger the animation shortly after mount
        const timer = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="p-stack-md bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
            <h3 className="font-label-md text-label-md text-on-surface mb-stack-md">Grade Distribution</h3>
            <div className="h-32 flex items-end justify-between px-2 gap-4">
                {data.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end">
                        <div 
                            className={`w-full ${item.colorClass} rounded-t-lg transition-all duration-[600ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]`} 
                            style={{ 
                                height: mounted ? `${item.percentage}%` : '0%',
                                transitionDelay: `${idx * 100}ms`
                            }}
                        ></div>
                        <span className="mt-2 text-[10px] text-on-surface-variant font-medium">{item.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
