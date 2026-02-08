import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme') as Theme;
      if (stored) return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    // Check if browser supports View Transition API for ultra-smooth transitions
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
      });
    } else {
      // Fallback: Add transitioning class for pulse animation
      const root = document.documentElement;
      root.classList.add('theme-transitioning');

      setTheme(prev => prev === 'light' ? 'dark' : 'light');

      // Remove the transitioning class after animation completes
      setTimeout(() => {
        root.classList.remove('theme-transitioning');
      }, 600);
    }
  }, []);

  return { theme, toggleTheme };
}
