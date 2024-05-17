import { toast } from 'react-toastify'
import { Editor, Node, Range, Element as SlateElement, Transforms } from 'slate'
import { LIST_TYPES, TEXT_ALIGN_TYPES } from './constants'
import type {
    BlockFormat,
    ImageElement,
    LinkElement,
    MarkFormat,
    TextAlign,
} from './types'

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
                n.type !== 'link' &&
                n[blockType] === format,
        })
    )

    return !!match
}

export const isLinkActive = (editor: Editor) => {
    const [link] = Array.from(
        Editor.nodes(editor, {
            match: (n) =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                n.type === 'link',
        })
    )
    return !!link
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

export const uploadImageToServer = async (image: File) => {
    const data = new FormData()
    data.append('image', image)
    data.append('resize', JSON.stringify(false))

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/images`, {
        method: 'POST',
        body: data,
        credentials: 'include',
    })
    if (!res.ok) {
        toast.error('Error uploading image to server.')
        return null
    }
    const { imageUrl }: { imageUrl: string } = await res.json()
    return { imageUrl }
}

export const insertImage = (editor: Editor, url: string) => {
    const text = { text: '' }
    const image: ImageElement = { type: 'image', url, children: [text] }
    Transforms.insertNodes(editor, image)
    Transforms.insertNodes(editor, {
        type: 'paragraph',
        children: [{ text: '' }],
    })
}

export const wrapLink = (editor: Editor, url: string) => {
    const { selection } = editor
    const isCollapsed = selection && Range.isCollapsed(selection)
    const link: LinkElement = {
        type: 'link',
        url,
        children: isCollapsed ? [{ text: url }] : [],
    }

    if (isCollapsed) {
        Transforms.insertNodes(editor, link)
    } else {
        Transforms.wrapNodes(editor, link, { split: true })
        Transforms.collapse(editor, { edge: 'end' })
    }
}
