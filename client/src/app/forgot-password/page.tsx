'use client'
import { InboxArrowDownIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Spinner from '../components/Spinner'
import { useAuthContext } from '../context/AuthContext'

const ForgotPassword = () => {
    const [messageUrl, setMessageUrl] = useState<string | null>(null)
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitSuccessful },
    } = useForm<{ email: string }>()

    const onSubmit = handleSubmit(async (formData) => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/forgot-password`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify(formData),
            }
        )

        if (!res.ok) {
            throw new Error('Error occurred')
        }

        const { messageUrl } = await res.json()
        setMessageUrl(messageUrl)
    })

    const router = useRouter()
    const { user } = useAuthContext()
    useEffect(() => {
        if (user) {
            router.push('/')
        }
    }, [router, user])

    return (
        <div className="container mx-auto max-w-md lg:min-w-[28rem]">
            {!isSubmitSuccessful && (
                <>
                    <h1 className="text-center text-3xl font-bold">
                        Forgot password
                    </h1>
                    <p className="mt-2 text-center text-sm text-gray-500">
                        Enter your email to reset password
                    </p>
                    <form className="mt-8" onSubmit={onSubmit}>
                        <div>
                            <label
                                htmlFor="email"
                                className="font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Your email"
                                className="mt-2 w-full rounded border px-4 py-2 text-sm shadow-sm focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-green-600"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                        message: 'Please provide a valid email',
                                    },
                                })}
                            />
                            {errors.email && (
                                <p
                                    role="alert"
                                    className="mt-2 text-sm text-red-500"
                                >
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex w-full items-center justify-center gap-2 rounded bg-black px-8 py-3 font-semibold text-white"
                            >
                                {isSubmitting && (
                                    <Spinner size="sm" color="white" />
                                )}
                                Reset password
                            </button>
                        </div>
                        <div className="mt-6">
                            <Link
                                href="/login"
                                className="block text-center text-green-600 underline"
                            >
                                Back to login
                            </Link>
                        </div>
                    </form>
                </>
            )}
            {isSubmitSuccessful && messageUrl && (
                <div className="flex flex-col items-center gap-4">
                    <InboxArrowDownIcon className="h-8 w-8 text-gray-500" />
                    <div>
                        <h1 className="text-center text-3xl font-bold">
                            Check your email
                        </h1>
                        <p className="mt-2 text-center text-sm text-gray-500">
                            We&apos;ve sent instructions on how to reset your
                            password to your email.
                        </p>
                    </div>
                    <a
                        href={messageUrl}
                        target="_blank"
                        rel="noopener"
                        className="text-green-600 underline"
                    >
                        Demo message
                    </a>
                </div>
            )}
        </div>
    )
}

export default ForgotPassword
