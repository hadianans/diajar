import React from 'react';
import Avatar from '@/Components/shared/ui/Avatar';
import Icon from '@/Components/shared/ui/Icon';

const roleBadgeStyles = {
    admin: 'bg-[#eef2ff] text-[#004ac6]',
    teacher: 'bg-[#ecfdf5] text-[#059669]',
    student: 'bg-[#fffbeb] text-[#d97706]',
};

const avatarBgMap = {
    admin: 'bg-primary-fixed text-on-primary-fixed',
    teacher: 'bg-secondary-container text-on-secondary-container',
    student: 'bg-tertiary-fixed text-on-tertiary-fixed',
};

export default function AccountListItem({ account, onMoreClick }) {
    const initials = account.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const roleKey = account.role.toLowerCase();
    const badgeStyle = roleBadgeStyles[roleKey] || 'bg-surface-container text-on-surface-variant';
    const avatarBg = avatarBgMap[roleKey] || 'bg-outline-variant text-on-surface';

    return (
        <div className="bg-white p-4 rounded-xl border border-outline-variant flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-0.5 group">
            <Avatar
                src={account.avatar}
                initials={initials}
                className="w-12 h-12 text-[18px] shrink-0"
                bgClassName={avatarBg}
            />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h3 className="font-label-md text-label-md text-on-surface truncate">{account.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badgeStyle}`}>
                        {account.role}
                    </span>
                    {!account.isActive && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-error-container text-on-error-container">
                            Inactive
                        </span>
                    )}
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant truncate">{account.email}</p>
                <div className="flex items-center gap-2 mt-1">
                    <p className="text-[11px] text-outline uppercase tracking-tight">Created {account.createdDate}</p>
                    <span className="text-[11px] text-outline uppercase tracking-tight">&bull;</span>
                    <p className="text-[11px] text-outline uppercase tracking-tight">
                        {account.gender == 1 ? 'Male' : 'Female'}
                    </p>
                </div>
            </div>
            {onMoreClick && (
                <button
                    onClick={() => onMoreClick(account)}
                    className="p-2 text-on-surface-variant opacity-50 group-hover:opacity-100 transition-opacity hover:bg-surface-container rounded-full"
                    type="button"
                >
                    <Icon name="more_vert" />
                </button>
            )}
        </div>
    );
}
