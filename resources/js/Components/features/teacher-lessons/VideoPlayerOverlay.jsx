import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
    }
    return null;
};

export default function VideoPlayerOverlay({ url, title }) {
    const embedUrl = getYoutubeEmbedUrl(url);

    if (!embedUrl) {
        if (url) {
            // Assume it's a direct video link or uploaded file
            return (
                <section className="relative group rounded-3xl overflow-hidden bg-black aspect-video mb-8 shadow-[0_20px_25px_-5px_rgba(15,23,42,0.1),0_8px_10px_-6px_rgba(15,23,42,0.1)]">
                    <video 
                        controls 
                        className="absolute inset-0 w-full h-full"
                        src={url} 
                        title={title || "Video player"} 
                    />
                </section>
            );
        }

        return (
            <div className="w-full aspect-video bg-surface-container-high rounded-3xl flex flex-col items-center justify-center text-on-surface-variant border border-outline-variant/50 mb-8 shadow-sm">
                <Icon name="videocam_off" className="text-4xl mb-2 opacity-50" />
                <p className="font-label-md">No valid video URL provided.</p>
            </div>
        );
    }

    return (
        <section className="relative group rounded-3xl overflow-hidden bg-black aspect-video mb-8 shadow-[0_20px_25px_-5px_rgba(15,23,42,0.1),0_8px_10px_-6px_rgba(15,23,42,0.1)]">
            <iframe 
                className="absolute inset-0 w-full h-full"
                src={embedUrl} 
                title={title || "YouTube video player"} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
            ></iframe>
        </section>
    );
}
