import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function AvatarUpload({ avatarUrl, onUploadClick, label = 'Upload Profile Picture' }) {
    return (
        <section className="flex flex-col items-center">
            <div className="relative">
                <div className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden border-2 border-primary-container/20 shadow-inner bg-surface-container-lowest">
                    {avatarUrl ? (
                        <img
                            className="w-full h-full object-cover"
                            src={avatarUrl}
                            alt="Profile Avatar Preview"
                        />
                    ) : (
                        <Icon name="person" className="text-4xl text-on-surface-variant" />
                    )}
                </div>
                
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        if (onUploadClick) onUploadClick();
                    }}
                    className="absolute bottom-0 right-0 bg-primary text-on-primary p-2 rounded-full shadow-lg hover:bg-primary/90 transition-all active:scale-90 duration-100 flex items-center justify-center cursor-pointer text-white"
                    type="button"
                    title={label}
                >
                    <Icon name="photo_camera" className="text-[20px]" />
                </button>
            </div>
            
            <p className="mt-2 font-label-sm text-label-sm text-on-surface-variant font-medium">
                {label}
            </p>
        </section>
    );
}
