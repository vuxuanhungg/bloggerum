'use client'
import Link from 'next/link'
import { useAuthContext } from '~/app/context/AuthContext'

const Actions = ({ userId }: { userId: string }) => {
    const { user } = useAuthContext()

    return (
        <div>
            <div className="flex items-center justify-center gap-4">
                {user?._id === userId && (
                    <Link
                        href={`/profile`}
                        className="rounded border border-slate-400 px-5 py-2"
                    >
                        Update profile
                    </Link>
                )}
            </div>
        </div>
    )
}

export default Actions
