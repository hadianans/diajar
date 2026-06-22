import React, { useEffect, useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function SuccessOverlay({ show }) {
    const [progressWidth, setProgressWidth] = useState(0);

    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                setProgressWidth(100);
            }, 100);
            return () => clearTimeout(timer);
        } else {
            setProgressWidth(0);
        }
    }, [show]);

    return (
        <div
            className={`fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-margin-mobile transition-opacity duration-300 ${
                show ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
        >
            <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl max-w-[320px] w-full text-center shadow-xl">
                <div className="w-16 h-16 bg-primary-container/20 text-primary-container rounded-full mx-auto mb-md flex items-center justify-center">
                    <Icon
                        name="check_circle"
                        className="text-[40px]"
                        style={{ fontVariationSettings: '"FILL" 1' }}
                    />
                </div>
                <h2 className="font-headline-md text-headline-md mb-xs text-on-surface">
                    Login Successful
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-md">
                    Welcome back! Redirecting to your dashboard...
                </p>
                <div className="w-full bg-surface-container-low h-1 rounded-full overflow-hidden">
                    <div
                        className="bg-primary h-full transition-all duration-[2000ms]"
                        style={{ width: `${progressWidth}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
