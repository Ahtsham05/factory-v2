import { useEffect } from 'react';

export function FontLoader() {
  useEffect(() => {
    // Check if the browser supports the Font Loading API
    if ('fonts' in document) {
      Promise.all([
        document.fonts.load('1em "Noto Nastaliq Urdu"'),
        document.fonts.load('bold 1em "Noto Nastaliq Urdu"')
      ])
        .then(() => {
          console.log('Urdu fonts loaded successfully');
          document.documentElement.classList.add('fonts-loaded');
        })
        .catch(err => {
          console.error('Failed to load Urdu fonts:', err);
          // Still mark as loaded to prevent perpetual loading state
          document.documentElement.classList.add('fonts-loaded');
        });
    } else {
      // Fallback for browsers without Font Loading API
      // Set a timeout to assume fonts are loaded after a short delay
      setTimeout(() => {
        document.documentElement.classList.add('fonts-loaded');
      }, 500);
    }
  }, []);
  
  return null; // This component doesn't render anything visible
}
