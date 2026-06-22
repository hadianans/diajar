import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function DangerZone({ title = 'Danger Zone', description = 'Once you delete an account, there is no going back.', buttonLabel = 'Delete Account', onDelete }) {
    return (
        <div className="mt-8 pt-8 border-t border-outline-variant">
            <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-error-container/10 border border-error-container/30 rounded-xl gap-4">
                <div>
                    <h4 className="font-label-md text-error font-bold">{title}</h4>
                    <p className="font-label-sm text-on-surface-variant">{description}</p>
                </div>
                {onDelete && (
                    <button
                        onClick={onDelete}
                        className="flex items-center justify-center gap-2 bg-error text-on-error px-6 py-2.5 rounded-lg font-label-md hover:bg-error/90 transition-all shadow-sm active:scale-[0.97] flex-shrink-0"
                        type="button"
                    >
                        <Icon name="delete_forever" className="text-[20px]" />
                        {buttonLabel}
                    </button>
                )}
            </div>
        </div>
    );
}
