import { Menu, Transition } from '@headlessui/react'
import {
    ArrowLeftEndOnRectangleIcon,
    ChevronDownIcon,
    PencilSquareIcon,
    UserIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Fragment } from 'react'
import { toast } from 'react-toastify'
import { useAuthContext } from '../context/AuthContext'

const UserPanel = () => {
    const router = useRouter()
    const { user, setUser } = useAuthContext()

    const logOut = async () => {
        const res = await fetch('http://localhost:8080/api/users/logout', {
            method: 'POST',
            credentials: 'include',
        })
        if (res.ok) {
            setUser(null)
            toast.success('Successfully logged out!')
            router.push('/login')
            return
        }
        toast.error('Error occurred')
    }

    // TODO: This could be handled better
    if (!user) return null

    return (
        <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="flex items-center gap-2">
                <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-slate-500">
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
                <span className="ml-1 text-gray-700">{user.name}</span>
                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-72 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                    <div className="p-1">
                        <div className="flex items-center gap-4 px-4 py-3">
                            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-slate-500">
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
                            <div className="flex flex-col">
                                <h3 className="text-lg font-semibold">
                                    {user.name}
                                </h3>
                                <p className="text-sm text-gray-700">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-1">
                        <Menu.Item>
                            {({ active }) => (
                                <Link
                                    href={`/user/${user._id}`}
                                    className={`${
                                        active ? 'bg-gray-200' : 'text-gray-900'
                                    } flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm`}
                                >
                                    <PencilSquareIcon className="h-5 w-5 text-gray-500" />
                                    My Posts
                                </Link>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <Link
                                    href="/profile"
                                    className={`${
                                        active ? 'bg-gray-200' : 'text-gray-900'
                                    } flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm`}
                                >
                                    <UserIcon className="h-5 w-5 text-gray-500" />
                                    Account
                                </Link>
                            )}
                        </Menu.Item>
                    </div>

                    <div className="p-1">
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    className={`${
                                        active ? 'bg-gray-200' : 'text-gray-900'
                                    } flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm`}
                                    onClick={logOut}
                                >
                                    <ArrowLeftEndOnRectangleIcon className="h-5 w-5 text-gray-500" />
                                    Log Out
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}

export default UserPanel
