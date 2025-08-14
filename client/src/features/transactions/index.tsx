import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/stores/store';
import { fetchTransactions } from '@/stores/transaction.slice';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input-localized';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useTranslation } from 'react-i18next';
import TransactionsProvider from './context/users-context';
import TransactionPrimaryButtons from './components/users-primary-buttons';
import TransactionTable from './components/users-table';
import TransactionsDialogs from './components/users-dialogs';
import { createColumns } from './components/users-columns';
import { useUrduFontStyle } from '@/hooks/use-urdu-font';

export default function Transactions() {
  const { t, i18n } = useTranslation();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const [fetch, setFetch] = useState(false);
  const { urduInputStyle } = useUrduFontStyle();
  const isUrdu = i18n.language === 'ur';
  
  // Get columns with translations
  const columns = createColumns(t);
  // console.log("transactions transactions",transactions)

  useEffect(() => {
    setLoading(true);
    const params = {
      page: currentPage,
      limit,
      sortBy: 'createdAt:desc',
      ...(search && { search }),
      ...(search && { fieldName: 'description,account.name' }), // Search in description and account name fields
    };
    dispatch(fetchTransactions(params)).then((data) => {
      setTransactions(data.payload?.results ?? []);
      setTotalPage(data.payload?.totalPages ?? 1);
      setLimit(data.payload?.limit ?? 10);
      setLoading(false);
    });
  }, [currentPage, limit, search, dispatch, fetch]);

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
      <Main dir={isUrdu ? 'rtl' : 'ltr'}>
        <div className={`mb-2 flex flex-wrap items-center justify-between space-y-2 ${isUrdu ? 'flex-row-reverse' : ''}`}>
          <div className={isUrdu ? 'text-right' : ''}>
            <h2 
              className="text-2xl font-bold tracking-tight"
              style={isUrdu ? urduInputStyle : {}}
            >
              {t('transactions.title')}
            </h2>
            <p 
              className="text-muted-foreground mt-4"
              style={isUrdu ? urduInputStyle : {}}
            >
              {t('transactions.manageTransactions')}
            </p>
          </div>
          <TransactionPrimaryButtons />
        </div>
        <div className={isUrdu ? 'text-right' : ''}>
          <Input
            placeholder={t('transactions.searchTransactionsMultiple')}
            className="h-8 w-[150px] lg:w-[250px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            dir={isUrdu ? 'rtl' : 'ltr'}
          />
        </div>
        <div className={`-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 ${isUrdu ? 'lg:space-x-reverse' : ''} lg:space-x-12`}>
          {loading ? (
            <div className="flex h-[50vh] items-center justify-center">
              <Loader2 className="animate-spin size-8" />
            </div>
          ) : (
            <TransactionTable
              data={transactions ?? []}
              columns={columns}
              paggination={{ totalPage, currentPage, setCurrentPage, limit, setLimit }}
              isRTL={isUrdu}
            />
          )}
        </div>
      </Main>
      <TransactionsDialogs setFetch={setFetch} />
    </TransactionsProvider>
  );
}
