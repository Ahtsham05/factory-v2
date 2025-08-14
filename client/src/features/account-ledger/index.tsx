'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useUrduFontStyle } from '@/hooks/use-urdu-font';
import { useTranslations } from '@/hooks/use-translations';
import TransactionsProvider from '../transactions/context/users-context';
import { Header } from '@/components/layout/header';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Main } from '@/components/layout/main';
import { selectBoxStyle } from '@/assets/styling';
import { useNavigate } from '@tanstack/react-router';
import { VoiceInputButton } from '@/components/ui/voice-input-button';

// Create validation schema function that uses translations
const createAccountLedgerSchema = (t: (key: string) => string) => z.object({
  account: z.string().min(1, { message: t('forms.accountRequired') }),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type AccountLedgerFormValues = z.infer<ReturnType<typeof createAccountLedgerSchema>>;

export default function AccountLedger() {
  const { t } = useTranslation();
  const { urduSelectStyle, isUrdu } = useUrduFontStyle();
  const { currentLanguage } = useTranslations();
  const [fetching, setFetching] = useState(false);
  // Fallback to an empty array if accountsOptions is null or undefined
  const storeAccounts = useSelector((state: any) => state.supplier?.data) || []
  const accountsOptions = storeAccounts?.filter((account: any) => !account.customer && !account.supplier);
  const today = new Date().toISOString().slice(0, 10);
  const form = useForm<AccountLedgerFormValues>({
    resolver: zodResolver(createAccountLedgerSchema(t)),
    defaultValues: {
      account: '',
      startDate: today,
      endDate: today,
    },
  });

  const navigate = useNavigate()
  const onSubmit = async (values: AccountLedgerFormValues) => {
    setFetching(true);
    try {
      navigate({ to: `/account-ledger-detail?account=${values.account}&startDate=${values.startDate}&endDate=${values.endDate}`, replace: true })
    } catch (error) {
      toast.error(t('accountLedger.failedToFetchTransactions'));
    } finally {
      setFetching(false);
    }
  };

  return (
    <TransactionsProvider>
      <Header fixed>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <LanguageSwitcher />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div>
            <h2 className={`text-2xl font-bold tracking-tight ${isUrdu ? 'urdu-font' : ''}`}>{t('accountLedger.partyLedger')}</h2>
            <p className={`text-muted-foreground mt-4 ${isUrdu ? 'urdu-font' : ''}`}>{t('accountLedger.managePartyLedger')}</p>
          </div>
          {/* <TransactionPrimaryButtons /> */}
        </div>
        <div className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-lang={currentLanguage}>
            {/* account Select */}
            <div>
              <label htmlFor="account" className={`block text-sm font-medium mb-2 ${isUrdu ? 'urdu-font' : ''}`}>
                {t('accountLedger.party')}
              </label>
              <div className="relative">
                <Controller
                  name="account"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={accountsOptions}
                      placeholder={t('accountLedger.selectParty')}
                      value={accountsOptions?.find((o: any) => o?.value === field?.value)}
                      onChange={(option) => field.onChange(option?.value)}
                      styles={{
                        ...selectBoxStyle,
                        ...urduSelectStyle
                      }}
className={`col-span-4 text-sm outline-none border-1 rounded-md focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] bg-transparent text-black dark:text-white leading-[2.5] ${isUrdu ? 'urdu-font' : ''}`}
                      classNamePrefix="react-select"
                    />
                  )}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10">
                  <VoiceInputButton
                    onTranscript={(transcript) => {
                      console.log('Voice transcript:', transcript);
                      console.log('Current language:', currentLanguage);
                      console.log('Available accounts:', accountsOptions);
                      
                      // Search in ALL fields of each account (both English and Urdu)
                      const matchingAccount = accountsOptions?.find((account: any) => {
                        // Get all possible name fields
                        const englishName = account.label || account.name || account.title || '';
                        const urduName = account.label || account.name || account.title || '';
                        
                        console.log('Checking account - English:', englishName, ', Urdu:', urduName, 'against transcript:', transcript);
                        
                        // Check English fields (case-insensitive)
                        const englishMatch = englishName.toLowerCase().includes(transcript.toLowerCase()) ||
                                           transcript.toLowerCase().includes(englishName.toLowerCase());
                        
                        // Check Urdu fields (direct match, preserving Urdu characters)
                        const urduMatch = (urduName && (
                          urduName.includes(transcript) || 
                          transcript.includes(urduName)
                        ));
                        
                        console.log('English match:', englishMatch, 'Urdu match:', urduMatch);
                        
                        // Return true if either English or Urdu matches
                        return englishMatch || urduMatch;
                      });
                      
                      console.log('Final matching account found:', matchingAccount);
                      
                      if (matchingAccount) {
                        form.setValue('account', matchingAccount.value || matchingAccount.id);
                        // Show name in current language preference, with fallback
                        const displayName = currentLanguage === 'ur' 
                          ? (matchingAccount.urduName || matchingAccount.nameUrdu || matchingAccount.label_ur || matchingAccount.name_ur || matchingAccount.label || matchingAccount.name || matchingAccount.title)
                          : (matchingAccount.label || matchingAccount.name || matchingAccount.title || matchingAccount.urduName || matchingAccount.nameUrdu);
                        toast.success(`Account Selected: ${displayName}`);
                      } else {
                        toast.error(`Account not found: "${transcript}"`);
                      }
                    }}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="flex space-x-4">
              <div className="w-full">
                <label htmlFor="startDate" className={`block text-sm font-medium mb-2 ${isUrdu ? 'urdu-font' : ''}`}>
                  {t('accountLedger.startDate')}
                </label>
                <Controller
                  name="startDate"
                  control={form.control}
                  render={({ field }) => (
                    <Input type="date" {...field} className="w-full" />
                  )}
                />
              </div>
              <div className="w-full">
                <label htmlFor="endDate" className={`block text-sm font-medium mb-2 ${isUrdu ? 'urdu-font' : ''}`}>
                  {t('accountLedger.endDate')}
                </label>
                <Controller
                  name="endDate"
                  control={form.control}
                  render={({ field }) => (
                    <Input type="date" {...field} className="w-full" />
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <Button 
                type="submit" 
                disabled={fetching} 
                className={`mt-4 ${isUrdu ? 'urdu-font' : ''}`}
              >
                {fetching ? t('accountLedger.fetchingLedger') : t('accountLedger.getLedger')}
              </Button>
            </div>
          </form>
        </div>
      </Main>
    </TransactionsProvider>
  );
}
