import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function WarningBox({ title, description, buttonLabel, onButtonClick }) {
    return (
        <div className="tonal-layer rounded-xl overflow-hidden border-tertiary border-l-4 shadow-sm bg-surface-container-lowest">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Icon name="group" className="text-tertiary text-2xl" />
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Linked Groups</h3>
                </div>
                <div className="bg-tertiary-container/10 border border-tertiary-container/20 rounded-xl p-6 flex flex-col md:flex-row gap-5 items-start md:items-center">
                    <div className="bg-tertiary-container p-3 rounded-full flex items-center justify-center text-on-tertiary-container flex-shrink-0">
                        <Icon name="warning" style={{ fontVariationSettings: "'FILL' 1" }} />
                    </div>
                    <div className="flex-grow">
                        <p className="font-body-lg text-on-surface mb-2 font-semibold">{title}</p>
                        <p className="font-body-md text-on-surface-variant leading-relaxed">
                            {description}
                        </p>
                    </div>
                    {buttonLabel && onButtonClick && (
                        <button
                            onClick={onButtonClick}
                            className="bg-tertiary-container text-on-tertiary-container px-6 py-2.5 rounded-lg font-label-md hover:brightness-110 transition-all whitespace-nowrap shadow-sm active:scale-[0.97] flex-shrink-0"
                            type="button"
                        >
                            {buttonLabel}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
