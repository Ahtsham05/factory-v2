/**
 * Example: How to use the Browser-based Voice Input Hook
 * 
 * This example shows how to integrate voice-to-text functionality
 * into your React components using the native browser Speech Recognition API.
 */

import React, { useState } from 'react';
import { useVoiceInput } from '../hooks/use-voice-input';

export const VoiceInputExample: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { isListening, isSupported, startListening, stopListening } = useVoiceInput({
    onResult: (transcript) => {
      setInputValue(transcript);
      setError(null);
    },
    onError: (errorMessage) => {
      setError(errorMessage);
    }
  });

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      setError(null);
      startListening();
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Browser Voice Input Example</h2>
      
      <div className="space-y-4">
        {/* Input field with voice support */}
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type or speak your message..."
            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          {/* Voice input button */}
          <button
            onClick={handleVoiceInput}
            disabled={!isSupported}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isSupported ? (isListening ? 'Stop recording' : 'Start voice input') : 'Voice input not supported'}
          >
            {isListening ? '🛑' : '🎤'}
          </button>
        </div>

        {/* Status indicators */}
        <div className="text-sm space-y-2">
          <div className={`flex items-center gap-2 ${isSupported ? 'text-green-600' : 'text-red-600'}`}>
            <span>{isSupported ? '✅' : '❌'}</span>
            <span>Browser voice recognition {isSupported ? 'supported' : 'not supported'}</span>
          </div>
          
          {isListening && (
            <div className="flex items-center gap-2 text-blue-600">
              <span>🎙️</span>
              <span>Listening... Speak now</span>
            </div>
          )}
        </div>

        {/* Error display */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Usage instructions */}
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-sm">
          <strong>Browser Voice Recognition:</strong>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>Uses native browser Speech Recognition API</li>
            <li>Works best in Chrome, Edge, and Safari</li>
            <li>Click the microphone button 🎤</li>
            <li>Grant microphone permission when prompted</li>
            <li>Speak clearly in English or Urdu</li>
            <li>The text will appear automatically</li>
            <li>Requires internet connection for best accuracy</li>
          </ul>
        </div>

        {/* Browser compatibility info */}
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm">
          <strong>Browser Support:</strong>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>✅ Chrome (recommended)</li>
            <li>✅ Microsoft Edge</li>
            <li>✅ Safari (WebKit)</li>
            <li>❌ Firefox (limited support)</li>
          </ul>
        </div>

        {/* Clear button */}
        <button
          onClick={() => {
            setInputValue('');
            setError(null);
          }}
          className="w-full p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default VoiceInputExample;
