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
              fullName: `${response.first_name} ${response.last_name}`,
              role: 'admin'
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
              // localStorage.removeItem('refreshToken')
              // localStorage.removeItem('accessToken')
              localStorage.removeItem('userData')
              localStorage.removeItem(auth.storageTokenKeyName)
              setUser(null)
              setLoading(false)
              if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
                router.replace('/login')
                // router.replace('/auth/login')
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
    await login({ email: params.email, password: params.password })
      .then(async response => {
        // Saving token to local storage
        window.localStorage.setItem(authConfig.storageTokenKeyName, response.access_token)

        // Saving the user data
        const userData = {
          ...response.userData,
          fullName: `${response.userData.first_name} ${response.userData.last_name}`,
          role: 'admin'
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

    // axios
    //   .post(authConfig.loginEndpoint, params)
    //   .then(async response => {
    //     params.rememberMe
    //       ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)
    //       : null
    //     const returnUrl = router.query.returnUrl

    //     setUser({ ...response.data.userData })
    //     params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.userData)) : null

    //     const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

    //     router.replace(redirectURL as string)
    //   })

    //   .catch(err => {
    //     if (errorCallback) errorCallback(err)
    //   })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
    // router.push('/auth/login')
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
