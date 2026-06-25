import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';

const linksConfig = {
    student: {
        desktop: [
            { label: 'Home', icon: 'home', href: '/student/homepage' },
            { label: 'Dashboard', icon: 'dashboard', href: '/student/dashboard' },
            { label: 'Subject', icon: 'book', href: '/student/subjects' },
            { label: 'Assignment', icon: 'assignment', href: '/student/assignments' },
            { label: 'Assessment', icon: 'analytics', href: '/student/assessments' },
            { label: 'Gradebook', icon: 'grade', href: '/student/gradebook' },
        ],
        mobile: [
            { label: 'Assessment', icon: 'analytics', href: '/student/assessments' },
            { label: 'Assignment', icon: 'assignment', href: '/student/assignments' },
            { label: 'Home', icon: 'home', href: '/student/homepage' },
            { label: 'Subject', icon: 'book', href: '/student/subjects' },
            { label: 'Gradebook', icon: 'grade', href: '/student/gradebook' },
        ]
    },
    teacher: {
        desktop: [
            { label: 'Home', icon: 'home', href: '/teacher/homepage' },
            { label: 'Class', icon: 'school', href: '/teacher/classes' },
            { label: 'Chapter', icon: 'menu_book', href: '/teacher/chapters' },
            { label: 'Assignment', icon: 'assignment', href: '/teacher/assignments' },
            { label: 'Assessment', icon: 'analytics', href: '/teacher/assessments' },
        ],
        mobile: [
            { label: 'Assessment', icon: 'analytics', href: '/teacher/assessments' },
            { label: 'Assignment', icon: 'assignment', href: '/teacher/assignments' },
            { label: 'Home', icon: 'home', href: '/teacher/homepage' },
            { label: 'Chapter', icon: 'menu_book', href: '/teacher/chapters' },
            { label: 'Class', icon: 'school', href: '/teacher/classes' },
        ]
    },
    admin: {
        desktop: [
            { label: 'Dashboard', icon: 'dashboard', href: '/admin/homepage' },
            { label: 'Account', icon: 'person', href: '/admin/accounts' },
            { label: 'Academic', icon: 'group', href: '/admin/academic' },
            { label: 'Classes', icon: 'school', href: '/admin/classes' },
        ],
        mobile: [
            { label: 'Account', icon: 'person', href: '/admin/accounts' },
            { label: 'Dashboard', icon: 'dashboard', href: '/admin/homepage' },
            { label: 'Academic', icon: 'group', href: '/admin/academic' },
            { label: 'Classes', icon: 'school', href: '/admin/classes' },
        ]
    }
};

export default function RoleNavbar({ activeTab, onTabChange }) {
    const { auth } = usePage().props;
    const user = auth?.user || {};
    const role = user.role || 'admin';
    const activeRole = role.toLowerCase();
    
    const config = linksConfig[activeRole] || linksConfig.admin;
    
    // Ensure we have a default active tab based on role if none is provided
    const currentActiveTab = activeTab || (activeRole === 'admin' ? 'Dashboard' : 'Home');
    
    const roleLabelMap = {
        admin: 'Lead Administrator',
        teacher: 'Subject Instructor',
        student: 'Student'
    };

    return (
        <>
            {/* Desktop Side Navigation */}
            <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full z-40 p-stack-md bg-surface-container-low w-72 rounded-r-xl shadow-sm border-r border-outline-variant">
                <div className="mb-10 mt-20 px-4">
                    <span className="text-headline-md font-headline-md font-bold text-primary">Diajar {role.charAt(0).toUpperCase() + role.slice(1)}</span>
                    <div className="mt-8 flex items-center gap-3 p-3 bg-surface-container rounded-xl">
                        <img
                            className="w-10 h-10 rounded-full bg-surface-dim object-cover"
                            src={user.picture || 'https://lh3.googleusercontent.com/a/default-user=s120'}
                            alt={user.full_name || 'User'}
                        />
                        <div className="flex flex-col">
                            <span className="font-label-md text-label-md text-on-surface whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px]">{user.full_name || 'Admin User'}</span>
                            <span className="text-[11px] text-on-surface-variant whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px]">{roleLabelMap[activeRole]}</span>
                        </div>
                    </div>
                </div>
                <nav className="flex flex-col gap-2 px-2">
                    {config.desktop.map((item) => {
                        const isActive = currentActiveTab.toLowerCase() === item.label.toLowerCase();
                        return (
                            <Link
                                key={item.label}
                                href={item.href || '#'}
                                onClick={() => onTabChange && onTabChange(item.label)}
                                className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all text-left ${
                                    isActive
                                        ? 'bg-secondary-container text-on-secondary-container font-bold scale-[0.98]'
                                        : 'text-on-surface-variant hover:bg-surface-container-highest'
                                }`}
                            >
                                <Icon name={item.icon} style={{ fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0' }} />
                                <span className="font-label-md">{item.label}</span>
                            </Link>
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
                            <Link
                                href={item.href || '#'}
                                onClick={() => onTabChange && onTabChange(item.label)}
                                className={`flex flex-col items-center justify-center w-full max-w-[72px] py-1 px-1 rounded-xl transition-all ${
                                    isActive
                                        ? 'bg-primary-container text-on-primary-container font-bold'
                                        : 'text-on-surface-variant'
                                }`}
                            >
                                <Icon name={item.icon} style={{ fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0' }} className="text-[20px]" />
                                <span className="text-[10px] mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis w-full text-center font-medium">
                                    {item.label}
                                </span>
                            </Link>
                        </div>
                    );
                })}
            </nav>
        </>
    );
}
