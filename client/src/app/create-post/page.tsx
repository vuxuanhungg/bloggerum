'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import TagInput from '../components/TagInput'
import { PostProps } from '../types'

type Inputs = {
    title: string
    body: string
    thumbnail: FileList
}

const CreatePost = () => {
    const router = useRouter()
    const [tags, setTags] = useState<string[]>([])
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit = handleSubmit(async (formData) => {
        const data = new FormData()
        data.append('title', formData.title)
        data.append('body', formData.body)
        data.append('thumbnail', formData.thumbnail[0])
        data.append('tags', JSON.stringify(tags))

        const res = await fetch('http://localhost:8080/api/posts', {
            method: 'POST',
            body: data,
            credentials: 'include',
        })
        if (!res.ok) {
            return toast.error('Error occurred')
        }

        const post: PostProps = await res.json()
        toast.success('Post created!')
        router.push(`/post/${post._id}`)
    })

    return (
        <div className="mx-auto my-8 max-w-md text-slate-700">
            <h1 className="text-center text-3xl font-bold">Create post</h1>
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
                        accept="image/*"
                        id="thumbnail"
                        className="mt-2 block file:mr-4 file:cursor-pointer file:rounded file:border file:border-slate-500 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700"
                        {...register('thumbnail', {
                            required: 'Thumbnail is required',
                        })}
                    />
                    {errors.thumbnail && (
                        <p role="alert" className="mt-2 text-sm text-red-500">
                            {errors.thumbnail.message}
                        </p>
                    )}
                    {watch('thumbnail')?.length > 0 && (
                        <div className="relative mt-2 aspect-video overflow-hidden rounded">
                            <Image
                                src={URL.createObjectURL(watch('thumbnail')[0])}
                                alt={watch('thumbnail')[0].name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                </div>
                <TagInput {...{ tags, setTags }} />
                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full rounded bg-slate-200 px-8 py-3 disabled:cursor-not-allowed disabled:bg-slate-100"
                        onClick={() => console.log('click')}
                    >
                        Create
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreatePost
