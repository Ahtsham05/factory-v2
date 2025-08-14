import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input-localized';
import { LocalizedText, LocalizedHeading } from '@/components/localized-text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function LanguageInputDemo() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>
          <LocalizedHeading level={3}>
            Language Input Demo
          </LocalizedHeading>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <LocalizedText className="block text-sm font-medium mb-1">
            {t('parties.name')}:
          </LocalizedText>
          <Input
            placeholder={t('parties.partyName')}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div>
          <LocalizedText className="block text-sm font-medium mb-1">
            {t('transactions.description')}:
          </LocalizedText>
          <Input
            placeholder={t('transactions.description')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded">
          <LocalizedText className="block text-sm text-gray-600 mb-2">
            Current Input:
          </LocalizedText>
          <LocalizedText className="font-medium">
            {name && <div>{t('parties.name')}: {name}</div>}
            {description && <div>{t('transactions.description')}: {description}</div>}
          </LocalizedText>
        </div>

        <Button onClick={() => { setName(''); setDescription(''); }} className="w-full">
          <LocalizedText>{t('common.reset')}</LocalizedText>
        </Button>
      </CardContent>
    </Card>
  );
}
