import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectTheme } from './themeSlice';

/**
 * Hook to apply the theme to the document body
 * This will add or remove the 'dark' class based on the theme state
 */
export const useThemeEffect = (): void => {
  const theme = useSelector(selectTheme);
  
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);
};
