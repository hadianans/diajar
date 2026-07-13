import React from 'react';

export default function LoginTemplate({ header, children, footer, overlay }) {
    return (
        <div className="bg-background text-on-surface min-h-screen flex flex-col justify-center items-center px-margin-mobile relative overflow-x-hidden">
            {/* Global Background Elements (Subtle) */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -right-[5%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[10%] -left-[5%] w-[300px] h-[300px] bg-secondary/5 rounded-full blur-3xl"></div>
            </div>

            {/* Main Login Container */}
            <main className="w-full max-w-[400px] flex flex-col items-center animate-fade-in py-lg px-md">
                {header}

                {/* Login Form Card */}
                <section className="w-full bg-surface-container-lowest border border-outline-variant p-md rounded-xl login-card">
                    {children}
                </section>

                {footer}
            </main>

            {overlay}
        </div>
    );
}
