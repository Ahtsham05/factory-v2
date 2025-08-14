'use client'

import { useState } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input-localized'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Supplier } from '../data/schema'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/stores/store'
import { deleteSupplier } from '@/stores/supplier.slice'
import toast from 'react-hot-toast'
import { useUrduFontStyle } from '@/hooks/use-urdu-font'
import { useTranslations } from '@/hooks/use-translations'

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: Supplier;
  setFetch: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SuppliersDeleteDialog({ open, onOpenChange, currentRow, setFetch }: Props) {
  const [value, setValue] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { urduInputStyle } = useUrduFontStyle();
  const { isUrdu } = useTranslations();

  const handleDelete = async () => {
    // Case insensitive comparison with trimmed whitespace for better user experience
    if (value.trim().toLowerCase() !== currentRow.name.trim().toLowerCase()) return;

    onOpenChange(false);
    try {
      await dispatch(deleteSupplier(currentRow.id)).unwrap();
      toast.success(isUrdu ? 'سپلائر کامیابی سے حذف کر دیا گیا' : 'Supplier deleted successfully');
      setFetch((prev) => !prev);
    } catch (error) {
      toast.error(isUrdu ? 'سپلائر حذف کرنے میں ناکام' : 'Failed to delete supplier');
      console.error('Delete error:', error);
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim().toLowerCase() !== currentRow.name.trim().toLowerCase()}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle
            className='stroke-destructive mr-1 inline-block'
            size={18}
          />{' '}
          <div dir={isUrdu ? 'rtl' : 'ltr'} style={isUrdu ? urduInputStyle : {}}>
            {isUrdu ? 'سپلائر حذف کریں' : 'Delete Supplier'}
          </div>
        </span>
      }
      desc={
        <div className='space-y-4'>
          <div dir={isUrdu ? 'rtl' : 'ltr'} className='mb-2'>
            <p style={isUrdu ? urduInputStyle : {}}>
              {isUrdu 
                ? `کیا آپ واقعی ${currentRow.name} کو حذف کرنا چاہتے ہیں؟` 
                : `Are you sure you want to delete ${currentRow.name}?`}
            </p>
            <p style={isUrdu ? urduInputStyle : {}} className="mt-2">
              {isUrdu
                ? `یہ عمل ${currentRow.name} کو سسٹم سے مکمل طور پر ہٹا دے گا۔ یہ واپس نہیں کیا جا سکتا۔`
                : `This action will permanently remove ${currentRow.name} from the system. This cannot be undone.`}
            </p>
          </div>

          <div dir={isUrdu ? 'rtl' : 'ltr'} className="space-y-2 w-full">
            <Label className={`block mb-1 ${isUrdu ? 'text-right' : 'text-left'}`} style={isUrdu ? urduInputStyle : {}}>
              {isUrdu ? 'سپلائر:' : 'Supplier:'}
            </Label>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={isUrdu ? 'حذف کرنے کی تصدیق کے لیے سپلائر کا نام درج کریں' : 'Enter supplier name to confirm deletion'}
              style={urduInputStyle}
              className="w-full"
              dir={isUrdu ? 'rtl' : 'ltr'}
              autoFocus
            />
          </div>

          <Alert variant='destructive' dir={isUrdu ? 'rtl' : 'ltr'}>
            <AlertTitle style={isUrdu ? urduInputStyle : {}}>
              {isUrdu ? 'انتباہ!' : 'Warning!'}
            </AlertTitle>
            <AlertDescription style={isUrdu ? urduInputStyle : {}}>
              {isUrdu ? 'احتیاط کریں، یہ آپریشن واپس نہیں کیا جا سکتا۔' : 'Please be careful, this operation cannot be rolled back.'}
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={isUrdu ? 'حذف کریں' : 'Delete'}
      destructive
    />
  )
}
