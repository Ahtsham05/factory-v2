'use client';

import { useState } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/stores/store';
import { deleteRoznamcha } from '@/stores/roznamcha.slice';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: any;
  setFetch: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function RoznamchaDeleteDialog({
  open,
  onOpenChange,
  currentRow,
  setFetch,
}: Props) {
  const [value, setValue] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const handleDelete = async () => {
    if (value.trim() !== currentRow.description) return;

    onOpenChange(false);
    try {
      await dispatch(deleteRoznamcha(currentRow.id || currentRow._id)).unwrap();
      toast.success(t('roznamcha.entryDeletedSuccess'));
      setFetch((prev) => !prev);
    } catch {
      toast.error(t('roznamcha.failedToDeleteEntry'));
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
          <IconAlertTriangle className="stroke-destructive mr-1 inline-block" size={18} /> {t('roznamcha.deleteEntry')}
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            {t('roznamcha.deleteConfirmMessage')}{' '}
            <span className="font-bold">{currentRow.description}</span>? {t('roznamcha.deleteWarning')}
          </p>

          <Label className="my-2">
            {t('roznamcha.entryDescription')}:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t('roznamcha.enterDescriptionToConfirm')}
              autoFocus
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>{t('common.warning')}!</AlertTitle>
            <AlertDescription>{t('roznamcha.operationCannotBeRolledBack')}</AlertDescription>
          </Alert>
        </div>
      }
      confirmText={t('common.delete')}
      destructive
    />
  );
}
