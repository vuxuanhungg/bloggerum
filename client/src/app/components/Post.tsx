import Link from 'next/link'
import { PostProps } from '../types'

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
            </Link>
            <Link href={`/user/${post.user._id}`}>
                <div className="mt-4 flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-500"></div>
                    <h3 className="font-semibold text-slate-700">
                        {post.user.name}
                    </h3>
                </div>
            </Link>
        </article>
    )
}

export default Post
