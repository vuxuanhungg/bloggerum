export type UserProps = {
    _id: string
    name: string
    email: string
    avatar?: string
    bio: string
}

export type PostProps = {
    _id: string
    title: string
    body: string
    thumbnail: string
    user: Omit<UserProps, 'email'>
    tags: string[]
    updatedAt: string
    relatedPosts: PostProps[]
}
