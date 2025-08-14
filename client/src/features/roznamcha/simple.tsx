'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/stores/store';
import { fetchRoznamchas } from '@/stores/roznamcha.slice';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

export default function RoznamchaPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { data: roznamchas, loading } = useSelector((state: RootState) => state.roznamcha);

  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [currentPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    const params = {
      page: currentPage,
      limit,
      sortBy: 'createdAt:desc',
      ...(searchTerm && { search: searchTerm }),
      ...(searchTerm && { fieldName: 'description' }),
    };
    
    dispatch(fetchRoznamchas(params));
  }, [dispatch, currentPage, limit, searchTerm]);

  const handleAddNew = () => {
    console.log('Add new clicked');
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('roznamcha.title')}</h1>
          <p className="text-muted-foreground">{t('roznamcha.manageRoznamcha')}</p>
        </div>
        <Button onClick={handleAddNew} className="md:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          {t('roznamcha.addNewEntry')}
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <Input
          placeholder={t('roznamcha.searchRoznamcha')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Simple Content */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex h-[50vh] items-center justify-center">
            <Loader2 className="animate-spin size-8" />
          </div>
        ) : (
          <div className="rounded-md border p-4">
            <p>Data count: {roznamchas?.length || 0}</p>
            <pre className="text-xs max-h-96 overflow-auto">
              {JSON.stringify(roznamchas, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
