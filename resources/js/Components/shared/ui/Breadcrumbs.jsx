import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';

export default function Breadcrumbs() {
    const { url } = usePage();
    // url might be like '/admin/accounts/1/edit?foo=bar'
    const pathname = url.split('?')[0];
    const pathnames = pathname.split('/').filter((x) => x);

    if (pathnames.length === 0) return null;

    // Format segments nicely
    const formatLabel = (str) => {
        // If it's a purely numeric ID, format it as #ID
        if (!isNaN(str)) return `#${str}`;
        // Otherwise, capitalize first letter and replace dashes
        return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
    };

    return (
        <nav aria-label="Breadcrumb" className="flex items-center text-sm font-medium text-on-surface-variant overflow-x-auto whitespace-nowrap pb-1">
            <Link href="/" className="hover:text-primary transition-colors flex items-center" title="Home">
                <Icon name="home" className="text-[18px]" />
            </Link>
            {pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;

                return (
                    <React.Fragment key={to}>
                        <Icon name="chevron_right" className="text-[18px] mx-1 opacity-50" />
                        {isLast ? (
                            <span className="text-on-surface font-semibold" aria-current="page">
                                {formatLabel(value)}
                            </span>
                        ) : (
                            <Link href={to} className="hover:text-primary transition-colors">
                                {formatLabel(value)}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
}
