'use client';

import React, { useEffect } from 'react';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/stores/store';
import { addTransaction, updateTransaction } from '@/stores/transaction.slice';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useUrduFontStyle } from '@/hooks/use-urdu-font';
// import { useTranslations } from '@/hooks/use-translations';
import { VoiceInputButton } from '@/components/ui/voice-input-button';

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

import { Transaction } from '../data/schema';

// Create validation schema function that uses translations
const createTransactionSchema = (t: (key: string) => string) => z.object({
  account: z.string().min(1, { message: t('forms.accountRequired') }),
  amount: z.number().min(0, { message: t('forms.amountMustBePositive') }),
  transactionType: z.string().min(1, { message: t('forms.transactionTypeRequired') }),
  transactionDate: z.string({ required_error: t('forms.transactionDateRequired') }),
  description: z.string().min(1, { message: t('forms.descriptionRequired') }),
  transactionId: z.string().optional(),
  status: z.enum(['pending', 'completed']).optional(),
  qty: z.number().min(0, { message: t('forms.qtyMustBePositive') }).optional(),
  price: z.number().min(0, { message: t('forms.priceMustBePositive') }).optional(),
  total: z.number().min(0, { message: t('forms.totalMustBePositive') }).optional(),
});

type TransactionFormValues = z.infer<ReturnType<typeof createTransactionSchema>>;

interface TransactionActionDialogProps {
  setFetch: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: Transaction | null;
}

export default function TransactionActionDialog({
  setFetch,
  open,
  onOpenChange,
  currentRow,
}: TransactionActionDialogProps) {
  const isEdit = Boolean(currentRow);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { urduInputStyle, isUrdu } = useUrduFontStyle();
  // const accountsOptions = useSelector((state: any) => state.account?.data);
  const suppliersOptions = useSelector((state: any) => state.supplier?.data);
  // console.log("accountsOptions", accountsOptions)
  console.log('currentRow', currentRow);
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(createTransactionSchema(t)),
    defaultValues: isEdit
      ? {
        account: currentRow?.account?.id ?? '',
        amount: currentRow?.amount ?? 0,
        transactionType: currentRow?.transactionType ?? '',
        transactionDate: currentRow?.transactionDate
        ? new Date(currentRow.transactionDate).toISOString().split('T')[0]
        : '',
        description: currentRow?.description ?? '',
        transactionId: currentRow?.transactionId ?? '',
        status: currentRow?.status ?? 'pending',
        qty: currentRow?.qty ?? 0,
        price: currentRow?.price ?? 0,
      }
      : {
        account: '',
        transactionType: '',
        transactionDate: new Date().toISOString().split('T')[0],
        description: '',
        transactionId: '',
        status: 'pending',
      },
  });

  const onSubmit = async (values: any) => {
    try {
      // Remove empty transactionId for new transactions
      const submissionData = { ...values };
      if (!isEdit && (!submissionData.transactionId || submissionData.transactionId === '')) {
        delete submissionData.transactionId;
      }

      if (isEdit && currentRow?.id) {
        await dispatch(updateTransaction({ ...submissionData, _id: currentRow.id }))
          .unwrap()
          .then(() => {
            toast.success(t('transactions.transactionUpdatedSuccess'));
            setFetch((prev) => !prev);
          })
          .catch(() => toast.error(t('transactions.failedToUpdateTransaction')));
      } else {
        await dispatch(addTransaction(submissionData))
          .unwrap()
          .then(() => {
            toast.success(t('transactions.transactionCreatedSuccess'));
            setFetch((prev) => !prev);
          })
          .catch(() => toast.error(t('transactions.failedToCreateTransaction')));
      }
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error(t('transactions.operationFailed'));
    }
  };

  // Auto-calculate amount when qty and price are entered
  useEffect(() => {
    const qty = form.watch('qty');
    const price = form.watch('price');
    if (
      typeof qty === 'number' &&
      typeof price === 'number' &&
      !isNaN(qty) &&
      !isNaN(price)
    ) {
      if (qty > 0 && price > 0) {
        form.setValue('amount', qty * price, { shouldValidate: true });
      }
    }
  }, [form.watch('qty'), form.watch('price')]); // Watch for changes


  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset();
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? t('transactions.editExistingTransaction') : t('transactions.addNewTransaction')}</DialogTitle>
          <DialogDescription>
            {isEdit ? t('transactions.updateTransactionDetails') : t('transactions.createNewTransaction')}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[32rem] overflow-y-auto pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              {/* <FormField
                control={form.control}
                name="account"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Account ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="transactionDate"
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>{t('transactions.transactionDate')}</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        className='w-full relative text-sm outline-none border-1 rounded-md focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] bg-transparent text-black dark:text-white' 
                        style={urduInputStyle}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transactionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('transactions.transactionType')}</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        options={[
                          { value: '', label: t('transactions.selectType') },
                          { value: 'cashReceived', label: t('transactions.receive') },
                          { value: 'expenseVoucher', label: t('transactions.pay') },
                        ]}
                        onChange={(option: any) => field.onChange(option?.value)}
                        placeholder={t('transactions.selectType')}
                        value={{
                          value: field.value,
                          label:
                            field.value === 'cashReceived' ? t('transactions.receive') : field.value === 'expenseVoucher' ? t('transactions.pay') : t('transactions.selectType'),
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
                                  ? '#374151' // dark:bg-gray-700
                                  : '#262E40'
                                : state.isFocused
                                  ? isDark
                                    ? '#4b5563' // dark:bg-gray-600
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
                        className="col-span-4 text-sm outline-none border-1 rounded-md focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] bg-transparent text-black dark:text-white"
                      />

                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="account"
                render={() => (
                  <FormItem className="space-y-0">
                    <FormLabel className="col-span-2 text-right">{t('transactions.partyName')}</FormLabel>
                    <FormControl>
                      <div className="relative w-[435px]">
                        <Controller
                          name="account"
                          control={form.control}
                          render={({ field }) => (
                            <>
                              <Select
                                {...field}
                                placeholder={t('transactions.selectParty')}
                                options={suppliersOptions}
                                value={suppliersOptions?.find((o: any) => o?.value === field?.value)} // Ensure value is correctly set
                                onChange={(option) => {
                                  // console.log("option", option)
                                  field.onChange(option?.value); // Ensure we are passing the correct value
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
                                paddingRight: '40px', // Make room for voice button
                                width: '100%',
                              }),
                              container: (base: any) => ({
                                ...base,
                                width: '100%', // Ensure container is full width
                              }),
                              singleValue: (base: any) => ({
                                ...base,
                                maxWidth: 'calc(100% - 30px)', // Make room for voice button
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
                                      ? '#374151' // dark:bg-gray-700
                                      : '#262E40'
                                    : state.isFocused
                                      ? isDark
                                        ? '#4b5563' // dark:bg-gray-600
                                        : '#d2d5db'
                                      : 'transparent',
                                  color: state.isSelected
                                    ? (isDark ? 'white' : 'white')
                                    : (isDark ? 'white' : 'black'),
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
                            className="text-sm outline-none border-1 rounded-md focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] bg-transparent text-black dark:text-white"
                          />
                              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10">
                                <VoiceInputButton 
                                  onTranscript={(text) => {
                                    // Search for matching party by name
                                    const matchingSupplier = suppliersOptions?.find((supplier: any) => 
                                      supplier.label.toLowerCase().includes(text.toLowerCase())
                                    );
                                    if (matchingSupplier) {
                                      field.onChange(matchingSupplier.value);
                                    }
                                  }}
                                  size="sm"
                                />
                              </div>
                            </>
                          )}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        options={[
                          { value: 'pending', label: 'Pending' },
                          { value: 'completed', label: 'Completed' },
                        ]}
                        onChange={(option: any) => field.onChange(option?.value)}
                        value={{
                          value: field.value,
                          label: field.value === 'pending' ? 'Pending' : 'Completed',
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
                            minHeight: '2.5rem',
                            borderRadius: '0.5rem',
                          }),
                          singleValue: (base: any) => ({
                            ...base,
                            maxWidth: 'full',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
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
                                  ? '#374151' // dark:bg-gray-700
                                  : '#262E40'
                                : state.isFocused
                                  ? isDark
                                    ? '#4b5563' // dark:bg-gray-600
                                    : '#d2d5db'
                                  : 'transparent',
                              color: state.isSelected
                                ? (isDark ? 'white' : 'white')
                                : (isDark ? 'white' : 'black'),
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



              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('transactions.description')}</FormLabel>
                    <FormControl>
                      <InputWithVoice 
                        placeholder={t('transactions.description')} 
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
                name="transactionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('transactions.transactionId')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t('transactions.enterTransactionId')} 
                        {...field} 
                        style={urduInputStyle}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('transactions.qty')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t('transactions.enterQty')}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        style={urduInputStyle}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('transactions.price')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t('transactions.enterPrice')}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        style={urduInputStyle}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('transactions.amount')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t('transactions.amount')}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        style={urduInputStyle}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <DialogFooter>
                <Button type="submit">{isEdit ? t('transactions.updateTransaction') : t('transactions.createTransaction')}</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
