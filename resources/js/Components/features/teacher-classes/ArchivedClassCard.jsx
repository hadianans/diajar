import { Link } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';

export default function ArchivedClassCard({ id, groupId, title, year, studentsCount }) {
    return (
        <Link 
            href={`/teacher/classes/${id}${groupId ? `?group_id=${groupId}` : ''}`}
            className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 opacity-75 hover:opacity-100 transition-all duration-300 cursor-pointer"
        >
            <div className="w-12 h-12 rounded-lg bg-surface-variant flex items-center justify-center flex-shrink-0">
                <Icon name="inventory_2" className="text-on-surface-variant" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <h4 className="text-label-md font-label-md text-on-surface truncate">{title}</h4>
                    <span className="px-2 py-0.5 rounded bg-outline-variant text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Archived</span>
                </div>
                <p className="text-label-sm font-label-sm text-on-surface-variant">{year} • {studentsCount} Students</p>
            </div>
            <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors">
                <Icon name="chevron_right" className="text-outline" />
            </button>
        </Link>
    );
}
