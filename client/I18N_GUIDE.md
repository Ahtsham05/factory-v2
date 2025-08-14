# Internationalization (i18n) Implementation

This guide explains how to use the internationalization system in your React application.

## Features

- ✅ English and Urdu language support
- ✅ LTR (Left-to-Right) layout maintained for both languages
- ✅ Language switcher component
- ✅ Persistent language selection
- ✅ Custom hooks for easy translation
- ✅ Context provider for language management
- ✅ Proper Urdu font rendering

## Quick Start

### 1. Using Translations in Components

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('common.dashboard')}</h1>
      <button>{t('common.save')}</button>
    </div>
  );
}
```

### 2. Using Custom Hook

```tsx
import { useTranslations } from '@/hooks/use-translations';

function MyComponent() {
  const { t, isUrdu, formatCurrency } = useTranslations();

  return (
    <div>
      <h1 className={isUrdu ? 'font-urdu' : ''}>{t('dashboard.title')}</h1>
      <p>{formatCurrency(1000)}</p>
      <div className={isUrdu ? 'urdu-text' : ''}>
        {t('dashboard.totalRevenue')}
      </div>
    </div>
  );
}
```

### 3. Adding the Language Switcher

```tsx
import { LanguageSwitcher } from '@/components/language-switcher';

function Header() {
  return (
    <div className="header">
      <LanguageSwitcher />
    </div>
  );
}
```

## Adding New Translations

### 1. Add to English file (`src/lib/locales/en.json`)

```json
{
  "newSection": {
    "title": "New Section",
    "description": "This is a new section"
  }
}
```

### 2. Add to Urdu file (`src/lib/locales/ur.json`)

```json
{
  "newSection": {
    "title": "نیا سیکشن",
    "description": "یہ ایک نیا سیکشن ہے"
  }
}
```

### 3. Use in Component

```tsx
function NewSection() {
  const { t } = useTranslation();

  return (
    <div>
      <h2>{t('newSection.title')}</h2>
      <p>{t('newSection.description')}</p>
    </div>
  );
}
```

## Layout Direction

The application maintains a consistent LTR (Left-to-Right) layout for both English and Urdu:

- Layout direction stays the same regardless of language
- UI elements maintain their positions
- Only the text content and fonts change
- Urdu text is properly rendered with appropriate fonts

## Font Support

When Urdu is selected:
- Urdu-specific fonts are automatically applied
- Text rendering is optimized for Urdu script
- Fallback fonts are provided for better compatibility

## Language Structure

```
src/lib/locales/
├── en.json (English translations)
└── ur.json (Urdu translations)
```

## Translation Keys Organization

```json
{
  "common": {
    // Common UI elements (buttons, labels, etc.)
  },
  "sidebar": {
    // Sidebar navigation items
  },
  "dashboard": {
    // Dashboard specific texts
  },
  "auth": {
    // Authentication related texts
  },
  "forms": {
    // Form validation messages
  },
  "errors": {
    // Error messages
  }
}
```

## Best Practices

1. **Keep keys organized**: Group related translations under meaningful sections
2. **Use descriptive keys**: `dashboard.totalRevenue` instead of `tr1`
3. **Handle pluralization**: Use i18next's plural forms when needed
4. **Consistent layout**: UI layout remains the same across languages
5. **Font support**: Ensure Urdu fonts are loaded properly
6. **Use isUrdu flag**: Apply Urdu-specific styling when needed

## Adding New Languages

To add a new language (e.g., French):

1. Create `src/lib/locales/fr.json`
2. Add translations following the same structure
3. Update `src/lib/i18n.ts`:

```typescript
import frTranslations from './locales/fr.json';

const resources = {
  en: { translation: enTranslations },
  ur: { translation: urTranslations },
  fr: { translation: frTranslations }, // Add new language
};
```

4. Update the language switcher in `src/components/language-switcher.tsx`:

```typescript
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }, // Add new language
];
```

## Troubleshooting

### Language not changing
- Check if the translation key exists in both language files
- Verify the component is wrapped with the LanguageProvider
- Check browser console for i18next errors

### Layout issues
- Ensure CSS classes are properly handling the consistent LTR layout
- Check if custom styles work well with Urdu fonts
- Use logical CSS properties where appropriate

### Fonts not loading
- Verify Urdu fonts are included in the CSS
- Check font fallbacks are properly set
- Test with different browsers

## Current Translation Coverage

✅ Dashboard components
✅ Sidebar navigation
✅ Authentication forms
✅ Common UI elements
⏳ Transaction pages (to be added)
⏳ Party management (to be added)
⏳ Reports section (to be added)

## Next Steps

1. Add translations for remaining pages
2. Implement form validation messages
3. Add date/time localization
4. Consider adding more languages based on user needs
