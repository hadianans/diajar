import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function PromoBanner({ 
    title = 'New Course Alert', 
    description = 'Discover advanced learning opportunities starting next semester.', 
    buttonText = 'Explore now', 
    icon = 'science',
    onAction 
}) {
    return (
        <section className="relative overflow-hidden rounded-2xl bg-primary-container p-6 text-on-primary-container">
            <div className="relative z-10 flex flex-col gap-2">
                <h4 className="text-headline-md font-headline-md">{title}</h4>
                <p className="text-body-md font-body-md opacity-90 max-w-[70%]">{description}</p>
                <button 
                    onClick={onAction}
                    className="mt-2 w-fit px-6 py-2 bg-surface text-primary rounded-full font-label-md active:scale-95 transition-transform"
                >
                    {buttonText}
                </button>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
                <Icon name={icon} className="text-[120px]" />
            </div>
        </section>
    );
}
