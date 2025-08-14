import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { LanguageSwitcher } from '@/components/language-switcher'
import { getColumns } from './components/users-columns' // Adjusted for users
import SupplierDialogs from './components/users-dialogs' // Adjusted for users
import SupplierPrimaryButtons from './components/users-primary-buttons' // Adjusted for users
import { SupplierTable } from './components/users-table' // Adjusted for users
import SupplierProvider from './context/users-context' // Adjusted for suppliers
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/stores/store'
import { useEffect, useState } from 'react'
import { fetchSuppliers } from '@/stores/supplier.slice' // Adjusted to supplier slice
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input-localized'
import { useTranslation } from 'react-i18next'
import { useUrduFontStyle } from '@/hooks/use-urdu-font'

export default function Suppliers() {
  const { t, i18n } = useTranslation()
  const [suppliers, setSuppliers] = useState([]) // Changed from customers to suppliers
  const [totalPage, setTotalPage] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [fetch, setFetch] = useState(false)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const { urduInputStyle } = useUrduFontStyle()
  const isUrdu = i18n.language === 'ur'

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    setLoading(true)
    const params = {
      page: currentPage,
      limit: limit,
      sortBy: 'createdAt:desc',
      ...(search && { search: search }),
      ...(search && { fieldName: 'name' })
    };
    dispatch(fetchSuppliers(params)).then((data) => {
      setSuppliers(data.payload?.results) // Changed from customers to suppliers
      setTotalPage(data.payload?.totalPages)
      setLimit(data.payload?.limit)
      setLoading(false)
    })
  }, [currentPage, limit, fetch, search, dispatch])

  return (
    <SupplierProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <LanguageSwitcher />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main dir={isUrdu ? 'rtl' : 'ltr'}>
        <div className={`mb-2 flex flex-wrap items-center justify-between space-y-2 ${isUrdu ? 'flex-row-reverse' : ''}`}>
          <div className={isUrdu ? 'text-right' : ''}>
            <h2 
              className='text-2xl font-bold tracking-tight'
              style={isUrdu ? urduInputStyle : {}}
            >
              {t('parties.title')}
            </h2>
            <p 
              className='text-muted-foreground mt-4'
              style={isUrdu ? urduInputStyle : {}}
            >
              {t('parties.manageParties')}
            </p>
          </div>
          <SupplierPrimaryButtons />
        </div>
        <div className={isUrdu ? 'text-right' : ''}>
          <Input
            placeholder={t('parties.searchParties')}
            className='h-8 w-[150px] lg:w-[250px]'
            value={search ?? ''}
            onChange={(event) => setSearch(event.target.value)}
            dir={isUrdu ? 'rtl' : 'ltr'}
          />
        </div>
        <div className={`-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 ${isUrdu ? 'lg:space-x-reverse' : ''} lg:space-x-12`}>
          {
            loading ? (
              <div className='flex h-[50vh] items-center justify-center'><Loader2 className='animate-spin size-8' /></div>
            ) : (
              <SupplierTable
                data={suppliers}
                columns={getColumns(t)}
                paggination={{ totalPage, currentPage, setCurrentPage, limit, setLimit }}
                isRTL={isUrdu}
              />
            )
          }
        </div>
      </Main>

      <SupplierDialogs setFetch={setFetch} />
    </SupplierProvider>
  )
}
