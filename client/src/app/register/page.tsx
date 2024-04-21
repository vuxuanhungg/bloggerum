'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useAuthContext } from '../context/AuthContext'

type Inputs = {
    name: string
    email: string
    password: string
    confirmPassword: string
}

const Register = () => {
    const router = useRouter()
    const { setUser } = useAuthContext()
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit = handleSubmit(async (formData) => {
        const res = await fetch('http://localhost:8080/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(formData),
            credentials: 'include',
        })

        if (res.status === 400) {
            toast.error('User already exists')
            return
        }

        const user = await res.json()
        setUser(user)
        router.replace('/')
    })

    return (
        <div className="container mx-auto max-w-md lg:min-w-[28rem]">
            <h1 className="text-center text-3xl font-bold">
                Create an account
            </h1>
            <p className="mt-2 text-center text-sm text-gray-500">
                A few steps towards great things.
            </p>

            <form className="mt-8" onSubmit={onSubmit}>
                <div>
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
                        <p role="alert" className="mt-2 text-sm text-red-500">
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
                        className="mt-2 w-full rounded border px-4 py-2 shadow-sm focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-green-600"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                message: 'Please provide a valid email',
                            },
                        })}
                    />
                    {errors.email && (
                        <p role="alert" className="mt-2 text-sm text-red-500">
                            {errors.email.message}
                        </p>
                    )}
                </div>
                <div className="mt-6">
                    <label
                        htmlFor="password"
                        className="text-sm font-medium text-gray-700"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Your password"
                        className="mt-2 w-full rounded border px-4 py-2 shadow-sm focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-green-600"
                        {...register('password', {
                            required: 'Password is required',
                        })}
                    />
                    {errors.password && (
                        <p role="alert" className="mt-2 text-sm text-red-500">
                            {errors.password.message}
                        </p>
                    )}
                </div>
                <div className="mt-6">
                    <label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium text-gray-700"
                    >
                        Confirm password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm password"
                        className="mt-2 w-full rounded border px-4 py-2 shadow-sm focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-green-600"
                        {...register('confirmPassword', {
                            required: 'Please confirm your password',
                            validate: (value) => {
                                if (value !== watch('password'))
                                    return 'Your password do not match'
                            },
                        })}
                    />
                    {errors.confirmPassword && (
                        <p role="alert" className="mt-2 text-sm text-red-500">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>
                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full rounded bg-black px-8 py-3 font-semibold text-white"
                    >
                        Register
                    </button>
                </div>
                <div className="mt-8">
                    <div className="flex items-center justify-center gap-2">
                        <p>Already a member?</p>
                        <Link
                            href="/login"
                            className="text-green-600 underline"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Register
