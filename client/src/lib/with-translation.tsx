import React from 'react';
import { useTranslation } from 'react-i18next';

export interface WithTranslationProps {
  t: (key: string, options?: any) => string;
  i18n: any;
}

export function withTranslation<P extends WithTranslationProps>(
  Component: React.ComponentType<P>
) {
  const WrappedComponent = (props: Omit<P, keyof WithTranslationProps>) => {
    const { t, i18n } = useTranslation();
    
    return <Component {...(props as P)} t={t} i18n={i18n} />;
  };

  WrappedComponent.displayName = `withTranslation(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}
