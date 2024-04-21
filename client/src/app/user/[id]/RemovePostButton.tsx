'use client'
import { TrashIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'
import { revalidatePosts } from '~/app/actions'

const RemovePostButton = ({ postId }: { postId: string }) => {
    const removePost = async (id: string) => {
        const res = await fetch(`http://localhost:8080/api/posts/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        })

        if (!res.ok) {
            toast.error('Failed to remove post. Try again.')
            return
        }

        toast.success('Post removed!')
        revalidatePosts()
    }
    return (
        <button
            className="group/remove rounded-lg bg-gray-200 p-2 hover:bg-red-100"
            onClick={() => removePost(postId)}
        >
            <TrashIcon className="h-4 w-4 group-hover/remove:text-red-600" />
        </button>
    )
}

export default RemovePostButton
