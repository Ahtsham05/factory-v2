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
import { useTranslation } from 'react-i18next';

interface RoznamchaPaginationProps {
  pagination: {
    limit: number;
    setLimit: (limit: number) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPage: number;
  };
  totalItems: number;
}

export function RoznamchaPagination({
  pagination,
  totalItems,
}: RoznamchaPaginationProps) {
  const { limit, setLimit, currentPage, setCurrentPage, totalPage } = pagination;
  const { t, i18n } = useTranslation();

  const isUrdu = i18n.language === 'ur';
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  const handleLimitChange = (value: string) => {
    const newLimit = Number(value);
    setLimit(newLimit);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  return (
    <div
      className="flex items-center justify-between overflow-clip px-2"
      style={{ overflowClipMargin: 1 }}
    >
      <div className={`text-muted-foreground hidden flex-1 text-sm sm:block ${isUrdu ? 'text-right' : 'text-left'}`}>
        {t('common.showing')} {startItem} {t('common.to')} {endItem} {t('common.of')} {totalItems} {t('common.entries')}
      </div>
      <div className="flex items-center sm:space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className={`hidden text-sm font-medium sm:block ${isUrdu ? 'text-right' : 'text-left'}`}>
            {t('common.rowsPerPage')}
          </p>
          <Select
            value={limit.toString()}
            onValueChange={handleLimitChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={limit.toString()} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className={`flex w-[100px] items-center justify-center text-sm font-medium ${isUrdu ? 'text-right' : 'text-left'}`}>
          {t('common.page')} {currentPage} {t('common.of')} {totalPage}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">{t('common.goToFirstPage')}</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <span className="sr-only">{t('common.goToPreviousPage')}</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setCurrentPage(Math.min(totalPage, currentPage + 1))}
            disabled={currentPage === totalPage || totalPage === 0}
          >
            <span className="sr-only">{t('common.goToNextPage')}</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setCurrentPage(totalPage)}
            disabled={currentPage === totalPage || totalPage === 0}
          >
            <span className="sr-only">{t('common.goToLastPage')}</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
