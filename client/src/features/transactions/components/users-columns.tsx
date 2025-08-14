import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Transaction } from '../data/schema';

// Create columns function to access translations
export const createColumns = (t: (key: string) => string): ColumnDef<Transaction>[] => {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    },
    {
      accessorKey: 'transactionDate',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('transactions.transactionDate')} />,
      cell: ({ row }) => {
        const date = row.getValue('transactionDate');
        if (typeof date === 'string' || typeof date === 'number' || date instanceof Date) {
          return new Date(date).toLocaleDateString();
        }
        return '-';
      },
    },
    {
      accessorKey: 'transactionType',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('transactions.transactionType')} />,
      cell: ({getValue})=> getValue() === "cashReceived" ? t('transactions.receive') : t('transactions.pay'),
    },
    {
      accessorKey: 'account.name',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('transactions.party')} />,
      meta: {
        className: 'min-w-[150px]',
      },
    },
    {
      accessorKey: 'description',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('transactions.description')} />,
    },
    {
      accessorKey: 'transactionId',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('transactions.transactionId')} />,
    },
    {
      accessorKey: 'qty',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('transactions.quantity')} />,
    },
    {
      accessorKey: 'price',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('transactions.price')} />,
    },
    // {
    //   accessorKey: 'amount',
    //   header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    // },
    {
      accessorKey: 'debit',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('transactions.debit')} />,
    },
    {
      accessorKey: 'credit',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('transactions.credit')} />,
    },
    {
      id: 'actions',
      header: t('transactions.actions'),
      cell: DataTableRowActions,
    },
  ];
};

// Legacy export for backward compatibility - with fallback English text
export const columns: ColumnDef<Transaction>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: 'transactionDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Transaction Date" />,
    cell: ({ row }) => {
      const date = row.getValue('transactionDate');
      if (typeof date === 'string' || typeof date === 'number' || date instanceof Date) {
        return new Date(date).toLocaleDateString();
      }
      return '-';
    },
  },
  {
    accessorKey: 'transactionType',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Transaction Type" />,
    cell: ({getValue})=> getValue() === "cashReceived" ? "Receive" : "Pay",
  },
  {
    accessorKey: 'account.name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Party" />,
    meta: {
      className: 'min-w-[150px]',
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
  },
  {
    accessorKey: 'transactionId',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Transaction ID" />,
  },
  {
    accessorKey: 'qty',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity" />,
  },
  {
    accessorKey: 'price',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
  },
  {
    accessorKey: 'debit',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Debit" />,
  },
  {
    accessorKey: 'credit',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Credit" />,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: DataTableRowActions,
  },
];
