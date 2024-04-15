'use client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useAuthContext } from '~/app/context/AuthContext'

type Inputs = {
    password: string
    confirmPassword: string
}

const ChangePassword = ({
    params: { token },
}: {
    params: { token: string }
}) => {
    const router = useRouter()
    const { setUser } = useAuthContext()
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()

    const onSubmit = handleSubmit(async (formData) => {
        const res = await fetch(
            'http://localhost:8080/api/users/change-password',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    password: formData.password,
                    token,
                }),
                credentials: 'include',
            }
        )

        if (!res.ok) {
            throw new Error('Server error')
        }

        const updatedUser = await res.json()
        setUser(updatedUser)
        toast.success('Password updated!')
        router.push('/')
    })

    return (
        <div className="mx-auto max-w-md text-slate-700">
            <h1 className="text-center text-3xl font-bold">Change password</h1>
            <form className="mt-8" onSubmit={onSubmit}>
                <div>
                    <label htmlFor="password">New password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="New password"
                        className="mt-2 w-full rounded border border-slate-500 px-4 py-2"
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
                    <label htmlFor="confirmPassword">Confirm password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm password"
                        className="mt-2 w-full rounded border border-slate-500 px-4 py-2"
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
                        className="w-full rounded bg-slate-200 px-8 py-3"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ChangePassword
