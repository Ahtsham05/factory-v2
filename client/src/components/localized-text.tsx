import React from 'react';
import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';

interface LocalizedTextProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function LocalizedText({ 
  children, 
  className, 
  as: Component = 'span' 
}: LocalizedTextProps) {
  const { currentLanguage } = useTranslations();
  const isUrdu = currentLanguage === 'ur';
  
  const urduStyle = isUrdu ? {
    fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Pak Nastaleeq', 'Urdu Typesetting', 'Arabic Typesetting', 'Tahoma', 'Microsoft Uighur', 'Traditional Arabic', serif",
    fontSize: '1em',
    lineHeight: '1.6',
    fontWeight: '600' // Bold weight for static Urdu text
  } : undefined;
  
  return (
    <Component 
      className={cn(
        isUrdu && 'urdu-font',
        className
      )}
      lang={currentLanguage}
      style={urduStyle}
    >
      {children}
    </Component>
  );
}

// Specific components for common use cases
export function LocalizedHeading({ children, className, level = 1 }: {
  children: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}) {
  const HeadingTag = `h${level}` as const;
  return (
    <LocalizedText as={HeadingTag} className={className}>
      {children}
    </LocalizedText>
  );
}

export function LocalizedParagraph({ children, className }: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <LocalizedText as="p" className={className}>
      {children}
    </LocalizedText>
  );
}

export function LocalizedLabel({ children, className }: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <LocalizedText as="label" className={className}>
      {children}
    </LocalizedText>
  );
}
