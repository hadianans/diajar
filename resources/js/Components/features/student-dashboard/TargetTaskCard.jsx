import React, { useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function TargetTaskCard({ 
    title, 
    type, // 'Material', 'Assignment', 'Assessment'
    dueDate,
    description,
    isUrgent = false
}) {
    const [isChecked, setIsChecked] = useState(false);

    let typeIcon, typeColor;
    if (type === 'Material') {
        typeIcon = 'menu_book';
        typeColor = 'text-primary';
    } else if (type === 'Assignment') {
        typeIcon = 'assignment';
        typeColor = 'text-secondary';
    } else if (type === 'Assessment') {
        typeIcon = 'quiz';
        typeColor = 'text-tertiary';
    }

    return (
        <div 
            className={`bg-surface border border-outline-variant rounded-xl p-4 flex gap-4 items-start shadow-sm hover:bg-surface-container-low transition-all group ${
                isUrgent ? 'border-l-4 border-l-error' : ''
            } ${isChecked ? 'opacity-50 scale-[0.98]' : ''}`}
        >
            <div className="mt-1">
                <input 
                    className="w-6 h-6 rounded-md border-outline text-primary focus:ring-primary-container transition-all cursor-pointer" 
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}
                />
            </div>
            
            <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                    <h4 className="text-label-md font-label-md text-on-surface">{title}</h4>
                    <span className={`flex items-center gap-1 text-label-sm ${typeColor}`}>
                        <Icon name={typeIcon} className="text-[16px]" /> 
                        {type}
                    </span>
                </div>
                
                <p className={`text-label-sm mb-2 ${isUrgent ? 'text-error font-bold italic' : 'text-outline'}`}>
                    {dueDate}
                </p>
                <p className="text-body-md text-on-surface-variant line-clamp-1">{description}</p>
            </div>
        </div>
    );
}
