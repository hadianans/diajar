import React, { useState } from 'react';
import Icon from '@/Components/shared/ui/Icon';

const linksConfig = {
    student: {
        desktop: [
            { label: 'Home', icon: 'home' },
            { label: 'Dashboard', icon: 'dashboard' },
            { label: 'Subject', icon: 'book' },
            { label: 'Assignment', icon: 'assignment' },
            { label: 'Assessment', icon: 'analytics' },
        ],
        mobile: [
            { label: 'Assessment', icon: 'analytics' },
            { label: 'Assignment', icon: 'assignment' },
            { label: 'Home', icon: 'home' },
            { label: 'Subject', icon: 'book' },
            { label: 'Dashboard', icon: 'dashboard' },
        ]
    },
    teacher: {
        desktop: [
            { label: 'Home', icon: 'home' },
            { label: 'Class', icon: 'school' },
            { label: 'Chapter', icon: 'menu_book' },
            { label: 'Assignment', icon: 'assignment' },
            { label: 'Assessment', icon: 'analytics' },
        ],
        mobile: [
            { label: 'Assessment', icon: 'analytics' },
            { label: 'Assignment', icon: 'assignment' },
            { label: 'Home', icon: 'home' },
            { label: 'Chapter', icon: 'menu_book' },
            { label: 'Class', icon: 'school' },
        ]
    },
    admin: {
        desktop: [
            { label: 'Dashboard', icon: 'dashboard' },
            { label: 'Account', icon: 'person' },
            { label: 'Academic', icon: 'group' },
        ],
        mobile: [
            { label: 'Account', icon: 'person' },
            { label: 'Dashboard', icon: 'dashboard' },
            { label: 'Academic', icon: 'group' },
        ]
    }
};

const userDetails = {
    student: {
        name: 'Alex Student',
        roleLabel: 'Grade 10 Student',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO96RRqPjWuENuxmWrWN6BjLgdQLUvrv5ZgMv3i2n1j1sSUr3vdrOaWU1omcaIPYPL5kZ8e4l1G9-cYGdAcx7wcTQLIgNSDRZjgvAV1r-bEGK104N9bTMYsHX3sG6j4Nva0uMpU4O-4tkGiZ9VfOkM9tTDR_L9BLxbvianKE3gXbaR0WEazzeftxzZxS50VipelMYawOOgNbBstF8S-K6vw3DXqnYmQwPFwHHXpQQ2VUa28EW2GqDZKfbGcaOAexAtnz4qC2W92Vw'
    },
    teacher: {
        name: 'Sarah Teacher',
        roleLabel: 'Subject Instructor',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO96RRqPjWuENuxmWrWN6BjLgdQLUvrv5ZgMv3i2n1j1sSUr3vdrOaWU1omcaIPYPL5kZ8e4l1G9-cYGdAcx7wcTQLIgNSDRZjgvAV1r-bEGK104N9bTMYsHX3sG6j4Nva0uMpU4O-4tkGiZ9VfOkM9tTDR_L9BLxbvianKE3gXbaR0WEazzeftxzZxS50VipelMYawOOgNbBstF8S-K6vw3DXqnYmQwPFwHHXpQQ2VUa28EW2GqDZKfbGcaOAexAtnz4qC2W92Vw'
    },
    admin: {
        name: 'Admin User',
        roleLabel: 'Lead Administrator',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO96RRqPjWuENuxmWrWN6BjLgdQLUvrv5ZgMv3i2n1j1sSUr3vdrOaWU1omcaIPYPL5kZ8e4l1G9-cYGdAcx7wcTQLIgNSDRZjgvAV1r-bEGK104N9bTMYsHX3sG6j4Nva0uMpU4O-4tkGiZ9VfOkM9tTDR_L9BLxbvianKE3gXbaR0WEazzeftxzZxS50VipelMYawOOgNbBstF8S-K6vw3DXqnYmQwPFwHHXpQQ2VUa28EW2GqDZKfbGcaOAexAtnz4qC2W92Vw'
    }
};

export default function RoleNavbar({ role = 'admin', activeTab, onTabChange }) {
    const activeRole = role.toLowerCase();
    const config = linksConfig[activeRole] || linksConfig.admin;
    const user = userDetails[activeRole] || userDetails.admin;

    const currentActiveTab = activeTab || (activeRole === 'admin' ? 'Academic' : 'Dashboard');

    return (
        <>
            {/* Desktop Side Navigation */}
            <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full z-40 p-stack-md bg-surface-container-low w-72 rounded-r-xl shadow-sm border-r border-outline-variant">
                <div className="mb-10 mt-20 px-4">
                    <span className="text-headline-md font-headline-md font-bold text-primary">Diajar Admin</span>
                    <div className="mt-8 flex items-center gap-3 p-3 bg-surface-container rounded-xl">
                        <img
                            className="w-10 h-10 rounded-full bg-surface-dim object-cover"
                            src={user.avatar}
                            alt={user.name}
                        />
                        <div className="flex flex-col">
                            <span className="font-label-md text-label-md text-on-surface whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px]">{user.name}</span>
                            <span className="text-[11px] text-on-surface-variant whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px]">{user.roleLabel}</span>
                        </div>
                    </div>
                </div>
                <nav className="flex flex-col gap-2 px-2">
                    {config.desktop.map((item) => {
                        const isActive = currentActiveTab.toLowerCase() === item.label.toLowerCase();
                        return (
                            <button
                                key={item.label}
                                onClick={() => onTabChange && onTabChange(item.label)}
                                className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all text-left ${
                                    isActive
                                        ? 'bg-secondary-container text-on-secondary-container font-bold scale-[0.98]'
                                        : 'text-on-surface-variant hover:bg-surface-container-highest'
                                }`}
                                type="button"
                            >
                                <Icon name={item.icon} style={{ fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0' }} />
                                <span className="font-label-md">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center bg-surface-container-lowest shadow-lg border-t border-outline-variant h-16 px-1">
                {config.mobile.map((item) => {
                    const isActive = currentActiveTab.toLowerCase() === item.label.toLowerCase();
                    return (
                        <div key={item.label} className="flex-1 flex justify-center">
                            <button
                                onClick={() => onTabChange && onTabChange(item.label)}
                                className={`flex flex-col items-center justify-center w-full max-w-[72px] py-1 px-1 rounded-xl transition-all ${
                                    isActive
                                        ? 'bg-primary-container text-on-primary-container font-bold'
                                        : 'text-on-surface-variant'
                                }`}
                                type="button"
                            >
                                <Icon name={item.icon} style={{ fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0' }} className="text-[20px]" />
                                <span className="text-[10px] mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis w-full text-center font-medium">
                                    {item.label}
                                </span>
                            </button>
                        </div>
                    );
                })}
            </nav>
        </>
    );
}
