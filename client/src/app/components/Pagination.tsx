'use client'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

type SearchParams = Record<string, string | number | null>

const Pagination = ({
    totalPages,
    currentPage,
    perPage,
}: {
    totalPages: number
    currentPage: number
    perPage: number
}) => {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const updateSearchParams = (newSearchParams: SearchParams) => {
        const currentSearchParams = new URLSearchParams(searchParams.toString())
        for (const [key, value] of Object.entries(newSearchParams)) {
            if (!value) {
                currentSearchParams.delete(key)
            } else {
                currentSearchParams.set(key, value.toString())
            }
        }

        const search = currentSearchParams.toString()
        const query = search ? `?${search}` : ''
        return query
    }

    return (
        <nav className="mx-auto mt-8">
            <ul className="flex items-center justify-center gap-1">
                <li
                    className={
                        currentPage === 1
                            ? 'pointer-events-none cursor-not-allowed'
                            : ''
                    }
                >
                    <Link
                        href={`${pathname}${updateSearchParams({ page: currentPage, per_page: perPage })}`}
                        className="rounded border border-slate-400 px-4 py-2"
                    >
                        First
                    </Link>
                </li>
                <li
                    className={
                        currentPage === 1
                            ? 'pointer-events-none cursor-not-allowed'
                            : ''
                    }
                >
                    <Link
                        href={`${pathname}${updateSearchParams({ page: currentPage - 1, per_page: perPage })}`}
                        className="rounded border border-slate-400 px-4 py-2"
                    >
                        Prev
                    </Link>
                </li>
                <li
                    className={
                        currentPage === totalPages
                            ? 'pointer-events-none cursor-not-allowed'
                            : ''
                    }
                >
                    <Link
                        href={`${pathname}${updateSearchParams({ page: currentPage + 1, per_page: perPage })}`}
                        className="rounded border border-slate-400 px-4 py-2"
                    >
                        Next
                    </Link>
                </li>
                <li
                    className={
                        currentPage === totalPages
                            ? 'pointer-events-none cursor-not-allowed'
                            : ''
                    }
                >
                    <Link
                        href={`${pathname}${updateSearchParams({ page: totalPages, per_page: perPage })}`}
                        className="rounded border border-slate-400 px-4 py-2"
                    >
                        Last
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Pagination
