'use client'
import Link from 'next/link'
import { useAuthContext } from '../context/AuthContext'

const Header = () => {
    const { isLoading, user } = useAuthContext()

    return (
        <header className="container my-8 flex items-center justify-between gap-4">
            <Link href="/" className="text-3xl font-semibold">
                Bloggerum
            </Link>
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
                        <Link
                            href={`/user/${user._id}`}
                            className="flex items-center gap-2"
                        >
                            <div className="h-8 w-8 rounded-full bg-slate-500"></div>
                            {user?.name}
                        </Link>
                    )}
                </nav>
            )}
        </header>
    )
}

export default Header
