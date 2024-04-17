'use client'
import { PencilSquareIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import TagInput from '~/app/components/TagInput'
import { PostProps } from '~/app/types'

type Inputs = {
    title: string
    body: string
    thumbnail: FileList
}

const usePostQuery = (postId: string) => {
    const [post, setPost] = useState<PostProps | null>(null)

    useEffect(() => {
        const fetchPost = async () => {
            const res = await fetch(`http://localhost:8080/api/posts/${postId}`)
            const post = await res.json()
            setPost(post)
        }

        fetchPost()
    }, [postId])

    return { post }
}

const Form = ({ post }: { post: PostProps }) => {
    const router = useRouter()

    const [tags, setTags] = useState<string[]>(post.tags)
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        defaultValues: {
            title: post.title,
            body: post.body,
        },
    })

    const onSubmit = handleSubmit(async (formData) => {
        const data = new FormData()
        data.append('title', formData.title)
        data.append('body', formData.body)
        data.append('thumbnail', formData.thumbnail[0])
        data.append('tags', JSON.stringify(tags))

        const res = await fetch(`http://localhost:8080/api/posts/${post._id}`, {
            method: 'PUT',
            body: data,
            credentials: 'include',
        })
        if (!res.ok) {
            return toast.error('Error occurred')
        }

        const updatedPost: PostProps = await res.json()
        toast.success('Post updated!')
        router.push(`/post/${updatedPost._id}`)

        // TODO: Invalidate post cache after updated
    })

    return (
        <div className="mx-auto my-8 max-w-md text-slate-700">
            <h1 className="text-center text-3xl font-bold">Edit post</h1>
            <form
                className="mt-8"
                onKeyDown={(e) => e.key !== 'Enter'}
                onSubmit={onSubmit}
            >
                <div>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        placeholder="Post title"
                        className="mt-2 w-full rounded border border-slate-500 px-4 py-2"
                        {...register('title', {
                            required: 'Title is required',
                        })}
                    />
                    {errors.title && (
                        <p role="alert" className="mt-2 text-sm text-red-500">
                            {errors.title.message}
                        </p>
                    )}
                </div>

                <div className="mt-6">
                    <label htmlFor="body">Body</label>
                    <textarea
                        id="body"
                        placeholder="Post body"
                        className="mt-2 h-32 w-full rounded border border-slate-500 px-4 py-2"
                        {...register('body', {
                            required: 'Post body cannot be empty',
                        })}
                    />
                    {errors.body && (
                        <p role="alert" className="mt-2 text-sm text-red-500">
                            {errors.body.message}
                        </p>
                    )}
                </div>

                <div className="mt-6">
                    <label htmlFor="thumbnail">Thumbnail</label>
                    <input
                        type="file"
                        id="thumbnail"
                        accept="image/*"
                        className="hidden"
                        {...register('thumbnail')}
                    />
                    <div className="mt-2">
                        <div className="group relative aspect-video overflow-hidden rounded">
                            <Image
                                src={
                                    watch('thumbnail')?.length > 0
                                        ? URL.createObjectURL(
                                              watch('thumbnail')[0]
                                          )
                                        : post.thumbnail
                                }
                                alt=""
                                fill
                                className="object-cover transition-[filter] group-hover:brightness-75"
                            />
                            <button
                                type="button"
                                className="absolute inset-0 hidden group-hover:block"
                            >
                                <label
                                    htmlFor="thumbnail"
                                    className="flex h-full w-full cursor-pointer items-center justify-center"
                                >
                                    <div className="rounded-full bg-blue-500 p-3">
                                        <PencilSquareIcon className="h-6 w-6 text-white" />
                                    </div>
                                </label>
                            </button>
                        </div>
                    </div>
                </div>
                <TagInput {...{ tags, setTags }} />
                <div className="mt-6">
                    <div className="grid grid-cols-2 items-center gap-2">
                        <button
                            type="submit"
                            className="rounded border border-gray-300 bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-400"
                        >
                            Save changes
                        </button>
                        <button
                            type="button"
                            className="rounded border border-gray-300 px-6 py-2 font-semibold text-blue-500 hover:bg-gray-100"
                            onClick={() => console.log('You cancel it')}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

const EditPost = ({ params }: { params: { id: string } }) => {
    const { post } = usePostQuery(params.id)

    if (!post) {
        toast.error('Failed to retrieve post')
        return null
    }

    return <Form post={post} />
}

export default EditPost
