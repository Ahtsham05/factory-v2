import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/stores/store'
import { setUser } from '@/stores/auth.slice'
import { fetchAllProducts } from '@/stores/product.slice'
import { fetchAllSuppliers } from '@/stores/supplier.slice'
import { fetchAllCutomers } from '@/stores/customer.slice'
import { fetchAllAccounts } from '@/stores/account.slice'

export function AuthLoader({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    if (user) {
      dispatch(setUser({
        user,
        tokens: {
          accessToken,
          refreshToken
        }
      }))
      dispatch(fetchAllProducts({}))
      dispatch(fetchAllSuppliers({}))
      dispatch(fetchAllCutomers({}))
      dispatch(fetchAllAccounts({}))
    } else {
      navigate({ to: "/sign-in", replace: true })
    }
  }, [dispatch, navigate])

  return <>{children}</>
}