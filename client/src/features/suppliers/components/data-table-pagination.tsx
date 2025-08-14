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
  isRTL?: boolean; // Add RTL support
}

export function DataTablePagination<TData>({
  table,
  paggination,
  isRTL = false
}: DataTablePaginationProps<TData>) {
  const { limit, setLimit, currentPage, setCurrentPage, totalPage } = paggination;
  const { t } = useTranslation();

  return (
    <div
      className={`flex items-center justify-between overflow-clip px-2 ${isRTL ? 'flex-row-reverse' : ''}`}
      style={{ overflowClipMargin: 1 }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className={`text-muted-foreground hidden flex-1 text-sm sm:block ${isRTL ? 'text-right' : ''}`}>
        {table.getFilteredSelectedRowModel().rows.length} {t('common.of')}{' '}
        {table.getFilteredRowModel().rows.length} {t('common.selected')}.
      </div>
      <div className={`flex items-center ${isRTL ? 'sm:space-x-reverse lg:space-x-reverse' : 'sm:space-x-6 lg:space-x-8'}`}>
        <div className={`flex items-center ${isRTL ? 'space-x-reverse flex-row-reverse' : 'space-x-2'}`}>
          <p className="hidden text-sm font-medium sm:block">{t('common.rowsPerPage')}</p>
          <Select
            value={`${limit}`}
            onValueChange={(value) => {
              setLimit(Number(value)); // Update the page size (limit)
              setCurrentPage(1); // Reset to first page when page size changes
              // Remove table.setPageSize to avoid conflicts with server-side pagination
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
        <div className={`flex items-center ${isRTL ? 'space-x-reverse flex-row-reverse' : 'space-x-2'}`}>
          {isRTL ? (
            <>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => setCurrentPage(totalPage)} // Go to last page
                disabled={currentPage === totalPage}
              >
                <span className="sr-only">{t('common.goToLastPage')}</span>
                <DoubleArrowRightIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(currentPage + 1)} // Go to next page
                disabled={currentPage === totalPage}
              >
                <span className="sr-only">{t('common.goToNextPage')}</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(currentPage - 1)} // Go to previous page
                disabled={currentPage === 1}
              >
                <span className="sr-only">{t('common.goToPreviousPage')}</span>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => setCurrentPage(1)} // Go to first page
                disabled={currentPage === 1}
              >
                <span className="sr-only">{t('common.goToFirstPage')}</span>
                <DoubleArrowLeftIcon className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => setCurrentPage(1)} // Go to first page
                disabled={currentPage === 1}
              >
                <span className="sr-only">{t('common.goToFirstPage')}</span>
                <DoubleArrowLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(currentPage - 1)} // Go to previous page
                disabled={currentPage === 1}
              >
                <span className="sr-only">{t('common.goToPreviousPage')}</span>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(currentPage + 1)} // Go to next page
                disabled={currentPage === totalPage}
              >
                <span className="sr-only">{t('common.goToNextPage')}</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => setCurrentPage(totalPage)} // Go to last page
                disabled={currentPage === totalPage}
              >
                <span className="sr-only">{t('common.goToLastPage')}</span>
                <DoubleArrowRightIcon className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
