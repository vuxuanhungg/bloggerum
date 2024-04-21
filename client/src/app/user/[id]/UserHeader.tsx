'use client'
import Image from 'next/image'
import { PostProps } from '~/app/types'

const UserHeader = ({ user }: { user: PostProps['user'] }) => {
    return (
        <div className="flex justify-center">
            <div className="inline-flex items-center justify-center gap-6 rounded-xl border px-10 py-4">
                <div className="relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-slate-500">
                    {!user.avatar && (
                        <p className="font-semibold text-white">
                            {user.name.slice(0, 1)}
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
