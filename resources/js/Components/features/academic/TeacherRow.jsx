import React from 'react';

export default function TeacherRow({ name, email, initials, onUnlink }) {
    return (
        <div className="p-6 flex items-center justify-between group hover:bg-surface-container-low transition-colors">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold flex-shrink-0">
                    {initials || (name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '')}
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="font-label-md text-label-md text-on-surface truncate font-semibold">
                        {name}
                    </span>
                    <span className="font-body-md text-body-md text-on-surface-variant truncate">
                        {email}
                    </span>
                </div>
            </div>
            <button
                onClick={onUnlink}
                className="text-error font-label-md text-label-md px-4 py-2 hover:bg-error/5 rounded-lg transition-colors border border-transparent hover:border-error/20 flex-shrink-0 active:scale-95 duration-100"
                type="button"
            >
                Unlink
            </button>
        </div>
    );
}
