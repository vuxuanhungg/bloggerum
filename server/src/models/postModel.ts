import { Schema, Types, model } from 'mongoose'

interface IPost {
    title: string
    body: string
    thumbnail: string
    userId: Types.ObjectId
    tags: string[]
}

const postSchema = new Schema<IPost>(
    {
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        tags: [
            {
                type: String,
            },
        ],
    },
    {
        timestamps: true,
    }
)

const Post = model('Post', postSchema)

export default Post
