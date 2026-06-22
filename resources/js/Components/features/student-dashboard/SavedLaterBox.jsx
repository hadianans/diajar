import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function SavedLaterBox({ savedItems = [], onAddNewClick, onItemClick }) {
    return (
        <section className="bg-white border border-outline-variant p-6 rounded-[24px] shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-4 font-bold">
                Saved for Later
            </h3>

            <div className="grid grid-cols-3 gap-3">
                {savedItems.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => onItemClick && onItemClick(item)}
                        className="aspect-square bg-surface-container-high rounded-xl overflow-hidden relative group border border-outline-variant/30 cursor-pointer shadow-sm"
                    >
                        {item.imageUrl && (
                            <img
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                src={item.imageUrl}
                                alt={item.altText || item.title}
                            />
                        )}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Icon
                                name="bookmark"
                                className="text-white text-2xl fill-icon animate-scale-up"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            />
                        </div>
                    </div>
                ))}

                {/* Add new card placeholder */}
                <div
                    onClick={onAddNewClick}
                    className="aspect-square bg-surface-container-lowest border-2 border-dashed border-outline-variant rounded-xl flex items-center justify-center cursor-pointer hover:bg-surface-container-low hover:border-primary text-outline hover:text-primary transition-all duration-300 shadow-sm"
                    title="Save New Item"
                >
                    <Icon name="add" className="text-[24px]" />
                </div>
            </div>
        </section>
    );
}
