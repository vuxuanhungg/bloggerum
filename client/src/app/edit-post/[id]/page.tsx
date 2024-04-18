import Form from './Form'

const EditPost = async ({ params }: { params: { id: string } }) => {
    const res = await fetch(`http://localhost:8080/api/posts/${params.id}`)
    const post = await res.json()

    return <Form post={post} />
}

export default EditPost
