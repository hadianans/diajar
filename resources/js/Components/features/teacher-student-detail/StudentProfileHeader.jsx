import React from 'react';

export default function StudentProfileHeader({ name, avatar, group, className, year }) {
    return (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-stack-md">
            <img 
                className="w-24 h-24 rounded-full object-cover border-4 border-surface-container" 
                alt={name} 
                src={avatar} 
            />
            <div className="flex-1 text-center md:text-left">
                <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">{name}</h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                    <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-label-sm text-label-sm">{group}</span>
                    <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm">{className}</span>
                    <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full font-label-sm text-label-sm">{year}</span>
                </div>
            </div>
        </div>
    );
}
