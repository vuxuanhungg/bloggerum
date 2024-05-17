'use client'
import {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useContext,
    useMemo,
    useState,
} from 'react'

type LinkInputContextValue = {
    inputOpen: boolean
    setInputOpen: Dispatch<SetStateAction<boolean>>
}

const LinkInputContext = createContext<LinkInputContextValue | null>(null)

export const LinkInputProvider = ({ children }: { children: ReactNode }) => {
    const [inputOpen, setInputOpen] = useState(false)
    const value = useMemo(
        () => ({
            inputOpen,
            setInputOpen,
        }),
        [inputOpen, setInputOpen]
    )

    return (
        <LinkInputContext.Provider value={value}>
            {children}
        </LinkInputContext.Provider>
    )
}

export const useLinkInputContext = () => {
    const context = useContext(LinkInputContext)

    if (!context) {
        throw new Error(
            'LinkInputContext must be used inside LinkInputProvider'
        )
    }

    return context
}
