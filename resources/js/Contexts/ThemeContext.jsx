import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Check localStorage or fallback to light theme as default
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('theme');
            if (stored) return stored;
            return 'light';
        }
        return 'light'; // Default SSR fallback
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
