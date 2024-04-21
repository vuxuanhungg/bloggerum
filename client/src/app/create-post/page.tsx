'use client'
import { PhotoIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ReactNode, useState } from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import TagInput from '../components/TagInput'

type Inputs = {
    title: string
    body: string
    thumbnail: FileList
}

const TextArea = ({
    name,
    placeholder,
    requiredErrorMessage,
    className,
}: {
    name: string
    placeholder?: string
    requiredErrorMessage?: string
    className?: string
}) => {
    const {
        register,
        setValue,
        formState: { errors },
    } = useFormContext()

    const nameTitlecased = name.charAt(0).toUpperCase() + name.slice(1)

    return (
        <div>
            <input
                type="hidden"
                {...register(name, {
                    required:
                        requiredErrorMessage || `${nameTitlecased} is required`,
                })}
            />
            <div className="relative">
                <div
                    contentEditable
                    role="textbox"
                    className={`peer cursor-text focus:outline-none ${className || ''}`}
                    onInput={(e) => {
                        let { innerText } = e.currentTarget
                        innerText = innerText.trim()
                        setValue(name, innerText)
                    }}
                    onPaste={(e) => {
                        // Paste as plain text
                        e.preventDefault()

                        let { innerText } = e.currentTarget
                        e.currentTarget.innerText = innerText.concat(
                            e.clipboardData.getData('text/plain').trim()
                        )
                        setValue(name, e.currentTarget.innerText)

                        // Set cursor position to the end
                        const range = document.createRange()
                        range.selectNodeContents(e.currentTarget)
                        range.collapse(false)

                        const selection = window.getSelection()
                        selection?.removeAllRanges()
                        selection?.addRange(range)
                    }}
                ></div>
                <span
                    className={`pointer-events-none absolute left-0 top-0 hidden text-gray-400 peer-empty:inline-block ${className}`}
                >
                    {placeholder}
                </span>
            </div>

            {errors[name] && (
                <p role="alert" className="mt-2 text-sm text-red-500">
                    {errors[name]!.message as ReactNode}
                </p>
            )}
        </div>
    )
}

const CreatePost = () => {
    const router = useRouter()
    const [tags, setTags] = useState<string[]>([])

    const methods = useForm<Inputs>()
    const {
        register,
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
    } = methods

    const onSubmit = handleSubmit(async (formData) => {
        console.log(formData)
        // const data = new FormData()
        // data.append('title', formData.title)
        // data.append('body', formData.body)
        // data.append('thumbnail', formData.thumbnail[0])
        // data.append('tags', JSON.stringify(tags))
        //
        // const res = await fetch('http://localhost:8080/api/posts', {
        //     method: 'POST',
        //     body: data,
        //     credentials: 'include',
        // })
        // if (!res.ok) {
        //     return toast.error('Error occurred')
        // }
        //
        // const post: PostProps = await res.json()
        // toast.success('Post created!')
        // revalidatePosts()
        // router.push(`/post/${post._id}`)
    })

    return (
        <div className="mx-auto my-8 max-w-2xl">
            <FormProvider {...methods}>
                <form
                    className="mt-8"
                    onKeyDown={(e) => e.key !== 'Enter'}
                    onSubmit={onSubmit}
                >
                    <TextArea
                        name="title"
                        placeholder="Post title"
                        className="text-3xl font-semibold"
                    />
                    <div className="mt-6">
                        <TextArea
                            name="body"
                            placeholder="Post body"
                            className="min-h-64"
                        />
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

                            {watch('thumbnail')?.length > 0 && (
                                <span>{watch('thumbnail')[0].name}</span>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            id="thumbnail"
                            className="hidden"
                            // className="mt-2 block file:mr-4 file:cursor-pointer file:rounded file:border-none file:bg-black file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white focus:outline-none focus:file:ring focus:file:ring-green-200"
                            {...register('thumbnail', {
                                required: 'Thumbnail is required',
                            })}
                        />
                        {errors.thumbnail && (
                            <p
                                role="alert"
                                className="mt-2 text-sm text-red-500"
                            >
                                {errors.thumbnail.message}
                            </p>
                        )}
                        {watch('thumbnail')?.length > 0 && (
                            <div className="relative mt-4 aspect-video overflow-hidden rounded">
                                <Image
                                    src={URL.createObjectURL(
                                        watch('thumbnail')[0]
                                    )}
                                    alt={watch('thumbnail')[0].name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="rounded bg-green-600 px-12 py-3 text-white hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                        >
                            <div className="flex items-center gap-2">
                                Create
                            </div>
                        </button>
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}

export default CreatePost
