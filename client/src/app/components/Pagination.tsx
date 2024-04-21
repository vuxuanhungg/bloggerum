'use client'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
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
        <nav className="mx-auto mt-12">
            <ul className="flex items-center justify-center gap-1">
                <li
                    className={
                        currentPage === 1
                            ? 'pointer-events-none cursor-not-allowed'
                            : ''
                    }
                >
                    <Link
                        href={`${pathname}${updateSearchParams({ page: null, per_page: perPage })}`}
                        className="group flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-black hover:text-white"
                    >
                        <ChevronLeftIcon className="h-5 w-5 text-gray-500 transition-colors group-hover:text-white" />
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
                        className="inline-block rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-black hover:text-white"
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
                        className="inline-block rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-black hover:text-white"
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
                        className="group flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-black hover:text-white"
                    >
                        Last
                        <ChevronRightIcon className="h-5 w-5 text-gray-500 transition-colors group-hover:text-white" />
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Pagination
