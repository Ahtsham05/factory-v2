/**
 * Speech Recognition Polyfill for Browser Compatibility
 * This ensures speech recognition works consistently across different browsers
 */

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Check if we're in a browser environment
const isBrowser = () => {
  return typeof window !== 'undefined' && typeof navigator !== 'undefined';
};

// Initialize speech recognition polyfill
export const initSpeechRecognitionPolyfill = () => {
  if (!isBrowser()) {
    return;
  }

  // Log environment info for debugging
  console.log('Speech Recognition Environment:', {
    hasSpeechRecognition: !!window.SpeechRecognition,
    hasWebkitSpeechRecognition: !!window.webkitSpeechRecognition,
    userAgent: navigator.userAgent,
    isOnline: navigator.onLine
  });

  // Ensure we have the standard API available
  // Most browsers use webkitSpeechRecognition, so we standardize it to SpeechRecognition
  if (!window.SpeechRecognition && window.webkitSpeechRecognition) {
    window.SpeechRecognition = window.webkitSpeechRecognition;
    console.log('Using webkitSpeechRecognition as SpeechRecognition');
  }

  // Check if speech recognition is available
  if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
    console.warn('Speech recognition not available in this browser');
    
    // Create a minimal fallback that shows appropriate error
    window.SpeechRecognition = class MockSpeechRecognition {
      onstart: any = null;
      onresult: any = null;
      onerror: any = null;
      onend: any = null;
      continuous = false;
      interimResults = false;
      lang = 'en-US';
      maxAlternatives = 1;

      constructor() {
        console.warn('Speech recognition not supported in this browser');
      }
      
      start() {
        console.warn('Speech recognition start called but not supported');
        setTimeout(() => {
          if (this.onerror) {
            const errorEvent = {
              error: 'not-allowed',
              message: 'Speech recognition not supported in this browser'
            };
            this.onerror(errorEvent);
          }
        }, 100);
      }
      
      stop() {
        console.warn('Speech recognition stop called but not supported');
        if (this.onend) {
          this.onend();
        }
      }
    };
  } else {
    console.log('Speech recognition is available and ready to use');
  }

  // Add online/offline detection for better user experience
  if (isBrowser()) {
    window.addEventListener('online', () => {
      console.log('Network connection restored - speech recognition should work better');
    });
    
    window.addEventListener('offline', () => {
      console.log('Network connection lost - speech recognition may be limited');
    });
  }
};
