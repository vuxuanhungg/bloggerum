import Pagination from './components/Pagination'
import Post from './components/Post'
import { PostProps } from './types'

export default async function Home({
    searchParams,
}: {
    searchParams: { page: string; per_page: string }
}) {
    const currentPage = Number(searchParams.page) || 1
    const perPage = Number(searchParams.per_page)

    const res = await fetch(
        `http://localhost:8080/api/posts?${currentPage > 1 ? `page=${currentPage}` : ''}&${perPage ? `limit=${perPage}` : ''}`
    )
    const { posts, totalPages }: { posts: PostProps[]; totalPages: number } =
        await res.json()

    return (
        <div className="container my-8">
            <section className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {totalPages === 0 && <div>No posts yet</div>}
                {totalPages > 0 &&
                    posts.map((post) => <Post key={post._id} post={post} />)}
            </section>
            <Pagination {...{ totalPages, currentPage, perPage }} />
        </div>
    )
}
