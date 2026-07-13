import React, { useState, useRef, useEffect } from 'react';
import { usePage, Link } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';
import ThemeToggle from '@/Components/shared/ui/ThemeToggle';

export default function TopAppBar({ title, viewLabel, onBack, showBack = true }) {
    const { auth } = usePage().props;
    const user = auth?.user || {};

    const rawLabel = viewLabel || user?.role || 'Admin';

    // Get initials from user's full name (e.g., "John Doe" -> "JD")
    const getInitials = (name) => {
        if (!name) return 'AU';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const initials = getInitials(user.full_name);

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            window.history.back();
        }
    };

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Menutup dropdown otomatis saat pengguna mengklik di luar area menu
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    return (
        <header className="fixed top-0 left-0 right-0 md:left-72 z-30 h-20 flex justify-center bg-surface-bright/85 backdrop-blur-md border-b border-outline-variant shadow-sm">
            <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-5xl">

                {/* Sisi Kiri: Navigasi Back & Judul */}
                <div className="flex items-center gap-4">
                    {showBack && (
                        <button
                            onClick={handleBack}
                            className="material-symbols-outlined text-primary hover:bg-surface-container p-2 rounded-full bg-surface-container-lowest border border-outline-variant shadow-sm active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                            type="button"
                        >
                            arrow_back
                        </button>
                    )}
                    <h1 className="text-xl md:text-2xl font-extrabold text-primary tracking-tight truncate max-w-[200px] sm:max-w-sm md:max-w-none">
                        {title}
                    </h1>
                </div>

                {/* Sisi Kanan: Theme Toggle & Menu Profil Dropdown */}
                <div className="flex items-center gap-2">
                    
                    <ThemeToggle />

                    {/* Menu Profil Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        {/* Tombol Avatar Trigger */}
                        <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-white overflow-hidden hover:ring-primary/50 active:scale-95 transition-all cursor-pointer"
                        aria-haspopup="true"
                        aria-expanded={isDropdownOpen}
                    >
                        {user.picture ? (
                            <img src={user.picture} alt={user.full_name} className="w-full h-full object-cover" />
                        ) : (
                            <span>{initials}</span>
                        )}
                    </button>

                    {/* Panel Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-lg py-2 z-40 origin-top-right transition-all animate-in fade-in slide-in-from-top-1 duration-100">

                            {/* Informasi Singkat Pengguna */}
                            <div className="px-4 py-2.5 border-b border-outline-variant/50">
                                <p className="text-sm font-bold text-on-surface truncate">{user.full_name}</p>
                                <p className="text-xs text-on-surface-variant truncate mb-1">{user.email}</p>

                                {/* Label Status/Role dipindahkan ke sini */}
                                {rawLabel && (
                                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-white bg-primary-container/85 px-2 py-0.5 rounded-full border border-primary/10">
                                        {rawLabel.replace(/ View/i, '')}
                                    </span>
                                )}
                            </div>

                            {/* Menu Item Lain (Opsional, Misal: Lihat Profil) */}
                            <div className="p-1">
                                <button
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors text-left"
                                >
                                    <span className="material-symbols-outlined text-base">person</span>
                                    <span>Profil Saya</span>
                                </button>
                            </div>

                            {/* Menu Item: Logout */}
                            <div className="p-1 border-t border-outline-variant/50 mt-1">
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-error hover:bg-error-container/40 hover:text-error rounded-xl transition-colors text-left font-medium"
                                >
                                    <span className="material-symbols-outlined text-base">logout</span>
                                    <span>Keluar</span>
                                </Link>
                            </div>

                        </div>
                    )}
                </div>
                </div>

            </div>
        </header>
    );
}
