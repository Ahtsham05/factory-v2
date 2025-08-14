import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/language-context';

export const useTranslations = () => {
  const { t, i18n } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
  const isUrdu = currentLanguage === 'ur';

  return {
    t,
    i18n,
    currentLanguage,
    changeLanguage,
    isRTL: false, // Always LTR layout
    isUrdu, // Use this to apply Urdu-specific styling
    // Utility functions
    formatNumber: (num: number) => {
      if (isUrdu) {
        // Format numbers for Urdu (using Pakistani locale)
        return num.toLocaleString('ur-PK');
      }
      return num.toLocaleString('en-US');
    },
    formatCurrency: (amount: number) => {
      if (isUrdu) {
        return `Rs ${amount.toLocaleString('ur-PK')}`;
      }
      return `$${amount.toLocaleString('en-US')}`;
    }
  };
};
