'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useAuthContext } from '../context/AuthContext'

type Inputs = {
    email: string
    password: string
    shouldRememberUser: boolean
}

const Login = () => {
    const router = useRouter()
    const { setUser } = useAuthContext()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit = handleSubmit(async (formData) => {
        const res = await fetch('http://localhost:8080/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(formData),
            credentials: 'include',
        })

        if (res.status === 401) {
            toast.error('Invalid email or password')
            return
        }

        const user = await res.json()
        setUser(user)
        router.replace('/')
    })

    return (
        <div className="mx-auto min-w-[28rem] max-w-md">
            <h1 className="text-center text-3xl font-bold">Welcome back!</h1>
            <p className="mt-2 text-center text-sm text-gray-500">
                Sign in to start creating.
            </p>
            <form className="mt-8" onSubmit={onSubmit}>
                <div>
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

                <div className="mt-4">
                    <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-1">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                className="cursor-pointer"
                                {...register('shouldRememberUser')}
                            />
                            <label
                                htmlFor="rememberMe"
                                className="cursor-pointer"
                            >
                                Remember me
                            </label>
                        </div>
                        <Link
                            href="/forgot-password"
                            className="text-green-600 underline"
                        >
                            Forgot password?
                        </Link>
                    </div>
                </div>
                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full rounded bg-black px-8 py-3 font-semibold text-white"
                    >
                        Login
                    </button>
                </div>
                <div className="mt-8">
                    <div className="flex items-center justify-center gap-2">
                        <p>Not a member?</p>
                        <Link
                            href="/register"
                            className="text-green-600 underline"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Login
