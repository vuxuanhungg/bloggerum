import { format } from 'date-fns'
import { PostProps } from '~/app/types'

const DetailPost = async ({ params }: { params: { id: string } }) => {
    const res = await fetch(`http://localhost:8080/api/posts/${params.id}`)
    const post: PostProps = await res.json()

    return (
        <div>
            <h1 className="container mx-auto max-w-3xl text-center text-3xl font-bold leading-normal text-slate-800">
                {post.title}
            </h1>
            <div className="mt-4 flex items-center justify-center gap-4">
                <div className="h-9 w-9 rounded-full bg-green-500"></div>
                <div>
                    <h3>Xuan Hung</h3>
                    <p className="text-sm text-slate-500">
                        {format(new Date(post.createdAt), 'MMMM dd, yyyy')}
                    </p>
                </div>
            </div>
            <div className="mx-auto mt-8 aspect-video max-w-4xl bg-slate-500 lg:rounded-lg"></div>
            <div className="container mx-auto mt-8 max-w-2xl text-slate-800">
                <p>{post.body}</p>
            </div>
        </div>
    )
}

export default DetailPost
