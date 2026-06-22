import React, { useState } from 'react';
import RoleFilterTabs from '@/Components/features/accounts/RoleFilterTabs';
import AccountSearchBar from '@/Components/features/accounts/AccountSearchBar';
import AccountListItem from './AccountListItem';
import Icon from '@/Components/shared/ui/Icon';

export default function AccountList({ initialAccounts = [], onCreateClick }) {
    const [search, setSearch] = useState('');
    const [activeRole, setActiveRole] = useState('all');
    const [sortAsc, setSortAsc] = useState(true);

    const handleMoreClick = (account) => {
        alert(`Opening options for ${account.name}: Edit, Disable, Reset Password...`);
    };

    const filteredAccounts = initialAccounts.filter((account) => {
        const matchesRole = activeRole === 'all' || account.role.toLowerCase() === activeRole;
        const matchesSearch =
            account.name.toLowerCase().includes(search.toLowerCase()) ||
            account.email.toLowerCase().includes(search.toLowerCase());
        return matchesRole && matchesSearch;
    });

    const sortedAccounts = [...filteredAccounts].sort((a, b) => {
        if (sortAsc) {
            return a.name.localeCompare(b.name);
        } else {
            return b.name.localeCompare(a.name);
        }
    });

    const counts = {
        all: initialAccounts.length,
        admin: initialAccounts.filter((a) => a.role.toLowerCase() === 'admin').length,
        teacher: initialAccounts.filter((a) => a.role.toLowerCase() === 'teacher').length,
        student: initialAccounts.filter((a) => a.role.toLowerCase() === 'student').length,
    };

    const rolesConfig = [
        { id: 'all', label: 'All', count: counts.all },
        { id: 'admin', label: 'Admin', count: counts.admin },
        { id: 'teacher', label: 'Teacher', count: counts.teacher },
        { id: 'student', label: 'Student', count: counts.student },
    ];

    return (
        <div className="flex flex-col">
            <section className="flex justify-between items-end mb-stack-lg">
                <div>
                    <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Accounts</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">{counts.all} accounts total</p>
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

            {sortedAccounts.length > 0 ? (
                <div className="space-y-stack-sm">
                    {sortedAccounts.map((account) => (
                        <AccountListItem
                            key={account.id}
                            account={account}
                            onMoreClick={handleMoreClick}
                        />
                    ))}
                </div>
            ) : (
                <div className="p-12 text-center flex flex-col items-center bg-white rounded-2xl border border-outline-variant shadow-sm mt-4">
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
