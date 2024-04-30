import { Dispatch, SetStateAction, useState } from 'react'

const useSessionStorage = <T>(key: string, initialValue: T) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.sessionStorage.getItem(key)
            return item ? (JSON.parse(item) as T) : initialValue
        } catch (err) {
            console.warn(`Error reading sessionStorage key “${key}”:`, err)
            return initialValue
        }
    })

    const setValue: Dispatch<SetStateAction<T>> = (
        value: T | ((arg: T) => T)
    ) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value
            setStoredValue(valueToStore)
            window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
        } catch (err) {
            console.warn(`Error setting sessionStorage key “${key}”:`, err)
        }
    }

    const removeValue = () => {
        setStoredValue(initialValue)
        window.sessionStorage.removeItem(key)
    }

    return [storedValue, setValue, removeValue] as const
}

export default useSessionStorage
