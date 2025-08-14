'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/stores/store';
import { fetchRoznamchas } from '@/stores/roznamcha.slice';
import { useTranslation } from 'react-i18next';
import { formatNumber } from '@/utils/formatNumber';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input-localized';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { LanguageSwitcher } from '@/components/language-switcher';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus, Edit, Trash2 } from 'lucide-react';

import RoznamchaActionDialog from './components/roznamcha-action-dialog';
import RoznamchaDeleteDialog from './components/roznamcha-delete-dialog';
// import { RoznamchaPagination } from './components/roznamcha-pagination';
import { Roznamcha } from './data/schema';

export default function RoznamchaPage() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { data: roznamchas, loading } = useSelector((state: RootState) => state.roznamcha);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<Roznamcha | null>(null);
  const [fetch, setFetch] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const isUrdu = i18n.language === 'ur';

  useEffect(() => {
    const params = {
      sortBy: 'createdAt:asc',
      ...(searchTerm && { search: searchTerm }),
      ...(searchTerm && { fieldName: 'description' }),
      // Filter by selected date and fetch all data for that date
      date: selectedDate.toISOString().slice(0, 10),
      // Remove pagination limits to get all entries for the day
      limit: 1000, // Set a high limit to get all entries
      page: 1,
    };
    
    dispatch(fetchRoznamchas(params)).then((data) => {
      if (data.payload) {
        // Calculate balance for the day
        const roznamchaData = data.payload?.results || [];
        let currentBalance = 0;
        roznamchaData.forEach((item: Roznamcha) => {
          currentBalance += (item.debit || 0) - (item.credit || 0);
        });
      }
    });
  }, [dispatch, fetch, searchTerm, selectedDate]);

  // Get the actual data to display based on current pagination
  const paginatedData = roznamchas || [];

  const handleEdit = (roznamcha: Roznamcha) => {
    setCurrentRow(roznamcha);
    setIsDialogOpen(true);
  };

  const handleDelete = (roznamcha: Roznamcha) => {
    setCurrentRow(roznamcha);
    setIsDeleteDialogOpen(true);
  };

  const handleAddNew = () => {
    setCurrentRow(null);
    setIsDialogOpen(true);
  };

  const filteredData = paginatedData || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isUrdu ? 'ur-PK' : 'en-US');
  };

  return (
    <>
      <Header fixed>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <LanguageSwitcher />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="space-y-6">
          {/* Header */}
          <div className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-between ${isUrdu ? 'md:flex-row-reverse' : ''}`}>
            <div className={isUrdu ? 'text-right' : ''}>
              <h1 
                className="text-2xl font-bold tracking-tight"
                style={isUrdu ? { fontFamily: 'Noto Nastaliq Urdu, serif' } : {}}
              >
                {t('roznamcha.title')}
              </h1>
              <p 
                className="text-muted-foreground"
                style={isUrdu ? { fontFamily: 'Noto Nastaliq Urdu, serif' } : {}}
              >
                {t('roznamcha.manageRoznamcha')}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* <div className="text-lg font-semibold">
                {t('roznamcha.debit')}: {formatNumber(balance > 0 ? balance : 0, isUrdu)}
              </div>
              <div className="text-lg font-semibold">
                {t('roznamcha.credit')}: {formatNumber(balance < 0 ? Math.abs(balance) : 0, isUrdu)}
              </div> */}
              <Button onClick={handleAddNew} className="md:w-auto" dir={isUrdu ? 'rtl' : 'ltr'}>
                <Plus className={`${isUrdu ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                <span style={isUrdu ? { fontFamily: 'Noto Nastaliq Urdu, serif' } : {}}>
                  {t('roznamcha.addNewEntry')}
                </span>
              </Button>
            </div>
          </div>

          {/* Date Picker and Search */}
          <div className={`flex items-center ${isUrdu ? 'space-x-reverse space-x-4 flex-row-reverse' : 'space-x-4'}`}>
            <input
              type="date"
              value={selectedDate.toISOString().slice(0, 10)}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2"
              dir={isUrdu ? 'rtl' : 'ltr'}
            />
            <Input
              placeholder={t('roznamcha.searchRoznamcha')}
              className="h-10 w-[150px] lg:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              dir={isUrdu ? 'rtl' : 'ltr'}
            />
          </div>

          {/* Entries List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="animate-spin size-8" />
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table dir={isUrdu ? 'rtl' : 'ltr'}>
                    <TableHeader>
                      <TableRow>
                        <TableHead className={isUrdu ? 'text-right' : 'text-left'}>
                          {t('roznamcha.entryDate')}
                        </TableHead>
                        <TableHead className={isUrdu ? 'text-right' : 'text-left'}>
                          {t('roznamcha.description')}
                        </TableHead>
                        {/* <TableHead className={isUrdu ? 'text-right' : 'text-left'}>
                          {t('roznamcha.referenceNumber')}
                        </TableHead> */}
                        <TableHead className={isUrdu ? 'text-right' : 'text-left'}>
                          {t('roznamcha.debit')}
                        </TableHead>
                        <TableHead className={isUrdu ? 'text-right' : 'text-left'}>
                          {t('roznamcha.credit')}
                        </TableHead>
                        <TableHead className={isUrdu ? 'text-right' : 'text-left'}>
                          {t('cashBook.balance')}
                        </TableHead>
                        <TableHead className={isUrdu ? "w-[50px] text-left" : "w-[50px]"}></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">
                            {t('common.noData')}
                          </TableCell>
                        </TableRow>
                      ) : (
                        (() => {
                          let runningBalance = 0;
                          return filteredData.map((roznamcha: Roznamcha) => {
                            runningBalance += (roznamcha.debit || 0) - (roznamcha.credit || 0);
                            return (
                              <TableRow key={roznamcha.id || roznamcha._id}>
                                <TableCell className="text-right">
                                  {roznamcha.entryDate ? formatDate(roznamcha.entryDate) : '-'}
                                </TableCell>
                                <TableCell 
                                  className={isUrdu ? 'font-urdu' : ''}
                                  style={isUrdu ? { fontFamily: 'Noto Nastaliq Urdu, serif' } : {}}
                                >
                                  {roznamcha.description || '-'}
                                </TableCell>
                                {/* <TableCell>
                                  {roznamcha.referenceNumber || '-'}
                                </TableCell> */}
                                <TableCell>
                                  {roznamcha.debit ? formatNumber(roznamcha.debit, isUrdu) : '-'}
                                </TableCell>
                                <TableCell>
                                  {roznamcha.credit ? formatNumber(roznamcha.credit, isUrdu) : '-'}
                                </TableCell>
                                <TableCell>
                                  {formatNumber(runningBalance, isUrdu)}
                                </TableCell>
                                <TableCell>
                                  <div className={isUrdu ? "flex justify-end" : ""}>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                          <span className="sr-only">{t('common.openMenu')}</span>
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                    <DropdownMenuContent align={isUrdu ? "start" : "end"} className={isUrdu ? "rtl-menu" : ""}>
                                      <DropdownMenuItem onClick={() => handleEdit(roznamcha)} className={isUrdu ? "flex-row-reverse justify-between" : ""}>
                                        {isUrdu && (
                                          <span style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                                            {t('common.edit')}
                                          </span>
                                        )}
                                        <Edit className="h-4 w-4" />
                                        {!isUrdu && t('common.edit')}
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        onClick={() => handleDelete(roznamcha)}
                                        className={`text-red-600 ${isUrdu ? "flex-row-reverse justify-between" : ""}`}
                                      >
                                        {isUrdu && (
                                          <span style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                                            {t('common.delete')}
                                          </span>
                                        )}
                                        <Trash2 className="h-4 w-4" />
                                        {!isUrdu && t('common.delete')}
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          });
                        })()
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Remove pagination since we're showing all entries for the selected date */}
              </>
            )}
          </div>

          {/* Table for later use - commented out */}
          {/* 
          <div className="space-y-4">
            {loading ? (
              <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="animate-spin size-8" />
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table dir={isUrdu ? 'rtl' : 'ltr'}>
                    <TableHeader>
                      <TableRow>
                        <TableHead className={isUrdu ? 'text-right' : 'text-left'}>
                          {t('roznamcha.entryDate')}
                        </TableHead>
                        <TableHead className={isUrdu ? 'text-right' : 'text-left'}>
                          {t('roznamcha.transactionType')}
                        </TableHead>
                        <TableHead className={isUrdu ? 'text-right' : 'text-left'}>
                          {t('roznamcha.description')}
                        </TableHead>
                        <TableHead className={isUrdu ? 'text-right' : 'text-left'}>
                          {t('roznamcha.referenceNumber')}
                        </TableHead>
                        <TableHead className={isUrdu ? 'text-right' : 'text-left'}>
                          {t('roznamcha.debit')}
                        </TableHead>
                        <TableHead className={isUrdu ? 'text-right' : 'text-left'}>
                          {t('roznamcha.credit')}
                        </TableHead>
                        <TableHead className={isUrdu ? 'text-right' : 'text-left'}>
                          {t('roznamcha.status')}
                        </TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-4">
                            {t('common.noData')}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredData.map((roznamcha: Roznamcha) => (
                          <TableRow key={roznamcha.id || roznamcha._id}>
                            <TableCell className={isUrdu ? 'text-right' : 'text-left'}>
                              {roznamcha.entryDate ? formatDate(roznamcha.entryDate) : '-'}
                            </TableCell>
                            <TableCell className={isUrdu ? 'text-right' : 'text-left'}>
                              <Badge variant={roznamcha.transactionType === 'cashReceived' ? 'default' : 'destructive'}>
                                {roznamcha.transactionType === 'cashReceived' 
                                  ? t('roznamcha.receive') 
                                  : t('roznamcha.pay')
                                }
                              </Badge>
                            </TableCell>
                            <TableCell 
                              className={isUrdu ? 'text-right font-urdu' : 'text-left'}
                              style={isUrdu ? { fontFamily: 'Noto Nastaliq Urdu, serif' } : {}}
                            >
                              {roznamcha.description || '-'}
                            </TableCell>
                            <TableCell className={isUrdu ? 'text-right' : 'text-left'}>
                              {roznamcha.referenceNumber || '-'}
                            </TableCell>
                            <TableCell className={isUrdu ? 'text-right' : 'text-left'}>
                              {roznamcha.debit ? formatNumber(roznamcha.debit, isUrdu) : '-'}
                            </TableCell>
                            <TableCell className={isUrdu ? 'text-right' : 'text-left'}>
                              {roznamcha.credit ? formatNumber(roznamcha.credit, isUrdu) : '-'}
                            </TableCell>
                            <TableCell className={isUrdu ? 'text-right' : 'text-left'}>
                              {getStatusBadge(roznamcha.status || 'pending')}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">{t('common.openMenu')}</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align={isUrdu ? "start" : "end"} className={isUrdu ? "rtl-menu" : ""}>
                                  <DropdownMenuItem onClick={() => handleEdit(roznamcha)} className={isUrdu ? "flex-row-reverse justify-between" : ""}>
                                    {isUrdu && (
                                      <span style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                                        {t('common.edit')}
                                      </span>
                                    )}
                                    <Edit className="h-4 w-4" />
                                    {!isUrdu && t('common.edit')}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDelete(roznamcha)}
                                    className={`text-red-600 ${isUrdu ? "flex-row-reverse justify-between" : ""}`}
                                  >
                                    {isUrdu && (
                                      <span style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                                        {t('common.delete')}
                                      </span>
                                    )}
                                    <Trash2 className="h-4 w-4" />
                                    {!isUrdu && t('common.delete')}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <RoznamchaPagination
                  pagination={{
                    limit,
                    setLimit,
                    currentPage,
                    setCurrentPage,
                    totalPage,
                  }}
                  totalItems={totalItems}
                />
              </>
            )}
          </div>
          */}
        </div>
      </Main>

      {/* Action Dialog */}
      <RoznamchaActionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        currentRow={currentRow}
        setFetch={setFetch}
      />

      {/* Delete Dialog */}
      {currentRow && (
        <RoznamchaDeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          currentRow={currentRow}
          setFetch={setFetch}
        />
      )}
    </>
  );
}
