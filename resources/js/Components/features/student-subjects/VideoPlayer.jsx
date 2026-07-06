import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function VideoPlayer({ 
    title, 
    thumbnailUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDQbPkr8z9vGPnJtFXtPoBeWQHLHdauuREwPyhoJyk-z3YS1k1vKintoUZCtpI8Tp7obn3lTzFb_d-OH4mtsWw2uGIMFugDi-v49Kq7HTdUje_I7I7esihDQZJ4BE8blp2BY6IlQOgaz54LUobtEGOm1r3w_lk8K7FMlFempOWSwx1PygJYmWc8tnPHmEr5O-rgQNPneMt0oYqIDvDPEQcRZ72mwNXiPoJMv3i2FK_2fA6rhFRRscaykYl0ph9iko_morMaGLda9PY",
    duration = "12:00",
    url
}) {
    const getYoutubeEmbedUrl = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
            return `https://www.youtube.com/embed/${match[2]}`;
        }
        return null;
    };

    const embedUrl = getYoutubeEmbedUrl(url);

    return (
        <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-xl">
            {embedUrl ? (
                <iframe 
                    className="absolute inset-0 w-full h-full"
                    src={embedUrl} 
                    title={title || "YouTube video player"} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                ></iframe>
            ) : url ? (
                <video 
                    controls 
                    className="absolute inset-0 w-full h-full"
                    src={url} 
                    title={title || "Video player"} 
                />
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
                    <Icon name="videocam_off" className="text-4xl mb-2" />
                    <p className="font-label-md">No video available</p>
                </div>
            )}
        </div>
    );
}
