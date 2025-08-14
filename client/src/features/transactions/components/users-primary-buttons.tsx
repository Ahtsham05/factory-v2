import { Button } from '@/components/ui/button';
import { useTransactions } from '../context/users-context';
import { PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TransactionPrimaryButtons() {
  const { setOpen } = useTransactions();
  const { t } = useTranslation();
  
  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen('add')}>
        <span>{t('transactions.addTransaction')}</span> <PlusCircle size={18} />
      </Button>
    </div>
  );
}
