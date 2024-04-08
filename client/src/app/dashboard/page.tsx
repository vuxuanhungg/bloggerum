'use client'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { PostProps } from '../types'

type Inputs = {
    title: string
    body: string
    tag: string
}

const TagInputWrapper = ({
    tags,
    setTags,
    setShouldDisableSubmit,
}: {
    tags: string[]
    setTags: Dispatch<SetStateAction<string[]>>
    setShouldDisableSubmit: Dispatch<SetStateAction<boolean>>
}) => {
    const { register, watch, setValue } = useForm<Inputs>()
    return (
        <div className="mt-6">
            <label htmlFor="tags">Tags</label>
            <div className="flex items-center rounded border border-slate-500 p-1 focus-within:outline focus-within:outline-1">
                <ul className="flex items-center gap-2">
                    {tags.map((tag) => (
                        <li key={tag} className="rounded border px-3 py-1">
                            {tag}
                        </li>
                    ))}
                </ul>
                <input
                    type="text"
                    id="tags"
                    placeholder="Post tags"
                    className="px-4 py-2 focus:outline-none"
                    {...register('tag', {
                        onBlur: () => setShouldDisableSubmit(false),
                    })}
                    onFocus={() => setShouldDisableSubmit(true)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            if (watch('tag').length > 0) {
                                setTags([...tags, watch('tag')])
                                setValue('tag', '')
                            }
                        }
                    }}
                />
            </div>
        </div>
    )
}

const Dashboard = () => {
    const router = useRouter()
    const [tags, setTags] = useState<string[]>([])
    const [shouldDisableSubmit, setShouldDisableSubmit] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit = handleSubmit(async (formData) => {
        const res = await fetch('http://localhost:8080/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ ...formData, tags }),
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
        <div className="mx-auto max-w-md text-slate-700">
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
                <TagInputWrapper
                    {...{ tags, setTags, setShouldDisableSubmit }}
                />
                <div className="mt-6">
                    <button
                        type="submit"
                        disabled={shouldDisableSubmit}
                        className="w-full rounded bg-slate-200 px-8 py-3 disabled:bg-slate-100"
                    >
                        Create
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Dashboard
