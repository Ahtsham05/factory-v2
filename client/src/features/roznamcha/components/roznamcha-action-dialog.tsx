'use client';

import React, { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/stores/store';
import { addRoznamcha, updateRoznamcha } from '@/stores/roznamcha.slice';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useUrduFontStyle } from '@/hooks/use-urdu-font';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputWithVoice } from '@/components/ui/input-with-voice';
import Select from 'react-select';

import { Roznamcha } from '../data/schema';

// Create validation schema function that uses translations
const createRoznamchaSchema = (t: (key: string) => string) => z.object({
  description: z.string().min(1, { message: t('forms.descriptionRequired') }),
  // Must be one of the allowed types as required by the server
  transactionType: z.enum(['cashReceived', 'expenseVoucher'], { 
    required_error: t('forms.transactionTypeRequired'),
    invalid_type_error: t('forms.invalidTransactionType')
  }),
  status: z.enum(['pending', 'completed']).optional(),
  debit: z.number().min(0, { message: t('forms.debitMustBePositive') }).optional(),
  credit: z.number().min(0, { message: t('forms.creditMustBePositive') }).optional(),
  entryDate: z.string({ required_error: t('forms.entryDateRequired') }),
  referenceNumber: z.string(),
});

type RoznamchaFormValues = z.infer<ReturnType<typeof createRoznamchaSchema>>;

interface RoznamchaActionDialogProps {
  setFetch: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: Roznamcha | null;
}

export default function RoznamchaActionDialog({
  setFetch,
  open,
  onOpenChange,
  currentRow,
}: RoznamchaActionDialogProps) {
  const setOpen = (state: boolean) => onOpenChange(state);
  const isEdit = Boolean(currentRow);
  const roznamcha = currentRow;
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { urduInputStyle, isUrdu } = useUrduFontStyle();

  const form = useForm<RoznamchaFormValues>({
    resolver: zodResolver(createRoznamchaSchema(t)),
    defaultValues: isEdit
      ? {
          description: currentRow?.description ?? '',
          transactionType: currentRow?.transactionType ?? 'cashReceived',
          status: currentRow?.status ?? 'pending',
          debit: currentRow?.debit ?? 0,
          credit: currentRow?.credit ?? 0,
          entryDate: currentRow?.entryDate
            ? new Date(currentRow.entryDate).toISOString().split('T')[0]
            : '',
          referenceNumber: currentRow?.referenceNumber ?? `REF-${Date.now().toString().slice(-6)}`,
        }
      : {
          description: '',
          transactionType: 'cashReceived', // Default to cashReceived since it's required
          status: 'pending',
          entryDate: new Date().toISOString().split('T')[0],
          referenceNumber: `REF-${Date.now().toString().slice(-6)}`, // Generate a reference number
          debit: 0,
          credit: 0,
        },
  });

    const onSubmit = async (data: z.infer<ReturnType<typeof createRoznamchaSchema>>) => {
    try {
      console.log('Form data being submitted:', data);
      
      // All fields should be properly validated by the schema now
      const submissionData = {
        ...data,
        entryDate: data.entryDate,
      };
      
      if (roznamcha) {
        console.log('Updating existing roznamcha:', roznamcha.id);
        await dispatch(updateRoznamcha({
          _id: roznamcha.id, // Using _id as per the updateRoznamcha implementation
          ...submissionData,
        }));
      } else {
        console.log('Creating new roznamcha entry');
        await dispatch(addRoznamcha(submissionData)); // Fixed: using addRoznamcha instead of createRoznamcha
      }
      
      console.log('Submission successful');
      toast.success(isEdit ? t('roznamcha.entryUpdated') : t('roznamcha.entryCreated'));
      setFetch(prev => !prev); // Trigger refetch of data
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error submitting roznamcha:', error);
      // Display the actual error to help with debugging
      toast.error('Error saving changes: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  // Reset form when currentRow changes or dialog opens
  useEffect(() => {
    if (open) {
      if (isEdit && currentRow) {
        form.reset({
          description: currentRow?.description ?? '',
          transactionType: currentRow?.transactionType ?? 'cashReceived',
          status: currentRow?.status ?? 'pending',
          debit: currentRow?.debit ?? 0,
          credit: currentRow?.credit ?? 0,
          entryDate: currentRow?.entryDate
            ? new Date(currentRow.entryDate).toISOString().split('T')[0]
            : '',
          referenceNumber: currentRow?.referenceNumber ?? `REF-${Date.now().toString().slice(-6)}`,
        });
      } else {
        form.reset({
          description: '',
          transactionType: 'cashReceived', // Default to cashReceived since it's required
          status: 'pending',
          entryDate: new Date().toISOString().split('T')[0],
          referenceNumber: `REF-${Date.now().toString().slice(-6)}`, // Generate a reference number
          debit: 0,
          credit: 0,
        });
      }
    }
  }, [currentRow, isEdit, open, form]);

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          form.reset();
        }
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('roznamcha.editExistingEntry') : t('roznamcha.addNewEntry')}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? t('roznamcha.updateEntryDetails') : t('roznamcha.createNewEntry')}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[32rem] overflow-y-auto pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(
              async (data) => {
                // Debug form validation
                try {
                  console.log('Form submission triggered');
                  await onSubmit(data);
                } catch (error) {
                  console.error('Form submission error:', error);
                }
              }, 
              (errors) => {
                console.error('Form validation errors:', errors);
                toast.error(t('forms.formValidationError'));
              }
            )} className="space-y-2">
              
              <FormField
                control={form.control}
                name="entryDate"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{t('roznamcha.entryDate')}</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="w-full relative text-sm outline-none border-1 rounded-md focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] bg-transparent text-black dark:text-white"
                        style={urduInputStyle}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Transaction Type - Required by server */}
              <FormField
                control={form.control}
                name="transactionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='hidden'>{t('roznamcha.transactionType')}</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        options={[
                          { value: 'cashReceived', label: t('roznamcha.receive') },
                          { value: 'expenseVoucher', label: t('roznamcha.pay') },
                        ]}
                        onChange={(option: any) => field.onChange(option?.value)}
                        placeholder={t('roznamcha.selectType')}
                        value={{
                          value: field.value,
                          label:
                            field.value === 'cashReceived' 
                              ? t('roznamcha.receive') 
                              : field.value === 'expenseVoucher' 
                              ? t('roznamcha.pay') 
                              : t('roznamcha.selectType'),
                        }}
                        styles={{
                          control: (base: any) => ({
                            ...base,
                            boxShadow: 'none',
                            borderColor: 'transparent',
                            backgroundColor: 'transparent',
                            color: document.documentElement.classList.contains('dark') ? 'white' : 'black',
                            '&:hover': { borderColor: 'transparent' },
                            minHeight: isUrdu ? '2.5rem' : '2.5rem',
                            lineHeight: isUrdu ? '1.6' : 'normal',
                            fontFamily: isUrdu ? urduInputStyle?.fontFamily || 'inherit' : 'inherit',
                            borderRadius: '0.5rem',
                          }),
                          singleValue: (base: any) => ({
                            ...base,
                            maxWidth: 'full',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            lineHeight: isUrdu ? '1.6' : 'normal',
                            fontFamily: isUrdu ? urduInputStyle?.fontFamily || 'inherit' : 'inherit',
                            color: document.documentElement.classList.contains('dark') ? 'white' : 'black',
                          }),
                          option: (base: any, state: any) => {
                            const isDark = document.documentElement.classList.contains('dark');
                            return {
                              ...base,
                              backgroundColor: state.isSelected
                                ? isDark
                                  ? '#374151'
                                  : '#262E40'
                                : state.isFocused
                                ? isDark
                                  ? '#4b5563'
                                  : '#d2d5db'
                                : 'transparent',
                              color: state.isSelected ? (isDark ? 'white' : 'white') : isDark ? 'white' : 'black',
                              cursor: 'pointer',
                            };
                          },
                          menu: (base: any) => ({
                            ...base,
                            backgroundColor: document.documentElement.classList.contains('dark') ? '#1f2937' : 'white',
                            zIndex: 20,
                          }),
                        }}
                        className="col-span-4 text-sm hidden outline-none border-1 rounded-md focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] bg-transparent text-black dark:text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('roznamcha.description')}</FormLabel>
                    <FormControl>
                      <InputWithVoice
                        placeholder={t('roznamcha.enterDescription')}
                        {...field}
                        style={urduInputStyle}
                        onVoiceTranscript={(text) => {
                          // Append voice text to existing description
                          const currentValue = field.value || '';
                          const newValue = currentValue ? `${currentValue} ${text}` : text;
                          field.onChange(newValue);
                        }}
                      />
                    </FormControl>  
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="referenceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='hidden'>{t('roznamcha.referenceNumber')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('roznamcha.enterReferenceNumber')}
                        {...field}
                        style={urduInputStyle}
                        className='hidden'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="debit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('roznamcha.debit')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t('roznamcha.enterDebit')}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                        style={urduInputStyle}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="credit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('roznamcha.credit')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t('roznamcha.enterCredit')}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                        style={urduInputStyle}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('roznamcha.status')}</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        options={[
                          { value: 'pending', label: t('roznamcha.pending') },
                          { value: 'completed', label: t('roznamcha.completed') },
                        ]}
                        onChange={(option: any) => field.onChange(option?.value)}
                        value={{
                          value: field.value,
                          label:
                            field.value === 'pending'
                              ? t('roznamcha.pending')
                              : t('roznamcha.completed'),
                        }}
                        styles={{
                          control: (base: any) => ({
                            ...base,
                            boxShadow: 'none',
                            borderColor: 'transparent',
                            backgroundColor: 'transparent',
                            color: document.documentElement.classList.contains('dark')
                              ? 'white'
                              : 'black',
                            '&:hover': { borderColor: 'transparent' },
                            minHeight: isUrdu ? '2.5rem' : '2.5rem',
                            lineHeight: isUrdu ? '1.6' : 'normal',
                            fontFamily: isUrdu ? urduInputStyle?.fontFamily || 'inherit' : 'inherit',
                            borderRadius: '0.5rem',
                          }),
                          singleValue: (base: any) => ({
                            ...base,
                            maxWidth: 'full',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            lineHeight: isUrdu ? '1.6' : 'normal',
                            fontFamily: isUrdu ? urduInputStyle?.fontFamily || 'inherit' : 'inherit',
                            color: document.documentElement.classList.contains('dark')
                              ? 'white'
                              : 'black',
                          }),
                          option: (base: any, state: any) => {
                            const isDark = document.documentElement.classList.contains('dark');
                            return {
                              ...base,
                              backgroundColor: state.isSelected
                                ? isDark
                                  ? '#374151'
                                  : '#262E40'
                                : state.isFocused
                                ? isDark
                                  ? '#4b5563'
                                  : '#d2d5db'
                                : 'transparent',
                              color: state.isSelected
                                ? isDark
                                  ? 'white'
                                  : 'white'
                                : isDark
                                ? 'white'
                                : 'black',
                              cursor: 'pointer',
                            };
                          },
                          menu: (base: any) => ({
                            ...base,
                            backgroundColor: document.documentElement.classList.contains('dark')
                              ? '#1f2937'
                              : 'white',
                            zIndex: 20,
                          }),
                        }}
                        className="col-span-4 text-sm outline-none border-1 rounded-md focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] bg-transparent text-black dark:text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <DialogFooter>
                <Button type="submit">
                  {isEdit ? t('roznamcha.updateEntry') : t('roznamcha.createEntry')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
