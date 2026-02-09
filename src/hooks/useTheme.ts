import { useState, useEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';
import type React from 'react';

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

  const toggleTheme = useCallback((event?: React.MouseEvent) => {
    // Check if browser supports View Transition API
    if (!document.startViewTransition) {
      setTheme(prev => prev === 'light' ? 'dark' : 'light');
      return;
    }

    const x = event?.clientX ?? window.innerWidth / 2;
    const y = event?.clientY ?? window.innerHeight / 2;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
      });
    });

    transition.ready.then(() => {
      // Animate the circle expansion
      document.documentElement.animate(
        [
          { clipPath: `circle(0px at ${x}px ${y}px)` },
          { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` },
        ],
        {
          duration: 750,
          easing: 'ease-in-out',
          // pseudoElement: '::view-transition-new(root)', // This syntax is standard but TS might complain
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  }, []);

  return { theme, toggleTheme };
}
