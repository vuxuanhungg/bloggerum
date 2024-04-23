'use client'
import { PencilSquareIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import TextareaAutosize from 'react-textarea-autosize'
import { toast } from 'react-toastify'
import { revalidatePosts } from '~/app/actions'
import Spinner from '~/app/components/Spinner'
import TagInput from '~/app/components/TagInput'
import { PostProps } from '~/app/types'
import { compareArrays } from '~/app/utils'

type Inputs = {
    title: string
    body: string
    thumbnail: FileList
}

const Form = ({ post }: { post: PostProps }) => {
    const router = useRouter()
    const [tags, setTags] = useState<string[]>(post.tags)

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>({
        defaultValues: {
            title: post.title,
            body: post.body,
        },
    })

    const shouldDisableSubmit =
        (watch('title') === post.title &&
            watch('body') === post.body &&
            watch('thumbnail')?.length === 0 &&
            compareArrays(tags, post.tags)) ||
        isSubmitting

    const onSubmit = handleSubmit(async (formData) => {
        const data = new FormData()
        data.append('title', formData.title)
        data.append('body', formData.body)
        data.append('thumbnail', formData.thumbnail[0])
        data.append('tags', JSON.stringify(tags))

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/${post._id}`,
            {
                method: 'PUT',
                body: data,
                credentials: 'include',
            }
        )
        if (!res.ok) {
            return toast.error('Error occurred')
        }

        const updatedPost: PostProps = await res.json()
        toast.success('Post updated!')
        revalidatePosts()
        router.push(`/post/${updatedPost._id}`)
    })

    return (
        <div className="container mx-auto mb-8 max-w-2xl lg:min-w-[40rem]">
            <form onKeyDown={(e) => e.key !== 'Enter'} onSubmit={onSubmit}>
                <div>
                    <TextareaAutosize
                        rows={1}
                        placeholder="Post title"
                        className="w-full overflow-y-hidden text-3xl font-semibold focus:outline-none"
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
                    <TextareaAutosize
                        placeholder="Post body"
                        className="min-h-64 w-full overflow-y-hidden focus:outline-none"
                        {...register('body', {
                            required: 'Body is required',
                        })}
                    />
                    {errors.body && (
                        <p role="alert" className="mt-2 text-sm text-red-500">
                            {errors.body.message}
                        </p>
                    )}
                </div>

                <TagInput {...{ tags, setTags }} />

                <div className="mt-6">
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
                                sizes="40rem"
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

                <div className="mt-6">
                    <div className="grid grid-cols-2 items-center gap-2">
                        <button
                            type="submit"
                            disabled={shouldDisableSubmit}
                            className="rounded bg-green-600 px-8 py-3 font-semibold text-white enabled:hover:bg-green-500 disabled:bg-green-500"
                            title={
                                shouldDisableSubmit
                                    ? 'You have not made any changes to the post'
                                    : ''
                            }
                        >
                            <div className="flex items-center justify-center gap-2">
                                {isSubmitting && (
                                    <Spinner size="sm" color="white" />
                                )}
                                Save changes
                            </div>
                        </button>

                        <button
                            type="button"
                            className="rounded border border-gray-300 px-8 py-3 font-semibold text-green-600 hover:bg-green-100"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Form
