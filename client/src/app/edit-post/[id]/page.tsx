import Form from './Form'

const EditPost = async ({ params }: { params: { id: string } }) => {
    const res = await fetch(`${process.env.API_BASE_URL}/posts/${params.id}`)
    const post = await res.json()

    return <Form post={post} />
}

export default EditPost
