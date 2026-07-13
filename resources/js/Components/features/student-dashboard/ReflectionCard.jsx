import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function ReflectionCard({ 
    title, 
    subject, 
    date, 
    content, 
    teacherFeedback,
    isStale = false // used for older entries
}) {
    return (
        <div className={`bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm transition-all hover:shadow-md ${isStale ? 'opacity-80' : ''}`}>
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h4 className="text-label-md font-bold">{title}</h4>
                    <span className="text-label-sm text-primary">{subject}</span>
                </div>
                <span className="text-label-sm text-outline">{date}</span>
            </div>
            
            <p className={`text-body-md text-on-surface-variant ${teacherFeedback ? 'mb-4' : ''}`}>
                "{content}"
            </p>
            
            {teacherFeedback && (
                <div className="bg-surface-container-low p-3 rounded-lg border-l-4 border-l-secondary flex gap-3">
                    <Icon name="chat_bubble" className="text-secondary" style={{ fontVariationSettings: "'FILL' 1" }} />
                    <div>
                        <p className="text-label-sm font-bold text-secondary">{teacherFeedback.author} (Instructor)</p>
                        <p className="text-label-sm text-on-surface-variant">{teacherFeedback.message}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
