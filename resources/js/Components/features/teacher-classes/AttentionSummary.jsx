import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function AttentionSummary({ count, message }) {
    if (!count) return null;

    return (
        <div className="bg-error-container text-on-error-container p-3 rounded-xl mb-stack-md flex items-center gap-3 shadow-sm">
            <Icon name="warning" className="text-error" />
            <p className="font-label-md text-label-md">
                {count} students need attention ({message})
            </p>
        </div>
    );
}
