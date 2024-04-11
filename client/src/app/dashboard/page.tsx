'use client'
import { Combobox } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
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
    const [suggestions, setSuggestions] = useState<string[]>([])
    useEffect(() => {
        const fetchTags = async () => {
            const res = await fetch('http://localhost:8080/api/tags')
            const tags = await res.json()
            setSuggestions(tags)
        }

        fetchTags()
    }, [])
    const [query, setQuery] = useState('')

    const filteredSuggestions =
        query === ''
            ? suggestions
            : suggestions
                  .filter((suggestion) => {
                      return suggestion
                          .toLowerCase()
                          .includes(query.toLowerCase())
                  })
                  .filter((suggestion) => !tags.includes(suggestion))

    return (
        <div className="mt-6">
            <label htmlFor="tags">Tags</label>
            <div className="mt-2 flex flex-wrap items-center gap-2 rounded border border-slate-500 p-1 focus-within:outline focus-within:outline-1">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="flex items-center gap-2 rounded border px-3 py-1"
                    >
                        {tag}
                        <button
                            className="text-red-500"
                            onClick={() =>
                                setTags(tags.filter((_tag) => _tag !== tag))
                            }
                        >
                            x
                        </button>
                    </span>
                ))}

                <div className="relative w-32 flex-auto">
                    <Combobox
                        value=""
                        onChange={(value) => {
                            if (value.length > 0) {
                                setTags([...tags, value])
                            }
                        }}
                    >
                        <Combobox.Input
                            id="tags"
                            placeholder="Post tags"
                            autoComplete="off"
                            className="w-full px-4 py-2 focus:outline-none"
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setShouldDisableSubmit(true)}
                            onBlur={() => setShouldDisableSubmit(false)}
                            onKeyDown={(e) => {
                                if (['Enter', 'Tab'].includes(e.key)) {
                                    if (filteredSuggestions.length > 0) return
                                    if (
                                        tags.some(
                                            (tag) =>
                                                tag.toLowerCase() ===
                                                query.toLowerCase()
                                        )
                                    ) {
                                        toast.info('Tag already added')
                                        return
                                    }
                                    setTags([...tags, query])
                                }
                            }}
                        />
                        {filteredSuggestions.length > 0 && (
                            <Combobox.Options className="absolute -left-1 top-full mt-2 overflow-hidden rounded bg-white shadow">
                                {filteredSuggestions.map((tag) => (
                                    <Combobox.Option
                                        key={tag}
                                        value={tag}
                                        className={({ active }) =>
                                            `px-4 py-2 ${active ? 'bg-slate-500 text-white' : ''}`
                                        }
                                    >
                                        {tag}
                                    </Combobox.Option>
                                ))}
                            </Combobox.Options>
                        )}
                    </Combobox>
                </div>
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
