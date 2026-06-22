import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function VideoPlayer({ 
    title, 
    thumbnailUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDQbPkr8z9vGPnJtFXtPoBeWQHLHdauuREwPyhoJyk-z3YS1k1vKintoUZCtpI8Tp7obn3lTzFb_d-OH4mtsWw2uGIMFugDi-v49Kq7HTdUje_I7I7esihDQZJ4BE8blp2BY6IlQOgaz54LUobtEGOm1r3w_lk8K7FMlFempOWSwx1PygJYmWc8tnPHmEr5O-rgQNPneMt0oYqIDvDPEQcRZ72mwNXiPoJMv3i2FK_2fA6rhFRRscaykYl0ph9iko_morMaGLda9PY",
    duration = "12:00",
    progress = 65 
}) {
    return (
        <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-xl group">
            <img 
                alt={`${title} Video Thumbnail`} 
                className="w-full h-full object-cover opacity-80" 
                src={thumbnailUrl} 
            />
            
            {/* Fake UI Controls Overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-6 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex justify-between items-start">
                    <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium">
                        {title}
                    </div>
                    <button className="text-white hover:text-primary-fixed-dim transition-colors">
                        <Icon name="settings" />
                    </button>
                </div>
                
                <div className="flex flex-col gap-3">
                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-white/30 rounded-full cursor-pointer group/bar relative">
                        <div className="absolute left-0 top-0 h-full bg-primary-container rounded-full" style={{ width: `${progress}%` }}></div>
                        <div 
                            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md scale-0 group-hover/bar:scale-100 transition-transform"
                            style={{ left: `${progress}%` }}
                        ></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-white">
                            <button className="hover:scale-110 transition-transform">
                                <Icon name="play_arrow" className="text-[32px]" />
                            </button>
                            <button className="hover:text-primary-fixed-dim transition-colors">
                                <Icon name="skip_next" className="text-[24px]" />
                            </button>
                            <div className="flex items-center gap-2 hidden sm:flex">
                                <Icon name="volume_up" className="text-[20px]" />
                                <div className="w-16 h-1 bg-white/30 rounded-full">
                                    <div className="h-full bg-white w-3/4 rounded-full"></div>
                                </div>
                            </div>
                            <span className="text-xs font-medium">07:45 / {duration}</span>
                        </div>
                        <div className="flex items-center gap-4 text-white">
                            <button className="hover:text-primary-fixed-dim transition-colors">
                                <Icon name="closed_caption" />
                            </button>
                            <button className="hover:text-primary-fixed-dim transition-colors">
                                <Icon name="fullscreen" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Play Button (Initial) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center text-white shadow-2xl backdrop-blur-sm animate-pulse">
                    <Icon name="play_arrow" className="text-[48px] material-symbols-fill" />
                </div>
            </div>
        </div>
    );
}
