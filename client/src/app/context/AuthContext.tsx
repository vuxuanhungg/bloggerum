'use client'

import {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react'

type User = {
    _id: string
    name: string
    email: string
}

type AuthContextValue = {
    isLoading: boolean
    user: User | null
    setUser: Dispatch<SetStateAction<User | null>>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<AuthContextValue['user']>(null)

    const checkStatus = async () => {
        const res = await fetch('http://localhost:8080/api/users/profile', {
            credentials: 'include',
        })
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
