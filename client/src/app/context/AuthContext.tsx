'use client'
import { UserProps } from '../types'

import {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react'

type AuthContextValue = {
    isLoading: boolean
    user: UserProps | null
    setUser: Dispatch<SetStateAction<UserProps | null>>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<AuthContextValue['user']>(null)

    const checkStatus = async () => {
        // NOTE: Maybe only call server if has cookie
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`,
            {
                credentials: 'include',
            }
        )
        if (res.ok) {
            const user = await res.json()
            setUser(user)
        }
    }

    useEffect(() => {
        const init = async () => {
            setIsLoading(true)
            await checkStatus()
            setIsLoading(false)
        }

        init()
    }, [])

    return (
        <AuthContext.Provider value={{ isLoading, user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
    const authContext = useContext(AuthContext)

    if (!authContext) {
        throw new Error('useAuthContext must be used inside AuthProvider')
    }

    return authContext
}
