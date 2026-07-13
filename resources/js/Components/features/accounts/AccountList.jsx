import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import RoleFilterTabs from '@/Components/features/accounts/RoleFilterTabs';
import AccountSearchBar from '@/Components/features/accounts/AccountSearchBar';
import AccountListItem from './AccountListItem';
import Icon from '@/Components/shared/ui/Icon';
import useApiGet from '@/hooks/useApiGet';

export default function AccountList({ onCreateClick }) {
    const [search, setSearch] = useState('');
    const [activeRole, setActiveRole] = useState('all');
    const [sortAsc, setSortAsc] = useState(true);
    const [page, setPage] = useState(1);
    
    // Debounce search
    const [debouncedSearch, setDebouncedSearch] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);
    
    // reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [activeRole, debouncedSearch, sortAsc]);

    const sortParam = sortAsc ? 'name' : 'name_desc'; // API might need adjustment, but 'name' works for now, API supports name, newest, role
    
    const queryParams = new URLSearchParams();
    if (activeRole !== 'all') queryParams.append('role', activeRole);
    if (debouncedSearch) queryParams.append('search', debouncedSearch);
    queryParams.append('sort', sortAsc ? 'name' : 'newest'); // Map our simple toggle to API sorts
    queryParams.append('page', page);

    const { data: apiResponse, loading } = useApiGet(`/users?${queryParams.toString()}`);
    
    const accounts = apiResponse?.users?.data || [];
    const pagination = apiResponse?.users;
    
    const counts = {
        all: (apiResponse?.admin_count || 0) + (apiResponse?.teacher_count || 0) + (apiResponse?.student_count || 0),
        admin: apiResponse?.admin_count || 0,
        teacher: apiResponse?.teacher_count || 0,
        student: apiResponse?.student_count || 0,
    };

    const rolesConfig = [
        { id: 'all', label: 'All', count: counts.all },
        { id: 'admin', label: 'Admin', count: counts.admin },
        { id: 'teacher', label: 'Teacher', count: counts.teacher },
        { id: 'student', label: 'Student', count: counts.student },
    ];

    const handleMoreClick = (account) => {
        router.visit(`/admin/accounts/${account.id}`);
    };

    return (
        <div className="flex flex-col">
            <section className="flex justify-between items-end mb-stack-lg">
                <div>
                    <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Accounts</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                        {loading ? 'Loading...' : `${counts.all} accounts total`}
                    </p>
                </div>
                {onCreateClick && (
                    <button
                        onClick={onCreateClick}
                        className="bg-primary hover:bg-primary-container text-on-primary px-4 py-2.5 rounded-lg font-label-md text-label-md flex items-center gap-2 shadow-md active:scale-95 transition-transform"
                        type="button"
                    >
                        <Icon name="person_add" className="text-[20px]" />
                        Create Account
                    </button>
                )}
            </section>

            <RoleFilterTabs
                roles={rolesConfig}
                activeRole={activeRole}
                onRoleChange={setActiveRole}
            />

            <AccountSearchBar
                value={search}
                onChange={setSearch}
                onSortToggle={() => setSortAsc(!sortAsc)}
            />

            {loading ? (
                <div className="p-12 text-center text-on-surface-variant">Loading accounts...</div>
            ) : accounts.length > 0 ? (
                <div className="space-y-stack-sm mb-8">
                    {accounts.map((account) => (
                        <AccountListItem
                            key={account.id}
                            account={{
                                id: account.id,
                                name: account.full_name,
                                email: account.email,
                                role: account.role,
                                avatar: account.picture,
                                isActive: account.is_active,
                                gender: account.gender,
                                createdDate: new Date(account.created_at).toLocaleDateString()
                            }}
                            onMoreClick={() => handleMoreClick(account)}
                        />
                    ))}
                    
                    {/* Pagination Controls */}
                    {pagination?.last_page > 1 && (
                        <div className="flex justify-between items-center pt-4 mt-6 border-t border-outline-variant">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 bg-surface-container rounded-lg text-on-surface disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-on-surface-variant">
                                Page {page} of {pagination.last_page}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
                                disabled={page === pagination.last_page}
                                className="px-4 py-2 bg-surface-container rounded-lg text-on-surface disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="p-12 text-center flex flex-col items-center bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm mt-4">
                    <Icon name="search_off" className="text-6xl text-outline mb-4" />
                    <h4 className="text-lg font-bold text-on-surface mb-2">No accounts found</h4>
                    <p className="text-on-surface-variant mb-6 max-w-xs mx-auto">
                        We couldn't find any accounts matching "{search}".
                    </p>
                </div>
            )}
        </div>
    );
}
