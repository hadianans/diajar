import React from 'react';
import Icon from '@/Components/shared/ui/Icon';

export default function VideoPlayerOverlay({ coverImage, title }) {
    return (
        <section className="relative group rounded-3xl overflow-hidden bg-black aspect-video mb-8 shadow-[0_20px_25px_-5px_rgba(15,23,42,0.1),0_8px_10px_-6px_rgba(15,23,42,0.1)]">
            <div className="absolute inset-0 z-0">
                <img 
                    alt={title || "Video thumbnail"} 
                    className="w-full h-full object-cover opacity-90" 
                    src={coverImage || "https://lh3.googleusercontent.com/aida/AP1WRLumrNduBuGfmTDQxPaVV6zf2zsVVnrc2xdXvpjUhko_zd5M3yzDBSe7bNN92jjQ5kyMfL1cGOc9uS-LzkqFWFZtGoUmN293jxlDmf2aY8Q9lddVnxrzYSkl-wz9P2UJOnF6zFiVo_XfBAaxG84a4ykUrKJHWBUlgP_E2j9zvzWTdIB7MA0uk82LJEaBLBdrPW1G7qB722DXOJzB0mC3IikYmIgB0xgbnUtCac8l2ZWy52mNW4_em3F-1aw"} 
                />
            </div>
            
            {/* Video Controls Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 lg:p-8 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                
                {/* Play Button Center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <button className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all transform active:scale-90 border border-white/30">
                        <Icon name="play_arrow" className="!text-4xl text-white" />
                    </button>
                </div>
                
                {/* Bottom Controls */}
                <div className="w-full space-y-4">
                    {/* Progress Bar */}
                    <div className="relative w-full h-1.5 bg-white/30 rounded-full cursor-pointer overflow-hidden group/progress">
                        <div className="absolute left-0 top-0 h-full w-2/3 bg-primary rounded-full"></div>
                        {/* Hidden on non-hover, visible when group/progress is hovered, but we can't easily do pseudo element hovering without more tailwind setup, so we just show the thumb */}
                        <div className="absolute left-[66%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"></div>
                    </div>
                    
                    <div className="flex justify-between items-center text-white">
                        <div className="flex items-center gap-6">
                            <button className="hover:text-primary-container transition-colors"><Icon name="pause" className="text-white" /></button>
                            <div className="text-label-md font-label-md">08:42 / 12:50</div>
                            <button className="hover:text-primary-container transition-colors"><Icon name="volume_up" className="text-white" /></button>
                        </div>
                        <div className="flex items-center gap-6">
                            <button className="hover:text-primary-container transition-colors"><Icon name="settings" className="text-white" /></button>
                            <button className="hover:text-primary-container transition-colors"><Icon name="fullscreen" className="text-white" /></button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
