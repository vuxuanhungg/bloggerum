'use client'
import {
    MagnifyingGlassIcon,
    PencilSquareIcon,
} from '@heroicons/react/20/solid'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useAuthContext } from '../context/AuthContext'
import UserPanel from './UserPanel'

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
            className="flex items-center overflow-hidden rounded-full border pl-1"
        >
            <input
                type="text"
                placeholder="Search"
                className="px-4 py-2 focus:outline-none"
                {...register('query')}
            />
            <button className="px-3 py-2">
                <MagnifyingGlassIcon className="h-5 w-5 text-slate-500" />
            </button>
        </form>
    )
}

const Header = () => {
    const { isLoading, user } = useAuthContext()

    return (
        <header className="container my-8 flex items-center justify-between gap-4">
            <Link href="/" className="text-3xl font-semibold">
                {/* Bloggerum */}
                <Image
                    src="/logo.png"
                    width={465}
                    height={160}
                    alt=""
                    className="-ml-3 w-52"
                />
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
                                href="/create-post"
                                className="rounded-full border p-[10px]"
                            >
                                <PencilSquareIcon className="h-5 w-5 text-gray-500" />
                            </Link>
                            <UserPanel />
                        </div>
                    )}
                </nav>
            )}
        </header>
    )
}

export default Header
