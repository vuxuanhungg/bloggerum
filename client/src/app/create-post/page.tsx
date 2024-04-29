'use client'
import { PhotoIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import TextareaAutosize from 'react-textarea-autosize'
import { toast } from 'react-toastify'
import { revalidatePosts } from '../actions'
import RichTextEditor from '../components/RichTextEditor'
import Spinner from '../components/Spinner'
import TagInput from '../components/TagInput'
import { PostProps } from '../types'

type Inputs = {
    title: string
    thumbnail: FileList
}

const CreatePost = () => {
    const router = useRouter()
    const [body, setBody] = useState<string>('')
    const [tags, setTags] = useState<string[]>([])

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>()

    const thumbnail = watch('thumbnail')

    const onSubmit = handleSubmit(async (formData) => {
        const data = new FormData()
        data.append('title', formData.title)
        data.append('body', body)
        data.append('thumbnail', formData.thumbnail[0])
        data.append('tags', JSON.stringify(tags))

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts`,
            {
                method: 'POST',
                body: data,
                credentials: 'include',
            }
        )
        if (!res.ok) {
            return toast.error('Error occurred')
        }

        const post: PostProps = await res.json()
        toast.success('Post created!')
        revalidatePosts()
        router.push(`/post/${post._id}`)
    })

    return (
        <div className="container mx-auto mb-8 max-w-2xl lg:min-w-[40rem]">
            <form onKeyDown={(e) => e.key !== 'Enter'} onSubmit={onSubmit}>
                <div>
                    <TextareaAutosize
                        rows={1}
                        placeholder="Post title"
                        className="w-full overflow-y-hidden text-3xl font-bold focus:outline-none"
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
                    <RichTextEditor onChange={setBody} />
                </div>

                <TagInput {...{ tags, setTags }} />

                <div className="mt-6">
                    <div className="flex items-center gap-4">
                        <label
                            htmlFor="thumbnail"
                            role="button"
                            className="rounded bg-black px-4 py-2 text-white"
                        >
                            <div className="flex items-center gap-3">
                                Thumbnail
                                <PhotoIcon className="h-4 w-4" />
                            </div>
                        </label>

                        {thumbnail?.length > 0 && (
                            <span>{thumbnail[0].name}</span>
                        )}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        id="thumbnail"
                        className="hidden"
                        {...register('thumbnail', {
                            required: 'Thumbnail is required',
                        })}
                    />
                    {errors.thumbnail && (
                        <p role="alert" className="mt-2 text-sm text-red-500">
                            {errors.thumbnail.message}
                        </p>
                    )}
                    {thumbnail?.length > 0 && (
                        <div className="relative mt-4 aspect-video overflow-hidden rounded">
                            <Image
                                src={URL.createObjectURL(thumbnail[0])}
                                alt={thumbnail[0].name}
                                fill
                                sizes="40rem"
                                className="object-cover"
                            />
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded bg-green-600 px-12 py-3 text-white hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                    >
                        <div className="flex items-center justify-center gap-2">
                            {isSubmitting && (
                                <Spinner size="sm" color="white" />
                            )}
                            Create
                        </div>
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreatePost
