'use client'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useAuthContext } from '../context/AuthContext'

const SearchBox = () => {
    const router = useRouter()
    const { register, handleSubmit } = useForm<{ query: string }>()

    const onSubmit = handleSubmit(({ query }) => {
        if (query.length > 0) {
            router.push(`/?q=${query}`)
        }
    })

    return (
        <form
            onSubmit={onSubmit}
            className="flex items-center overflow-hidden rounded-full border-2 border-gray-300 pl-1 focus-within:ring focus-within:ring-slate-900/10"
        >
            <input
                type="text"
                className="px-4 py-2 focus:outline-none"
                {...register('query')}
            />
            <button className="px-3 py-2">
                <MagnifyingGlassIcon className="h-6 w-6 text-slate-500" />
            </button>
        </form>
    )
}

const Header = () => {
    const router = useRouter()
    const { isLoading, user, setUser } = useAuthContext()

    const logOut = async () => {
        const res = await fetch('http://localhost:8080/api/users/logout', {
            method: 'POST',
            credentials: 'include',
        })
        if (res.ok) {
            setUser(null)
            toast.success('Successfully logged out!')
            router.push('/login')
            return
        }
        toast.error('Error occurred')
    }

    return (
        <header className="container my-8 flex items-center justify-between gap-4">
            <Link href="/" className="text-3xl font-semibold">
                Bloggerum
            </Link>
            <SearchBox />
            {isLoading && <p>Loading...</p>}
            {!isLoading && (
                <nav>
                    {!user && (
                        <ul className="flex items-center">
                            <li>
                                <Link
                                    href="/register"
                                    className="rounded px-4 py-2"
                                >
                                    Register
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/login"
                                    className="rounded border border-slate-500 px-4 py-2"
                                >
                                    Login
                                </Link>
                            </li>
                        </ul>
                    )}
                    {user && (
                        <div className="flex items-center gap-3">
                            <Link
                                href={`/user/${user._id}`}
                                className="flex items-center gap-2"
                            >
                                <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-slate-500">
                                    {!user.avatar && (
                                        <p className="font-semibold text-white">
                                            {user.name.slice(0, 1)}
                                        </p>
                                    )}
                                    {user.avatar && (
                                        <Image
                                            src={user.avatar}
                                            alt="profile picture"
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                </div>
                                {user.name}
                            </Link>
                            <button
                                className="rounded border border-slate-300 px-5 py-2"
                                onClick={logOut}
                            >
                                Log Out
                            </button>
                        </div>
                    )}
                </nav>
            )}
        </header>
    )
}

export default Header
