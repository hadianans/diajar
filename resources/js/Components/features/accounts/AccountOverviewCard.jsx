import React from 'react';
import Avatar from '@/Components/shared/ui/Avatar';

export default function AccountOverviewCard({ account = {}, onEdit, onResetPassword }) {
    const initials = account.name ? account.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

    return (
        <div className="flex flex-col gap-stack-md w-full">
            {/* Overview Box */}
            <div className="tonal-layer rounded-xl p-6 flex flex-col items-center text-center bg-surface-container-lowest border border-outline-variant shadow-sm">
                <Avatar
                    src={account.avatar}
                    initials={initials}
                    className="w-24 h-24 text-3xl mb-4 shadow-md shrink-0 animate-fade-in"
                    bgClassName="bg-primary text-on-primary"
                />
                <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-1">{account.name}</h2>
                <div className="flex flex-col gap-1 mb-4">
                    <p className="font-body-md text-on-surface-variant">{account.email}</p>
                    <p className="font-label-sm text-[12px] text-outline">@{account.username}</p>
                </div>
                <span className="px-4 py-1 rounded-full bg-primary-container text-on-primary-container font-label-sm text-[12px] mb-6 uppercase tracking-wider font-bold">
                    {account.role}
                </span>
                <div className="flex flex-col w-full gap-3">
                    {onEdit && (
                        <button
                            onClick={onEdit}
                            className="w-full bg-primary text-on-primary py-2.5 rounded-lg font-label-md transition-all hover:opacity-90 active:scale-[0.98] shadow-sm"
                            type="button"
                        >
                            Edit Profile
                        </button>
                    )}
                    {onResetPassword && (
                        <button
                            onClick={onResetPassword}
                            className="w-full border border-outline-variant text-primary py-2.5 rounded-lg font-label-md hover:bg-surface-container-low transition-all active:scale-[0.98]"
                            type="button"
                        >
                            Reset Password
                        </button>
                    )}
                </div>
            </div>

            {/* Account Information Box */}
            <div className="tonal-layer rounded-xl p-6 bg-surface-container-lowest border border-outline-variant shadow-sm">
                <h3 className="font-label-md text-on-surface mb-4 border-b border-outline-variant pb-2 font-bold">
                    Account Information
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="font-label-sm text-on-surface-variant font-medium">Created</span>
                        <span className="font-body-md text-on-surface font-semibold">{account.createdDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-label-sm text-on-surface-variant font-medium">Gender</span>
                        <span className="font-body-md text-on-surface font-semibold">{account.gender == 1 ? 'Male' : 'Female'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-label-sm text-on-surface-variant font-medium">Status</span>
                        <span className={`font-label-sm px-2 py-0.5 rounded text-xs font-semibold ${account.isActive ? 'bg-primary-container text-on-primary-container' : 'bg-error-container text-on-error-container'}`}>
                            {account.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-label-sm text-on-surface-variant font-medium">Last Login</span>
                        <span className="font-label-sm px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant text-xs font-semibold">
                            {account.lastLogin || 'Never'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
