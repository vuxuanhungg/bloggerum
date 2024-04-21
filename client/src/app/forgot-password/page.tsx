'use client'
import { InboxArrowDownIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

const ForgotPassword = () => {
    const [messageUrl, setMessageUrl] = useState<string | null>(null)
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitSuccessful },
    } = useForm<{ email: string }>()

    const onSubmit = handleSubmit(async (formData) => {
        const res = await fetch(
            'http://localhost:8080/api/users/forgot-password',
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

    return (
        <div className="mx-auto my-8 min-w-[28rem] max-w-md">
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
                                className="w-full rounded bg-black px-8 py-3 text-white"
                            >
                                Reset password
                            </button>
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
