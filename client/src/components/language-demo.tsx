import { useTranslations } from '@/hooks/use-translations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LanguageSwitcher } from '@/components/language-switcher';

export function LanguageDemo() {
  const { t, isUrdu, formatCurrency } = useTranslations();

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${isUrdu ? 'urdu-font' : ''}`}>
          {t('dashboard.title')}
        </h1>
        <LanguageSwitcher />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className={isUrdu ? 'urdu-font' : ''}>
              {t('dashboard.totalRevenue')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(45231.89)}
            </div>
            <p className={`text-sm text-muted-foreground ${isUrdu ? 'urdu-font' : ''}`}>
              {t('dashboard.fromLastMonth')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={isUrdu ? 'urdu-font' : ''}>
              {t('dashboard.sales')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234</div>
            <p className={`text-sm text-muted-foreground ${isUrdu ? 'urdu-font' : ''}`}>
              {t('dashboard.fromLastHour')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={isUrdu ? 'urdu-font' : ''}>
              {t('dashboard.activeNow')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className={`text-sm text-muted-foreground ${isUrdu ? 'urdu-font' : ''}`}>
              {t('dashboard.plusNewUsers')}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h2 className={`text-lg font-semibold mb-2 ${isUrdu ? 'urdu-font' : ''}`}>
          {t('common.overview')}
        </h2>
        <p className={isUrdu ? 'urdu-font' : ''}>
          {isUrdu 
            ? 'یہ ایک نمونہ ہے جو دکھاتا ہے کہ زبان تبدیل کرنے پر لے آؤٹ کی سمت نہیں بدلتی بلکہ صرف ٹیکسٹ اور فونٹ تبدیل ہوتے ہیں۔'
            : 'This is a demo showing how language switching changes only the text and fonts, not the layout direction.'
          }
        </p>
      </div>
    </div>
  );
}
