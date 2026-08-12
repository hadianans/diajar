import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';

const linksConfig = {
    student: {
        desktop: [
            { label: 'Beranda', icon: 'home', href: '/student/homepage' },
            { label: 'Dashboard', icon: 'dashboard', href: '/student/dashboard' },
            { label: 'Mapel', icon: 'book', href: '/student/subjects' },
            { label: 'Tugas', icon: 'assignment', href: '/student/assignments' },
            { label: 'Asesmen', icon: 'analytics', href: '/student/assessments' },
        ],
        mobile: [
            { label: 'Asesmen', icon: 'analytics', href: '/student/assessments' },
            { label: 'Tugas', icon: 'assignment', href: '/student/assignments' },
            { label: 'Home', icon: 'home', href: '/student/homepage' },
            { label: 'Mapel', icon: 'book', href: '/student/subjects' },
            { label: 'Dashboard', icon: 'dashboard', href: '/student/dashboard' },
        ]
    },
    teacher: {
        desktop: [
            { label: 'Beranda', icon: 'home', href: '/teacher/homepage' },
            { label: 'Kelas', icon: 'school', href: '/teacher/classes' },
            { label: 'Materi', icon: 'menu_book', href: '/teacher/chapters' },
            { label: 'Tugas', icon: 'assignment', href: '/teacher/assignments' },
            { label: 'Asesmen', icon: 'analytics', href: '/teacher/assessments' },
        ],
        mobile: [
            { label: 'Asesmen', icon: 'analytics', href: '/teacher/assessments' },
            { label: 'Tugas', icon: 'assignment', href: '/teacher/assignments' },
            { label: 'Beranda', icon: 'home', href: '/teacher/homepage' },
            { label: 'Materi', icon: 'menu_book', href: '/teacher/chapters' },
            { label: 'Kelas', icon: 'school', href: '/teacher/classes' },
        ]
    },
    admin: {
        desktop: [
            { label: 'Dashboard', icon: 'dashboard', href: '/admin/homepage' },
            { label: 'Akun', icon: 'person', href: '/admin/accounts' },
            { label: 'Akademik', icon: 'group', href: '/admin/academic' },
            { label: 'Kelas', icon: 'school', href: '/admin/classes' },
        ],
        mobile: [
            { label: 'Akun', icon: 'person', href: '/admin/accounts' },
            { label: 'Dashboard', icon: 'dashboard', href: '/admin/homepage' },
            { label: 'Akademik', icon: 'group', href: '/admin/academic' },
            { label: 'Kelas', icon: 'school', href: '/admin/classes' },
        ]
    }
};

export default function RoleNavbar({ activeTab, onTabChange }) {
    const page = usePage();
    const auth = page.props?.auth;
    const user = auth?.user || {};
    const role = user.role || 'admin';
    const activeRole = role.toLowerCase();

    const config = linksConfig[activeRole] || linksConfig.admin;

    // Ensure we have a default active tab based on role if none is provided
    const currentActiveTab = activeTab || (activeRole === 'admin' ? 'Dashboard' : 'Home');
    const pathname = (page.url || '').split('?')[0];

    const hasUrlMatch = (items) => items.some(item =>
        item.href && item.href !== '#' && item.href !== '/' &&
        (pathname === item.href || pathname.startsWith(item.href + '/'))
    );
    const useUrlMatchOnly = hasUrlMatch(config.desktop.concat(config.mobile));

    const checkIsActive = (item) => {
        // 1. Precise URL match has priority
        if (item.href && item.href !== '#' && item.href !== '/') {
            if (pathname === item.href || pathname.startsWith(item.href + '/')) {
                return true;
            }
        }
        if (useUrlMatchOnly) {
            return false;
        }

        // 2. Fall back to activeTab prop matching
        if (!currentActiveTab) return false;
        const tab = currentActiveTab.toLowerCase();
        const label = item.label.toLowerCase();

        if (tab === label) return true;
        if (tab === label + 's' || tab + 's' === label) return true;
        if (tab.replace(/s$/, '') === label.replace(/s$/, '')) return true;

        // Custom aliases for existing page props
        if (label === 'assignment' && (tab === 'tasks' || tab === 'assignments')) return true;
        if (label === 'assessment' && (tab === 'assessments' || tab === 'quizzes' || tab === 'exams')) return true;
        if (label === 'class' && tab === 'classes') return true;
        if (label === 'chapter' && tab === 'chapters') return true;
        if (label === 'subject' && tab === 'subjects') return true;
        if (label === 'account' && tab === 'accounts') return true;

        return false;
    };

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
                        const isActive = checkIsActive(item);
                        return (
                            <Link
                                key={item.label}
                                href={item.href || '#'}
                                onClick={() => onTabChange && onTabChange(item.label)}
                                className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all text-left ${isActive
                                    ? 'bg-primary-container text-on-primary-container font-bold scale-[0.98] shadow-sm'
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
                    const isActive = checkIsActive(item);
                    return (
                        <div key={item.label} className="flex-1 flex justify-center">
                            <Link
                                href={item.href || '#'}
                                onClick={() => onTabChange && onTabChange(item.label)}
                                className={`flex flex-col items-center justify-center w-full max-w-[72px] py-1 px-1 rounded-xl transition-all ${isActive
                                    ? 'bg-primary-container text-on-primary-container font-bold shadow-sm scale-95'
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
