import React, { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { VoiceInputButton } from '@/components/ui/voice-input-button';
import { cn } from '@/lib/utils';

interface InputWithVoiceProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onVoiceTranscript?: (text: string) => void;
  showVoiceButton?: boolean;
  voiceButtonSize?: 'sm' | 'md' | 'lg';
}

export const InputWithVoice = forwardRef<HTMLInputElement, InputWithVoiceProps>(
  ({ 
    className, 
    onVoiceTranscript, 
    showVoiceButton = true, 
    voiceButtonSize = 'sm',
    onChange,
    value,
    ...props 
  }, ref) => {
    const handleVoiceTranscript = (transcript: string) => {
      // Create a synthetic event to maintain compatibility with existing form handlers
      const syntheticEvent = {
        target: { value: transcript },
        currentTarget: { value: transcript },
      } as React.ChangeEvent<HTMLInputElement>;

      // Call the onChange handler if provided
      if (onChange) {
        onChange(syntheticEvent);
      }

      // Call the voice-specific callback if provided
      if (onVoiceTranscript) {
        onVoiceTranscript(transcript);
      }
    };

    return (
      <div className="relative">
        <Input
          ref={ref}
          className={cn(showVoiceButton ? 'pr-10' : '', className)}
          value={value}
          onChange={onChange}
          {...props}
        />
        {showVoiceButton && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <VoiceInputButton
              onTranscript={handleVoiceTranscript}
              size={voiceButtonSize}
            />
          </div>
        )}
      </div>
    );
  }
);

InputWithVoice.displayName = 'InputWithVoice';
