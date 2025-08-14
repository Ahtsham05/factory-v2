import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

interface DataTablePaginationProps<TData> {
  table: Table<TData>; // The table instance (usually contains methods like setPageSize, setPageIndex, etc.)
  paggination: {
    limit: number; // Current page size
    setLimit: (limit: number) => void; // Function to update limit
    currentPage: number; // Current page number
    setCurrentPage: (page: number) => void; // Function to update the current page
    totalPage: number; // Total number of pages
  };
  data?: TData[]; // Add data prop for server-side pagination
}

export function DataTablePagination<TData>({
  table,
  paggination,
  data = [],
}: DataTablePaginationProps<TData>) {
  const { limit, setLimit, currentPage, setCurrentPage, totalPage } = paggination;
  const { t } = useTranslation();

  return (
    <div
      className="flex items-center justify-between overflow-clip px-2"
      style={{ overflowClipMargin: 1 }}
    >
      <div className="text-muted-foreground hidden flex-1 text-sm sm:block">
        {table.getFilteredSelectedRowModel().rows.length} {t('common.of')}{' '}
        {data.length} {t('common.entries')} {t('common.selected')}.
      </div>
      <div className="flex items-center sm:space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="hidden text-sm font-medium sm:block">
            {t('common.rowsPerPage')}
          </p>
          <Select
            value={`${limit}`}
            onValueChange={(value) => {
              const newLimit = Number(value);
              setLimit(newLimit); // Update the page size (limit)
              setCurrentPage(1); // Reset to first page when page size changes
              // Don't call table.setPageSize as we're using manual pagination
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={limit} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {t('common.page')} {currentPage} {t('common.of')} {totalPage}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            title={t('common.goToFirstPage')}
          >
            <span className="sr-only">{t('common.goToFirstPage')}</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            title={t('common.goToPreviousPage')}
          >
            <span className="sr-only">{t('common.goToPreviousPage')}</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setCurrentPage(Math.min(totalPage, currentPage + 1))}
            disabled={currentPage === totalPage || totalPage === 0}
            title={t('common.goToNextPage')}
          >
            <span className="sr-only">{t('common.goToNextPage')}</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setCurrentPage(totalPage)}
            disabled={currentPage === totalPage || totalPage === 0}
            title={t('common.goToLastPage')}
          >
            <span className="sr-only">{t('common.goToLastPage')}</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
