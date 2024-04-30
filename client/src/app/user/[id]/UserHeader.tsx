'use client'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { UserProps } from '~/app/types'

const UserHeader = () => {
    const [user, setUser] = useState<UserProps | null>(null)
    const { id } = useParams<{ id: string }>()

    useEffect(() => {
        const fetchUserProfileById = async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile/${id}`
            )
            const user = await res.json()
            setUser(user)
        }

        fetchUserProfileById()
    }, [id])

    if (!user) return null

    return (
        <div className="flex justify-center">
            <div className="inline-flex items-center justify-center gap-6 rounded-xl border px-6 py-4 lg:px-10">
                <div className="relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-slate-500">
                    {!user.avatar && (
                        <p className="text-5xl font-semibold text-white">
                            {user.name.slice(0, 1)}
                        </p>
                    )}
                    {user.avatar && (
                        <Image
                            src={user.avatar}
                            alt="profile picture"
                            fill
                            sizes="10rem"
                            priority
                            className="object-cover"
                        />
                    )}
                </div>
                <div>
                    <h1 className="text-xl font-semibold">{user.name}</h1>
                    <p className="mt-2 line-clamp-4 max-w-80 text-sm text-gray-500">
                        {user.bio}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default UserHeader
