import React from 'react';
import { useTheme } from '@/Contexts/ThemeContext';
import Icon from '@/Components/shared/ui/Icon';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors active:scale-95"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            aria-label="Toggle Dark Mode"
        >
            <Icon 
                name={theme === 'dark' ? 'light_mode' : 'dark_mode'} 
                className="text-[20px] transition-transform duration-300 rotate-0" 
            />
        </button>
    );
}
