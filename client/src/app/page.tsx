import Link from 'next/link'
import { PostProps } from './types'

const Post = ({ post }: { post: PostProps }) => {
    return (
        <article>
            <Link href={`/post/${post._id}`}>
                <div className="min-h-60 rounded bg-slate-500"></div>
                <h2 className="mt-4 truncate text-lg font-semibold">
                    {post.title}
                </h2>
                <p className="mt-1 line-clamp-2 text-sm text-slate-700">
                    {post.body}...
                </p>
                <div className="mt-4 flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-500"></div>
                    <h3 className="font-semibold text-slate-700">Xuan Hung</h3>
                </div>
            </Link>
        </article>
    )
}

const Pagination = ({
    totalPages,
    currentPage,
    perPage,
}: {
    totalPages: number
    currentPage: number
    perPage: number
}) => {
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
                        href={`/?page=1&per_page=${perPage}`}
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
                        href={`/?page=${currentPage - 1}&per_page=${perPage}`}
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
                        href={`/?page=${currentPage + 1}&per_page=${perPage}`}
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
                        href={`/?page=${totalPages}&per_page=${perPage}`}
                        className="rounded border border-slate-400 px-4 py-2"
                    >
                        Last
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default async function Home({
    searchParams,
}: {
    searchParams: { page: string; per_page: string }
}) {
    const page = Number(searchParams.page) || 1
    const perPage = Number(searchParams.per_page) || 10

    const res = await fetch(
        `http://localhost:8080/api/posts?page=${page}&limit=${perPage}`
    )
    const { posts, totalPages }: { posts: PostProps[]; totalPages: number } =
        await res.json()

    return (
        <div className="container">
            <section className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <Post key={post._id} post={post} />
                ))}
            </section>
            <Pagination
                totalPages={totalPages}
                currentPage={page}
                perPage={perPage}
            />
        </div>
    )
}
