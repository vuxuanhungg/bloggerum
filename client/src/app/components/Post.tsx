import { format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import { PostProps } from '../types'
import RichTextEditor from './RichTextEditor'
import { serialize } from './RichTextEditor/helpers'

const Post = ({
    post,
    isHeadline,
}: {
    post: PostProps
    isHeadline?: boolean
}) => {
    const { user } = post
    return (
        <article className={`${isHeadline ? 'lg:col-span-2' : ''}`}>
            <Link href={`/post/${post._id}`} className="group">
                <div className="relative min-h-60 overflow-hidden rounded">
                    <Image
                        src={post.thumbnail}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform group-hover:scale-105"
                    />
                </div>
                <h2 className="mt-4 text-lg font-semibold">
                    <span className="bg-gradient-to-r from-green-200 to-green-100 bg-[length:0px_8px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_8px]">
                        {post.title}
                    </span>
                </h2>
            </Link>
            <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                {serialize(JSON.parse(post.body))}
            </p>

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
                            sizes="2rem"
                            className="object-cover"
                        />
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Link href={`/user/${user._id}`}>
                        <h3 className="text-sm text-gray-700">{user.name}</h3>
                    </Link>
                    <span className="text-xs text-gray-300">•</span>
                    <p className="text-sm text-gray-500">
                        {format(new Date(post.updatedAt), 'MMMM dd, yyyy')}
                    </p>
                </div>
            </div>
        </article>
    )
}

export default Post
