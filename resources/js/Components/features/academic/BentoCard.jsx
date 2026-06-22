import React from 'react';

export default function BentoCard({ title, icon, children, className = '' }) {
    return (
        <div className={`glass-card p-6 rounded-xl shadow-sm ${className}`}>
            {(title || icon) && (
                <div className="flex items-center justify-between mb-4">
                    {title && <h3 className="font-label-md text-on-surface-variant">{title}</h3>}
                    {icon}
                </div>
            )}
            {children}
        </div>
    );
}
