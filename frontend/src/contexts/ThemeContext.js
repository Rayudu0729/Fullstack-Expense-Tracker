import { createContext, useState, useCallback, useMemo } from "react";

export const ThemeContext = createContext();

export const useTheme = () => {
    const [isDarkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        if (saved !== null) return saved === 'dark';
        return window.matchMedia('(prefers-color-scheme:dark)').matches;
    });

    const toggleTheme = useCallback(() => {
        setDarkMode(prev => {
            const next = !prev;
            localStorage.setItem('theme', next ? 'dark' : 'light');
            return next;
        });
    }, []);

    const themeValue = useMemo(() => ({ isDarkMode, toggleTheme }), [isDarkMode, toggleTheme]);

    return [isDarkMode, toggleTheme, themeValue];
}