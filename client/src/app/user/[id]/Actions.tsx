'use client'
import { PencilIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { useAuthContext } from '~/app/context/AuthContext'
import { PostProps } from '~/app/types'
import RemovePostButton from './RemovePostButton'

export const PostActions = ({ post }: { post: PostProps }) => {
    const { user } = useAuthContext()

    if (user?._id !== post.user._id) {
        return null
    }

    return (
        <div className="absolute right-2 top-2 hidden group-hover:block">
            <div className="flex items-center gap-1">
                <Link
                    href={`/edit-post/${post._id}`}
                    className="group/edit rounded-lg bg-gray-200 p-2"
                >
                    <PencilIcon className="h-4 w-4 group-hover/edit:text-blue-500" />
                </Link>
                <RemovePostButton postId={post._id} />
            </div>
        </div>
    )
}
