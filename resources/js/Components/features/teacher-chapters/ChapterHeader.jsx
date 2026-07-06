import React from 'react';

export default function ChapterHeader({ title, description, coverImage }) {
    return (
        <section className="mb-stack-lg">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">{title}</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl leading-relaxed">
                        {description}
                    </p>
                </div>
                {/* {coverImage && (
                    <div className="hidden md:block w-32 h-32 rounded-xl overflow-hidden shadow-sm flex-shrink-0 ml-4">
                        <img 
                            className="w-full h-full object-cover" 
                            alt={title} 
                            src={coverImage}
                        />
                    </div>
                )} */}
            </div>
        </section>
    );
}
