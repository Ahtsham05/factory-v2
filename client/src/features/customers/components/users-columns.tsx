import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { Customer } from '../data/schema'  // Changed from Product to Customer
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { useTranslation } from 'react-i18next'

// Create columns function to access translations
export const createColumns = (): ColumnDef<Customer>[] => {
  const { t } = useTranslation()
  
  return [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('parties.name')} />,
    cell: ({ row }) => <LongText className='max-w-36'>{row.getValue('name')}</LongText>,
    enableHiding: true,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('parties.email')} />,
    cell: ({ row }) => <LongText className='max-w-36'>{row.getValue('email')}</LongText>,
    enableHiding: true,
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('parties.phone')} />,
    cell: ({ row }) => <div>{row.getValue('phone')}</div>,
  },
  {
    accessorKey: 'whatsapp',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('parties.whatsapp')} />,
    cell: ({ row }) => <div>{row.getValue('whatsapp')}</div>,
  },
  {
    accessorKey: 'address',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('parties.address')} />,
    cell: ({ row }) => <div>{row.getValue('address')}</div>,
  },
  {
    id: 'actions',
    header: t('parties.actions'),
    cell: DataTableRowActions,
  }
]
}
