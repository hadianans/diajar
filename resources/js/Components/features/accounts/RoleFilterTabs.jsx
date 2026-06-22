import React from 'react';

export default function RoleFilterTabs({ roles = [], activeRole, onRoleChange }) {
    return (
        <section className="mb-stack-md -mx-margin-mobile overflow-x-auto hide-scrollbar flex px-margin-mobile gap-2">
            {roles.map((role) => {
                const isActive = activeRole === role.id;
                return (
                    <button
                        key={role.id}
                        onClick={() => onRoleChange && onRoleChange(role.id)}
                        className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-all border ${
                            isActive
                                ? 'bg-secondary-container text-on-secondary-container border-secondary-container font-bold shadow-sm'
                                : 'bg-surface-container text-on-surface-variant border-surface-container hover:bg-surface-container-high'
                        }`}
                        type="button"
                    >
                        {role.label} ({role.count})
                    </button>
                );
            })}
        </section>
    );
}
