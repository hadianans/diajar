import React from 'react';
import { Link } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';

export default function ClassSidebar({ activeLink = 'student-list' }) {
    const links = [
        { id: 'student-list', icon: 'group', label: 'Student List', href: '#' },
        { id: 'performance', icon: 'trending_up', label: 'Class Performance', href: '#' },
        { id: 'curriculum', icon: 'map', label: 'Curriculum Map', href: '#' },
        { id: 'resources', icon: 'folder_open', label: 'Resource Library', href: '#' }
    ];

    return (
        <aside className="hidden md:flex fixed left-0 top-16 h-[calc(100vh-64px)] w-80 bg-surface border-r border-outline-variant flex-col p-stack-md z-40">
            <div className="flex items-center gap-4 mb-stack-lg p-2 rounded-lg bg-surface-container-low">
                <img 
                    className="w-12 h-12 rounded-full object-cover" 
                    alt="Teacher Profile" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbvABkV7nOAFAGrHRwrvQfm7eHtZJzv9B2i_s0AciAe6Eqb5jsRoXnqxK1YQUW_kwAafwBPWsEigQTIB3oal_FPkHlq3NcMVMdwI8Q5YJPQQDtzY9gBx-9ODcT3aQMiyW5WWDfA0pDup3nEyMf8F5Y2zD0U_7H0PTPx2PRq0QUyfWD6GJFh8VWN_vr8xQECTggsfHxCZTIIZU2rHZeEhoKxpf0Nc4ClPGmuNOOgGwVTua0gIBEiEGjjvq2SwZoMIpwFPDwKJJoL2Y" 
                />
                <div>
                    <p className="font-label-md text-label-md text-on-surface">Sarah Connor</p>
                    <p className="font-label-sm text-label-sm text-outline">Grade 11 Lead Teacher</p>
                </div>
            </div>
            
            <nav className="space-y-2">
                {links.map(link => {
                    const isActive = activeLink === link.id;
                    return (
                        <Link 
                            key={link.id}
                            href={link.href}
                            className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                                isActive 
                                    ? 'text-primary bg-secondary-container font-bold' 
                                    : 'text-on-surface-variant hover:bg-surface-container-high'
                            }`}
                        >
                            <Icon name={link.icon} />
                            <span className="font-body-md text-body-md">{link.label}</span>
                        </Link>
                    );
                })}
                
                <div className="pt-stack-lg mt-auto">
                    <Link href="#" className="flex items-center gap-4 p-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors">
                        <Icon name="settings" />
                        <span className="font-body-md text-body-md">Settings</span>
                    </Link>
                </div>
            </nav>
        </aside>
    );
}
