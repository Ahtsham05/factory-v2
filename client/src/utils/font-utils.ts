/**
 * Utility functions for consistent font styling throughout the application,
 * especially for Urdu text handling
 */

import { useTranslation } from 'react-i18next';

/**
 * Returns appropriate text direction based on current language
 */
export function useTextDirection() {
  const { i18n } = useTranslation();
  return i18n.language === 'ur' ? 'rtl' : 'ltr';
}

/**
 * Returns appropriate CSS class names for text styling based on current language
 * @param baseClasses - Base CSS classes to always include
 * @param options - Configuration options
 * @returns String of CSS class names
 */
export function useTextClasses(
  baseClasses: string = '',
  options: {
    size?: 'sm' | 'md' | 'lg' | undefined;
    enforceRtl?: boolean;
    enforceLtr?: boolean;
  } = {}
) {
  const { i18n } = useTranslation();
  const isUrdu = i18n.language === 'ur';
  
  let classes = baseClasses ? `${baseClasses} ` : '';
  
  // Add Urdu font class if language is Urdu
  if (isUrdu) {
    classes += 'urdu-text ';
    
    // Add size class if specified
    if (options.size) {
      classes += `urdu-text-${options.size} `;
    }
  }
  
  // Add direction class based on language and options
  if ((isUrdu && !options.enforceLtr) || options.enforceRtl) {
    classes += 'text-rtl ';
  }
  
  return classes.trim();
}

/**
 * Returns appropriate table cell CSS class names based on current language
 * @param baseClasses - Base CSS classes to always include
 * @param isNumeric - Whether the cell contains numeric content (affects alignment)
 * @returns String of CSS class names
 */
export function useTableCellClasses(
  baseClasses: string = '',
  isNumeric: boolean = false
) {
  const { i18n } = useTranslation();
  const isUrdu = i18n.language === 'ur';
  
  let classes = baseClasses ? `${baseClasses} ` : '';
  
  if (isUrdu) {
    classes += 'urdu-table-cell ';
  }
  
  // For numeric columns, we might want different alignment regardless of language
  if (isNumeric) {
    // Override text alignment for numeric columns
    classes += isUrdu ? '' : 'text-right ';
  }
  
  return classes.trim();
}

/**
 * Returns style object for RTL/LTR text based on current language
 * @param additionalStyles - Additional styles to merge
 * @returns Style object
 */
export function useTextStyle(additionalStyles: Record<string, any> = {}) {
  const { i18n } = useTranslation();
  const isUrdu = i18n.language === 'ur';
  
  return {
    fontFamily: isUrdu ? 'var(--font-urdu)' : 'inherit',
    direction: isUrdu ? 'rtl' : 'ltr',
    ...additionalStyles,
  };
}

/**
 * Returns object with various properties for consistent styling
 * based on current language context
 */
export function useLocaleFormatting() {
  const { i18n } = useTranslation();
  const isUrdu = i18n.language === 'ur';
  
  return {
    isRtl: isUrdu,
    textAlign: isUrdu ? 'right' : 'left',
    direction: isUrdu ? 'rtl' : 'ltr',
    fontFamily: isUrdu ? 'var(--font-urdu)' : 'inherit',
    getTextClass: (size?: 'sm' | 'md' | 'lg') => 
      isUrdu ? `urdu-text ${size ? `urdu-text-${size}` : ''}` : '',
    getTableCellClass: (isNumeric: boolean = false) => 
      isUrdu ? 'urdu-table-cell' : isNumeric ? 'text-right' : '',
  };
}
