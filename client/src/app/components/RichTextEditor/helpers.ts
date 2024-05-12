import isUrl from 'is-url'
import { toast } from 'react-toastify'
import { Editor, Node, Element as SlateElement, Transforms } from 'slate'
import { LIST_TYPES, TEXT_ALIGN_TYPES } from './constants'
import type { BlockFormat, ImageElement, MarkFormat, TextAlign } from './types'

export const isMarkActive = (editor: Editor, format: MarkFormat) => {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
}

export const isBlockActive = (
    editor: Editor,
    format: BlockFormat,
    blockType: 'type' | 'align' = 'type'
) => {
    const { selection } = editor
    if (!selection) return false

    const [match] = Array.from(
        Editor.nodes(editor, {
            at: Editor.unhangRange(editor, selection),
            match: (n) =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                n.type !== 'image' &&
                n[blockType] === format,
        })
    )

    return !!match
}

export const toggleMark = (editor: Editor, format: MarkFormat) => {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}

export const toggleBlock = (editor: Editor, format: BlockFormat) => {
    const isActive = isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
    )
    const isList = LIST_TYPES.includes(format)

    Transforms.unwrapNodes(editor, {
        match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            LIST_TYPES.includes(n.type) &&
            !TEXT_ALIGN_TYPES.includes(format),
        split: true,
    })
    let newProperties: Partial<SlateElement>
    if (TEXT_ALIGN_TYPES.includes(format)) {
        newProperties = {
            align: isActive ? undefined : (format as TextAlign),
        }
    } else {
        newProperties = {
            type: isActive ? 'paragraph' : isList ? 'list-item' : format,
        }
    }
    Transforms.setNodes<SlateElement>(editor, newProperties)

    if (!isActive && isList) {
        const block = { type: format, children: [] }
        Transforms.wrapNodes(editor, block)
    }
}

export const serialize = (nodes: Node[]) => {
    return nodes.map((n) => Node.string(n)).join('\n')
}

const isImageUrl = (url: string) => {
    if (!url) return false
    if (!isUrl(url)) return false
    return fetch(url, { method: 'HEAD' }).then((res) => {
        return res.headers.get('Content-Type')?.startsWith('image')
    })
}

const insertImage = (editor: Editor, url: string) => {
    const text = { text: '' }
    const image: ImageElement = { type: 'image', url, children: [text] }
    Transforms.insertNodes(editor, image)
    Transforms.insertNodes(editor, {
        type: 'paragraph',
        children: [text],
    })
}

export const withImages = (editor: Editor) => {
    const { insertData, isVoid } = editor

    editor.isVoid = (element) => element.type === 'image' || isVoid(element)
    editor.insertData = (data) => {
        const text = data.getData('text/plain')
        const { files } = data

        if (files?.length > 0) {
            Array.from(files).forEach(async (file) => {
                const [mime] = file.type.split('/')

                if (mime === 'image') {
                    const data = new FormData()
                    data.append('image', file)
                    data.append('resize', JSON.stringify(false))

                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/images`,
                        {
                            method: 'POST',
                            body: data,
                            credentials: 'include',
                        }
                    )
                    if (!res.ok) {
                        return toast.error('Error occurred')
                    }
                    const { imageUrl }: { imageUrl: string } = await res.json()
                    insertImage(editor, imageUrl)
                }
            })
        } else if (isImageUrl(text)) {
            insertImage(editor, text)
        } else {
            insertData(data)
        }
    }

    return editor
}
