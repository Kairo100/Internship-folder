import { createContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/router'

import authConfig from 'src/configs/auth'
import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType } from 'src/types/auth'
import { authMe, login } from 'src/apis/auth'
import auth from 'src/configs/auth'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      let alternateUserData: any = window.localStorage.getItem('userData')
      alternateUserData = JSON.parse(alternateUserData)

      if (storedToken) {
        await authMe()
          .then(async response => {
            const userData = {
              ...response,
              user_type: response.user_type || 'user_account'
            }

            // Process userData based on user type
            if (response.user_type === 'organisation_member') {
              userData.fullName = response.full_name || ''
              userData.role = 'organisation_member'
              userData.organisation_id = response.organisation_id
              userData.organisation_name = response.organisation_name
              userData.position_held = response.position_held
            } else {
              userData.fullName = `${response.first_name} ${response.last_name}`
              userData.role = response.account_type || 'admin'
            }

            setLoading(false)
            setUser(userData)
          })
          .catch((err: any) => {
            if (
              err.toLowerCase() === 'Network Error'.toLowerCase() ||
              err.toLowerCase() === 'Internal Server Error'.toLowerCase()
            ) {
              setLoading(false)
              // Setting the alter user when there is network error
              setUser(alternateUserData)
            } else {
              localStorage.removeItem('userData')
              localStorage.removeItem(auth.storageTokenKeyName)
              setUser(null)
              setLoading(false)
              if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
                router.replace('/login')
              }
            }
          })
      } else {
        setLoading(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = async (params: LoginParams, errorCallback?: ErrCallbackType) => {
    await login({ email: params.email, password: params.password, user_type: params.user_type })
      .then(async response => {
        // Saving token to local storage
        window.localStorage.setItem(authConfig.storageTokenKeyName, response.access_token)

        // Process user data based on type
        let userData: UserDataType

        if (params.user_type === 'organisation_member') {
          userData = {
            ...response.userData,
            fullName: response.userData.full_name || '',
            role: 'organisation_member',
            user_type: 'organisation_member',
            organisation_id: response.userData.organisation_id,
            organisation_name: response.userData.organisation_name,
            position_held: response.userData.position_held
          }
        } else {
          userData = {
            ...response.userData,
            fullName: `${response.userData.first_name} ${response.userData.last_name}`,
            role: response.userData.account_type || 'admin',
            user_type: 'user_account'
          }
        }

        window.localStorage.setItem('userData', JSON.stringify(userData))
        setUser(userData)

        const returnUrl = router.query.returnUrl
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        router.replace(redirectURL as string)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
