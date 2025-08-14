import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function useFontLoading() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { i18n } = useTranslation();
  const isUrdu = i18n.language === 'ur';
  
  useEffect(() => {
    if (isUrdu && 'fonts' in document) {
      Promise.all([
        document.fonts.load('1em "Noto Nastaliq Urdu"'),
        document.fonts.load('bold 1em "Noto Nastaliq Urdu"')
      ])
        .then(() => {
          console.log('Urdu fonts loaded successfully');
          setFontsLoaded(true);
          document.documentElement.classList.add('fonts-loaded');
        })
        .catch(err => {
          console.error('Failed to load Urdu fonts:', err);
          // Still mark as loaded to prevent perpetual loading state
          setFontsLoaded(true);
        });
    } else {
      // For non-Urdu languages, mark fonts as loaded immediately
      setFontsLoaded(true);
      document.documentElement.classList.add('fonts-loaded');
    }
    
    // Clean up when component unmounts or language changes
    return () => {
      if (!isUrdu) {
        document.documentElement.classList.remove('fonts-loaded');
      }
    };
  }, [isUrdu]);
  
  return { fontsLoaded, isUrdu };
}
