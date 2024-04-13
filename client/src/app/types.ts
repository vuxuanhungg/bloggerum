export type PostProps = {
    _id: string
    title: string
    body: string
    thumbnail: string
    user: {
        _id: string
        name: string
    }
    tags: string[]
    updatedAt: string
}

export type UserProps = {
    _id: string
    name: string
    email: string
}
