import { CSSProperties } from 'react';
import { useTranslations } from './use-translations';

export const useUrduFontStyle = () => {
  const { currentLanguage } = useTranslations();
  const isUrdu = currentLanguage === 'ur';

  const urduFontStyle: CSSProperties = {
    fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Pak Nastaliq', 'Urdu Typesetting', 'Arabic Typesetting', 'Tahoma', 'Microsoft Uighur', 'Traditional Arabic', serif",
    fontSize: '1em',
    lineHeight: '1.6',
    fontWeight: '400',
    fontOpticalSizing: 'auto' as const,
    fontStyle: 'normal'
  };

  const urduHeadingStyle: CSSProperties = {
    ...urduFontStyle,
    fontWeight: '500',
    lineHeight: '1.4'
  };

  const urduButtonStyle: CSSProperties = {
    ...urduFontStyle,
    fontWeight: '450',
    letterSpacing: '0.02em'
  };

  const urduSidebarStyle: CSSProperties = {
    fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Pak Nastaliq', 'Urdu Typesetting', 'Arabic Typesetting', 'Tahoma', 'Microsoft Uighur', 'Traditional Arabic', serif",
    fontSize: '1em !important',
    lineHeight: '3 !important',
    fontWeight: '600 !important',
    fontOpticalSizing: 'auto' as const,
    fontStyle: 'normal'
  };

  const urduInputStyle: CSSProperties = {
    fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Pak Nastaliq', 'Urdu Typesetting', 'Arabic Typesetting', 'Tahoma', 'Microsoft Uighur', 'Traditional Arabic', serif",
    height: '40px',
    fontSize: '1em',
    lineHeight: '1.6',
    fontWeight: '400',
    fontOpticalSizing: 'auto' as const,
    fontStyle: 'normal'
  };

  const urduSelectStyle = isUrdu ? {
    control: (base: any) => ({
      ...base,
      fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Pak Nastaliq', 'Urdu Typesetting', 'Arabic Typesetting', 'Tahoma', 'Microsoft Uighur', 'Traditional Arabic', serif",
      minHeight: '2.5rem',
      lineHeight: '2.5',
    }),
    singleValue: (base: any) => ({
      ...base,
      fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Pak Nastaliq', 'Urdu Typesetting', 'Arabic Typesetting', 'Tahoma', 'Microsoft Uighur', 'Traditional Arabic', serif",
    }),
    option: (base: any) => ({
      ...base,
      fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Pak Nastaliq', 'Urdu Typesetting', 'Arabic Typesetting', 'Tahoma', 'Microsoft Uighur', 'Traditional Arabic', serif",
    }),
    input: (base: any) => ({
      ...base,
      fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Pak Nastaliq', 'Urdu Typesetting', 'Arabic Typesetting', 'Tahoma', 'Microsoft Uighur', 'Traditional Arabic', serif",
    }),
    placeholder: (base: any) => ({
      ...base,
      fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Pak Nastaliq', 'Urdu Typesetting', 'Arabic Typesetting', 'Tahoma', 'Microsoft Uighur', 'Traditional Arabic', serif",
    }),
  } : {};

  const urduTableCellStyle: CSSProperties = {
    fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Pak Nastaliq', 'Urdu Typesetting', 'Arabic Typesetting', 'Tahoma', 'Microsoft Uighur', 'Traditional Arabic', serif",
    height: '45px',
    fontSize: '1em',
    lineHeight: '1.6',
    fontWeight: '400',
    fontOpticalSizing: 'auto' as const,
    fontStyle: 'normal'
  };

  return {
    isUrdu,
    urduFontStyle: isUrdu ? urduFontStyle : undefined,
    urduHeadingStyle: isUrdu ? urduHeadingStyle : undefined,
    urduButtonStyle: isUrdu ? urduButtonStyle : undefined,
    urduSidebarStyle: isUrdu ? urduSidebarStyle : undefined,
    urduInputStyle: isUrdu ? urduInputStyle : undefined,
    urduSelectStyle, // Already conditionally constructed
    urduTableCellStyle: isUrdu ? urduTableCellStyle : undefined,
    getUrduClassName: () => isUrdu ? 'urdu-sidebar-nav' : '',
    getCommandClassName: () => isUrdu ? 'urdu-command-item' : '',
  };
};
