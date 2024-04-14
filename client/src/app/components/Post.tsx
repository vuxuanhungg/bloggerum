import Image from 'next/image'
import Link from 'next/link'
import { PostProps } from '../types'

const Post = ({ post }: { post: PostProps }) => {
    const { user } = post
    return (
        <article>
            <Link href={`/post/${post._id}`}>
                <div className="relative min-h-60 overflow-hidden rounded">
                    <Image
                        src={post.thumbnail}
                        alt=""
                        fill
                        className="object-cover"
                    />
                </div>
                <h2 className="mt-4 truncate text-lg font-semibold">
                    {post.title}
                </h2>
                <p className="mt-1 line-clamp-2 text-sm text-slate-700">
                    {post.body}...
                </p>
            </Link>
            <Link href={`/user/${user._id}`}>
                <div className="mt-4 flex items-center gap-3">
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
                    <h3 className="font-semibold text-slate-700">
                        {user.name}
                    </h3>
                </div>
            </Link>
        </article>
    )
}

export default Post
