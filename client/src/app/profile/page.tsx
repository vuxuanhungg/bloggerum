'use client'
import { useForm } from 'react-hook-form'
import { useAuthContext } from '../context/AuthContext'
import { toast } from 'react-toastify'

const Form = () => {
    const { user, setUser } = useAuthContext()
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<{ name: string }>({
        defaultValues: { name: user?.name },
    })
    const onSubmit = handleSubmit(async (formData) => {
        const res = await fetch('http://localhost:8080/api/users/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(formData),
            credentials: 'include',
        })

        const user = await res.json()
        setUser(user)
        toast.success('Profile updated!')
    })

    return (
        <div className="mx-auto max-w-md text-slate-700">
            <h1 className="text-center text-3xl font-bold">Update profile</h1>
            <form className="mt-8" onSubmit={onSubmit}>
                <div>
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
                        <p role="alert" className="mt-2 text-sm text-red-500">
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
        </div>
    )
}

const Profile = () => {
    const { isLoading } = useAuthContext()

    if (isLoading) return <p>Loading...</p>

    return <Form />
}

export default Profile
