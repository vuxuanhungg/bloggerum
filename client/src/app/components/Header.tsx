import Link from 'next/link'

const Header = () => {
    return (
        <header className="container my-8 flex items-center justify-between gap-4">
            <Link href="/" className="text-3xl font-semibold">
                Bloggerum
            </Link>
            <nav>
                <ul className="flex items-center">
                    <li>
                        <Link href="/register" className="rounded px-4 py-2">
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
            </nav>
        </header>
    )
}

export default Header
