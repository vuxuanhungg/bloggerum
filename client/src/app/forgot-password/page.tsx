'use client'
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
        <div className="mx-auto max-w-md text-slate-700">
            {!isSubmitSuccessful && (
                <>
                    <h1 className="text-center text-3xl font-bold">
                        Forgot password
                    </h1>
                    <form className="mt-8" onSubmit={onSubmit}>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Your email"
                                className="mt-2 w-full rounded border border-slate-500 px-4 py-2"
                                {...register('email', {
                                    required: 'Email is required',
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
                                className="w-full rounded bg-slate-200 px-8 py-3"
                            >
                                Reset password
                            </button>
                        </div>
                    </form>
                </>
            )}
            {isSubmitSuccessful && messageUrl && (
                <div>
                    <p>Check your email for our reset-password link.</p>
                    <a
                        href={messageUrl}
                        target="_blank"
                        rel="noopener"
                        className="underline"
                    >
                        Go to message
                    </a>
                </div>
            )}
        </div>
    )
}

export default ForgotPassword
