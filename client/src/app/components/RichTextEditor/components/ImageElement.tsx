import { TrashIcon } from '@heroicons/react/20/solid'
import { Transforms } from 'slate'
import {
    ReactEditor,
    RenderElementProps,
    useFocused,
    useSelected,
    useSlateStatic,
} from 'slate-react'
import { TEBI_BUCKET_NAME, TEBI_ENDPOINT } from '../constants'

const ImageElement = ({
    attributes,
    children,
    element,
}: RenderElementProps) => {
    const editor = useSlateStatic()
    const path = ReactEditor.findPath(editor, element)
    const selected = useSelected()
    const focused = useFocused()

    if (element.type !== 'image') return null

    const removeImage = async () => {
        // Remove image from client
        Transforms.removeNodes(editor, { at: path })

        const tebiImageUrlPrefix = `${TEBI_ENDPOINT}/${TEBI_BUCKET_NAME}`

        if (!element.url.includes(tebiImageUrlPrefix)) return

        // Remove image from Tebi
        await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/images/${element.url.replace(`${tebiImageUrlPrefix}/`, '')}`,
            {
                method: 'DELETE',
                credentials: 'include',
            }
        )
    }

    return (
        <div {...attributes}>
            {children}
            <div contentEditable={false} className="relative">
                <img
                    src={element.url}
                    alt=""
                    className={`${selected && focused ? 'ring-2 ring-green-600 ring-offset-2' : ''} rounded`}
                />
                <button
                    type="button"
                    className={`group absolute right-2 top-2 rounded bg-white p-2`}
                    onClick={removeImage}
                >
                    <TrashIcon className="h-4 w-4 group-hover:text-red-600" />
                </button>
            </div>
        </div>
    )
}

export default ImageElement
