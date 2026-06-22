import React from 'react';

export default function EcosystemBanner({ imageUrl, title, subtitle }) {
    return (
        <section className="relative overflow-hidden rounded-2xl bg-primary h-[400px] shadow-xl w-full">
            <div className="absolute inset-0 z-0">
                <div
                    className="w-full h-full bg-cover bg-center opacity-60 mix-blend-overlay"
                    style={{ backgroundImage: `url('${imageUrl}')` }}
                ></div>
            </div>
            <div className="relative z-10 p-12 h-full flex flex-col justify-end">
                <h3 className="text-white font-headline-lg text-headline-lg max-w-md font-bold tracking-tight">
                    {title}
                </h3>
                <p className="text-primary-fixed-dim font-body-lg text-body-lg max-w-md mt-4 font-medium leading-relaxed">
                    {subtitle}
                </p>
            </div>
        </section>
    );
}
