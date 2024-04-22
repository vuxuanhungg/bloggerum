'use client'
import {
    MagnifyingGlassIcon,
    PencilSquareIcon,
} from '@heroicons/react/20/solid'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useAuthContext } from '../context/AuthContext'
import UserPanel from './UserPanel'
import Spinner from './Spinner'

const SearchBox = ({ hidden = false }: { hidden?: boolean }) => {
    const router = useRouter()
    const { register, handleSubmit } = useForm<{ query: string }>()

    const onSubmit = handleSubmit(({ query }) => {
        if (query.length > 0) {
            router.push(`/?q=${query}`)
        }
    })

    if (hidden) return null

    return (
        <form
            onSubmit={onSubmit}
            className="flex items-center justify-between overflow-hidden rounded-full border pl-1 text-sm"
        >
            <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 focus:outline-none"
                {...register('query')}
            />
            <button className="px-3 py-2">
                <MagnifyingGlassIcon className="h-5 w-5 text-slate-500" />
            </button>
        </form>
    )
}

const Header = () => {
    const pathname = usePathname()
    const searchBoxHiddenPaths = [
        '/register',
        '/login',
        '/profile',
        '/create-post',
        '/edit-post',
        '/forgot-password',
        '/change-password',
    ]
    const searchBoxHidden = searchBoxHiddenPaths.some((path) =>
        pathname.includes(path)
    )

    const { isLoading, user } = useAuthContext()

    return (
        <header
            className={`container my-8 grid items-center gap-4 ${searchBoxHidden ? 'grid-cols-2' : 'grid-cols-3'}`}
        >
            <Link href="/" className="text-3xl font-semibold">
                <Image
                    src="/logo.png"
                    width={98}
                    height={99}
                    alt="bloggerum logo"
                    className="w-10 sm:w-12 lg:hidden"
                />
                <Image
                    src="/logo-full.png"
                    width={371}
                    height={100}
                    alt="bloggerum logo with text"
                    className="hidden w-48 lg:block"
                />
            </Link>
            <SearchBox hidden={searchBoxHidden} />
            <div className="justify-self-end">
                {isLoading && <Spinner />}
                {!isLoading && (
                    <nav>
                        {!user && (
                            <ul className="flex items-center">
                                <li className="hidden lg:block">
                                    <Link
                                        href="/register"
                                        className="px-8 py-3 text-sm font-medium text-gray-700 hover:text-green-600 hover:underline"
                                    >
                                        Register
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/login"
                                        className="rounded-lg bg-green-600 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-green-500"
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
                                    className="hidden rounded-full border p-[10px] lg:block"
                                >
                                    <PencilSquareIcon className="h-5 w-5 text-gray-500" />
                                </Link>
                                <UserPanel />
                            </div>
                        )}
                    </nav>
                )}
            </div>
        </header>
    )
}

export default Header
