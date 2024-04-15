'use client'
import {
    ArrowUpTrayIcon,
    PencilIcon,
    TrashIcon,
} from '@heroicons/react/20/solid'
import Image from 'next/image'
import { useState } from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { toast } from 'react-toastify'
import Modal from '../components/Modal'
import { useAuthContext } from '../context/AuthContext'

interface Inputs {
    name: string
    avatar: FileList
    shouldRemoveAvatar: boolean
}

interface ImageSelectProps {
    onSubmit: () => Promise<void>
}

const ImageSelect = ({ onSubmit }: ImageSelectProps) => {
    const { user } = useAuthContext()
    const { register, watch, setValue, resetField } = useFormContext()
    const [modalOpen, setModalOpen] = useState(false)

    // TODO: Handle this
    if (!user) return null

    return (
        <>
            <div className="relative mx-auto h-16 w-16">
                <button
                    type="button"
                    className="peer relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-slate-500"
                    onClick={() => setModalOpen(true)}
                >
                    {!user.avatar && (
                        <p className="text-3xl font-semibold text-white">
                            {user?.name.slice(0, 1)}
                        </p>
                    )}
                    {user.avatar && (
                        <Image
                            src={user.avatar}
                            alt="profile picture"
                            fill
                            className="object-cover"
                        />
                    )}
                </button>
                <div className="pointer-events-none absolute -bottom-1 -right-1 rounded-full border bg-white p-1 peer-hover:bg-slate-200">
                    <PencilIcon className="h-3 w-3" />
                </div>
            </div>

            <Modal
                title="Profile picture"
                description="A picture helps people recognize you and lets you know when you’re signed in to your account"
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            >
                <div className="mt-6">
                    <div className="relative mx-auto flex h-64 w-64 items-center justify-center overflow-hidden rounded-full bg-gray-500">
                        {/* Not upload new avatar yet, show current avatar */}
                        {(!watch('avatar') || watch('avatar').length === 0) && (
                            <>
                                {user.avatar && (
                                    <Image
                                        src={user.avatar}
                                        alt="profile picture"
                                        fill
                                        className="object-cover"
                                    />
                                )}
                                {!user.avatar && (
                                    <p className="text-8xl font-semibold text-white">
                                        {user.name.slice(0, 1)}
                                    </p>
                                )}
                            </>
                        )}

                        {/* Upload new avatar, show newly uploaded avatar instead */}
                        {watch('avatar')?.length > 0 && (
                            <Image
                                src={URL.createObjectURL(watch('avatar')[0])}
                                alt="profile picture"
                                fill
                                className="object-cover"
                            />
                        )}
                    </div>
                </div>

                {/* Not upload new avatar yet, show file picker */}
                {(!watch('avatar') || watch('avatar').length === 0) && (
                    <div className="mt-6">
                        <div className="grid grid-cols-3 items-center gap-2">
                            <input
                                type="file"
                                accept="image/*"
                                id="file"
                                className="hidden"
                                {...register('avatar')}
                            />
                            <button
                                type="button"
                                className="rounded border border-gray-300 text-sm font-semibold text-blue-500"
                            >
                                <label
                                    htmlFor="file"
                                    className="flex cursor-pointer items-center justify-center gap-2 px-6 py-2"
                                >
                                    <ArrowUpTrayIcon className="h-4 w-4 text-blue-500" />
                                    <span>Upload</span>
                                </label>
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 rounded border border-gray-300 px-6 py-2 text-sm font-semibold text-blue-500"
                            >
                                <PencilIcon className="h-4 w-4 text-blue-500" />
                                <span>Select</span>
                            </button>

                            {/* User only able to remove avatar if currently has one */}
                            {user.avatar && (
                                <>
                                    <button
                                        type="button"
                                        className="flex items-center justify-center gap-2 rounded border border-gray-300 px-6 py-2 text-sm font-semibold text-blue-500"
                                        onClick={() => {
                                            try {
                                                setValue(
                                                    'shouldRemoveAvatar',
                                                    true
                                                )
                                                onSubmit()
                                                setModalOpen(false)
                                            } catch (err) {
                                                toast.error(
                                                    'Failed to remove profile picture'
                                                )
                                            }
                                        }}
                                    >
                                        <TrashIcon className="h-4 w-4 text-blue-500" />
                                        <span>Remove</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Upload new avatar, show options for save or cancel */}
                {watch('avatar')?.length > 0 && (
                    <div className="mt-6">
                        <div className="grid grid-cols-2 items-center gap-2">
                            <button
                                type="button"
                                className="rounded border border-gray-300 bg-blue-500 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-400"
                                onClick={() => {
                                    try {
                                        onSubmit()
                                        setModalOpen(false)
                                    } catch (err) {
                                        toast.error(
                                            'Failed to update profile picture'
                                        )
                                    }
                                }}
                            >
                                <span>Save</span>
                            </button>
                            <button
                                type="button"
                                className="rounded border border-gray-300 px-6 py-2 text-sm font-semibold text-blue-500 hover:bg-gray-100"
                                onClick={() => resetField('avatar')}
                            >
                                <span>Cancel</span>
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    )
}

const Form = () => {
    const { user, setUser } = useAuthContext()
    const methods = useForm<Inputs>({
        defaultValues: {
            name: user?.name,
        },
    })
    const {
        register,
        watch,
        resetField,
        handleSubmit,
        formState: { errors },
    } = methods

    const onSubmit = handleSubmit(async (formData) => {
        const data = new FormData()

        if (formData.avatar?.length > 0) {
            // Case 1: Update avatar
            data.append('avatar', formData.avatar[0])
        } else if (user?.avatar && formData.shouldRemoveAvatar) {
            // Case 2: Remove avatar
            data.append('shouldRemoveAvatar', 'true')
        } else {
            // Case 2: Update other info
            data.append('name', formData.name)
        }

        const res = await fetch('http://localhost:8080/api/users/profile', {
            method: 'PUT',
            body: data,
            credentials: 'include',
        })

        if (!res.ok) {
            throw new Error('Server error')
        }

        const updatedUser = await res.json()
        setUser(updatedUser)
        resetField('avatar')
        toast.success('Profile updated!')
    })

    return (
        <div className="mx-auto max-w-md text-slate-700">
            <h1 className="text-center text-3xl font-bold">Update profile</h1>
            <FormProvider {...methods}>
                <form className="mt-8" onSubmit={onSubmit}>
                    <ImageSelect onSubmit={onSubmit} />

                    <div className="mt-6">
                        <label htmlFor="name">Username</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Your username"
                            className="mt-2 w-full rounded border border-slate-500 px-4 py-2"
                            {...register('name', {
                                required: 'Username is required',
                            })}
                        />
                        {errors.name && (
                            <p
                                role="alert"
                                className="mt-2 text-sm text-red-500"
                            >
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            disabled={watch('name') === user?.name}
                            className="w-full rounded bg-slate-200 px-8 py-3 disabled:bg-slate-100"
                        >
                            Save changes
                        </button>
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}

const Profile = () => {
    const { isLoading } = useAuthContext()

    if (isLoading) return <p>Loading...</p>

    return <Form />
}

export default Profile
