import { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

function ThemeToggle() {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);

    return (
        <button
            className="global-theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDarkMode ? '☀️' : '🌙'}
        </button>
    );
}

export default ThemeToggle;
