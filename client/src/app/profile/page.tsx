'use client'
import {
    ArrowUpTrayIcon,
    EllipsisVerticalIcon,
    TrashIcon,
} from '@heroicons/react/20/solid'
import { Menu, Transition } from '@headlessui/react'
import { PencilIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { Fragment, useState } from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'

import TextareaAutosize from 'react-textarea-autosize'
import { toast } from 'react-toastify'
import { revalidatePosts } from '../actions'
import Modal from '../components/Modal'
import { useAuthContext } from '../context/AuthContext'
import Spinner from '../components/Spinner'

interface Inputs {
    name: string
    email: string
    bio: string
    avatar: FileList
    shouldRemoveAvatar: boolean
}

interface ImageSelectProps {
    onSubmit: () => Promise<void>
}

const ImageSelect = ({ onSubmit }: ImageSelectProps) => {
    const { user } = useAuthContext()
    const { register, watch, setValue, resetField } = useFormContext<Inputs>()
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
                            sizes="4rem"
                            className="object-cover"
                        />
                    )}
                </button>
                <div className="pointer-events-none absolute -bottom-1 -right-1 rounded-full border bg-white p-1 peer-hover:bg-green-200">
                    <PencilIcon className="h-3 w-3" />
                </div>
            </div>

            <Modal
                title="Profile picture"
                description="A picture helps people recognize you and lets you know when you’re signed in to your account"
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            >
                <div className="absolute right-4 top-6">
                    <Menu as="div" className="relative">
                        <Menu.Button>
                            <EllipsisVerticalIcon className="h-5 w-5" />
                        </Menu.Button>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`${
                                                active
                                                    ? 'bg-gray-200'
                                                    : 'text-gray-900'
                                            } w-full rounded-md px-4 py-3 text-sm`}
                                            onClick={() =>
                                                toast.warn(
                                                    'This feature is not yet available'
                                                )
                                            }
                                        >
                                            Past profile pictures
                                        </button>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
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
                                        sizes="16rem"
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
                                sizes="16rem"
                                className="object-cover"
                            />
                        )}
                    </div>
                </div>

                {/* Not upload new avatar yet, show file picker */}
                {(!watch('avatar') || watch('avatar').length === 0) && (
                    <div className="mt-6">
                        <div
                            className={`grid items-center gap-2 ${user.avatar ? 'grid-cols-2' : 'grid-cols-1'}`}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                id="file"
                                className="hidden"
                                {...register('avatar')}
                            />
                            <button
                                type="button"
                                className="rounded border border-gray-300 text-sm font-semibold text-green-600"
                            >
                                <label
                                    htmlFor="file"
                                    className="flex cursor-pointer items-center justify-center gap-2 px-6 py-3"
                                >
                                    <ArrowUpTrayIcon className="h-4 w-4 text-green-600" />
                                    <span>Upload</span>
                                </label>
                            </button>

                            {/* User only able to remove avatar if currently has one */}
                            {user.avatar && (
                                <>
                                    <button
                                        type="button"
                                        className="flex items-center justify-center gap-2 rounded border border-gray-300 px-6 py-3 text-sm font-semibold text-green-600"
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
                                        <TrashIcon className="h-4 w-4 text-green-600" />
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
                                className="rounded border border-gray-300 bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-500"
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
                                className="rounded border border-gray-300 px-6 py-3 text-sm font-semibold text-green-600 hover:bg-gray-100"
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
            email: user?.email,
            bio: user?.bio,
        },
    })
    const {
        register,
        watch,
        resetField,
        handleSubmit,
        formState: { errors, isSubmitting },
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
            data.append('bio', formData.bio)
        }

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`,
            {
                method: 'PUT',
                body: data,
                credentials: 'include',
            }
        )

        if (!res.ok) {
            throw new Error('Server error')
        }

        const updatedUser = await res.json()
        setUser(updatedUser)
        resetField('avatar')
        toast.success('Profile updated!')
        revalidatePosts()
    })

    return (
        <div className="container mx-auto max-w-md lg:min-w-[28rem]">
            <h1 className="text-center text-3xl font-bold">Update profile</h1>
            <FormProvider {...methods}>
                <form className="mt-8" onSubmit={onSubmit}>
                    <ImageSelect onSubmit={onSubmit} />

                    <div className="mt-6">
                        <label
                            htmlFor="name"
                            className="text-sm font-medium text-gray-700"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Your username"
                            className="mt-2 w-full rounded border px-4 py-2 shadow-sm focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-green-600"
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
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            type="text"
                            id="email"
                            placeholder="Your email"
                            className="mt-2 w-full rounded border px-4 py-2 shadow-sm focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-green-600 disabled:bg-gray-100"
                            {...register('email')}
                            disabled
                        />
                    </div>

                    <div className="mt-6">
                        <label
                            htmlFor="bio"
                            className="text-sm font-medium text-gray-700"
                        >
                            Bio
                        </label>
                        <TextareaAutosize
                            minRows={3}
                            id="bio"
                            placeholder="Your bio"
                            className="mt-2 w-full rounded border px-4 py-2 shadow-sm focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-green-600"
                            {...register('bio')}
                        />
                        {errors.bio && (
                            <p
                                role="alert"
                                className="mt-2 text-sm text-red-500"
                            >
                                {errors.bio.message}
                            </p>
                        )}
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            disabled={
                                (watch('name') === user?.name &&
                                    watch('bio') === user?.bio) ||
                                isSubmitting
                            }
                            className="w-full rounded bg-green-600 px-8 py-3 font-semibold text-white enabled:hover:bg-green-500 disabled:bg-green-500"
                        >
                            <div className="flex items-center justify-center gap-2">
                                {isSubmitting && (
                                    <Spinner size="sm" color="white" />
                                )}
                                Save changes
                            </div>
                        </button>
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}

const Profile = () => {
    const { isLoading } = useAuthContext()

    if (isLoading)
        return (
            <div className="flex justify-center">
                <Spinner size="lg" />
            </div>
        )

    return <Form />
}

export default Profile
