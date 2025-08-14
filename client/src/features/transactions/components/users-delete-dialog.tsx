'use client';

import { useState } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/stores/store';
import { deleteTransaction } from '@/stores/transaction.slice';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useUrduFontStyle } from '@/hooks/use-urdu-font';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: any;
  setFetch: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TransactionDeleteDialog({
  open,
  onOpenChange,
  currentRow,
  setFetch,
}: Props) {
  const [value, setValue] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { urduInputStyle } = useUrduFontStyle();

  const handleDelete = async () => {
    if (value.trim() !== currentRow.description) return;

    onOpenChange(false);
    try {
      await dispatch(deleteTransaction(currentRow.id || currentRow._id)).unwrap();
      toast.success(t('transaction.entryDeletedSuccess'));
      setFetch((prev) => !prev);
    } catch {
      toast.error(t('transaction.failedToDeleteEntry'));
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.description}
      title={
        <span className="text-destructive">
          <IconAlertTriangle className="stroke-destructive mr-1 inline-block" size={18} /> {t('transaction.deleteEntry')}
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            {t('transaction.deleteConfirmMessage')}{' '}
            <span className="font-bold">{currentRow.description}</span>? {t('transaction.deleteWarning')}
          </p>

          <Label className="my-2">
            {t('transaction.entryDescription')}:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t('transaction.enterDescriptionToConfirm')}
              autoFocus
              style={urduInputStyle}
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>{t('common.warning')}!</AlertTitle>
            <AlertDescription>{t('transaction.operationCannotBeRolledBack')}</AlertDescription>
          </Alert>
        </div>
      }
      confirmText={t('common.delete')}
      destructive
    />
  );
}
