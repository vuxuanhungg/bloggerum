import { format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import Post from '~/app/components/Post'
import { PostProps } from '~/app/types'

const RelatedPosts = ({ posts }: { posts: PostProps[] }) => {
    if (posts.length === 0) return null

    return (
        <div className="container mb-8 mt-16">
            <div className="flex items-center gap-8">
                <div className="h-[1px] flex-grow bg-gray-200"></div>
                <h2 className="text-2xl font-semibold text-gray-900">
                    Related posts
                </h2>
                <div className="h-[1px] flex-grow bg-gray-200"></div>
            </div>
            <div className="mt-8">
                <section className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <Post key={post._id} post={post} />
                    ))}
                </section>
            </div>
        </div>
    )
}

const DetailPost = async ({ params }: { params: { id: string } }) => {
    const res = await fetch(`http://localhost:8080/api/posts/${params.id}`)
    const post: PostProps = await res.json()
    const { user } = post

    return (
        <div className="my-8">
            <div>
                <h1 className="container mx-auto max-w-3xl text-center text-3xl font-bold leading-normal text-slate-800">
                    {post.title}
                </h1>
                <div className="mt-4 flex items-center justify-center gap-4">
                    <Link href={`/user/${user._id}`}>
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
                    </Link>
                    <div>
                        <Link
                            href={`/user/${user._id}`}
                            className="hover:underline"
                        >
                            <h3>{user.name}</h3>
                        </Link>
                        <p className="text-sm text-slate-500">
                            {format(new Date(post.updatedAt), 'MMMM dd, yyyy')}
                        </p>
                    </div>
                </div>
                <div className="relative mx-auto mt-8 aspect-video max-w-4xl overflow-hidden lg:rounded-lg">
                    <Image
                        src={post.thumbnail}
                        alt=""
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="container mx-auto mt-8 max-w-2xl text-slate-800">
                    <p className="whitespace-pre-wrap">{post.body}</p>

                    {post.tags.length > 0 && (
                        <ul className="mt-8 flex items-center gap-2">
                            {post.tags.map((tag) => (
                                <li key={tag}>
                                    <Link
                                        href={`/?tag=${tag}`}
                                        className="rounded-lg border px-4 py-2"
                                    >
                                        {tag}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <div className="mt-8">
                <RelatedPosts posts={post.relatedPosts} />
            </div>
        </div>
    )
}

export default DetailPost
