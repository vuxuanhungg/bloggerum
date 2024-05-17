import { ChatBubbleLeftIcon, TrashIcon } from '@heroicons/react/24/outline'
import isHotkey from 'is-hotkey'
import { useState } from 'react'
import { Node, Transforms } from 'slate'
import {
    ReactEditor,
    RenderElementProps,
    useFocused,
    useReadOnly,
    useSelected,
    useSlateStatic,
} from 'slate-react'
import Modal from '../../Modal'
import { TEBI_BUCKET_NAME, TEBI_ENDPOINT } from '../constants'
import { ImageElement as ImageElementType } from '../types'

const ImageElement = ({
    attributes,
    children,
    element,
}: RenderElementProps) => {
    const editor = useSlateStatic()
    const path = ReactEditor.findPath(editor, element)
    const selected = useSelected()
    const focused = useFocused()
    const readOnly = useReadOnly()
    const [imageNode] = Array.from(Node.elements(element))
    const [caption, setCaption] = useState(
        (imageNode[0] as ImageElementType).caption
    )
    const [modalOpen, setModalOpen] = useState(false)

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
                <figure>
                    <img
                        src={element.url}
                        alt={caption}
                        className={`${selected && focused ? 'ring-2 ring-green-600 ring-offset-2' : ''} w-full rounded`}
                    />
                    {caption && (
                        <figcaption
                            className="mt-3 text-center text-sm"
                            onClick={() => setModalOpen(true)}
                        >
                            {caption}
                        </figcaption>
                    )}
                </figure>
                {!readOnly && (
                    <div className="absolute right-2 top-2 flex items-center gap-2">
                        <button
                            type="button"
                            title="Image caption"
                            className="group rounded bg-white p-2"
                            onClick={() => setModalOpen(true)}
                        >
                            <ChatBubbleLeftIcon className="h-4 w-4 group-hover:text-green-600" />
                        </button>
                        <button
                            type="button"
                            title="Remove image"
                            className="group rounded bg-white p-2"
                            onClick={removeImage}
                        >
                            <TrashIcon className="h-4 w-4 group-hover:text-red-600" />
                        </button>
                    </div>
                )}
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <div className="text-sm">
                    <input
                        type="text"
                        placeholder="Image caption"
                        className="w-full rounded border-2 px-3 py-1.5 shadow-sm focus:outline-green-600"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        onKeyDown={(e) => {
                            if (isHotkey('Enter', e)) {
                                e.preventDefault()
                                Transforms.setNodes(editor, { caption })
                                setModalOpen(false)
                            }
                        }}
                    />
                </div>
            </Modal>
        </div>
    )
}

export default ImageElement
