import Image from 'next/image'
import { MouseEventHandler, ReactNode } from 'react'
import { useSlate, useSlateStatic } from 'slate-react'
import imageIcon from '../assets/Image.svg'
import linkIcon from '../assets/LinkSimple.svg'
import { TEXT_ALIGN_TYPES } from '../constants'
import { useLinkInputContext } from '../context/LinkInputContext'
import {
    insertImage,
    isBlockActive,
    isMarkActive,
    toggleBlock,
    toggleMark,
    uploadImageToServer,
} from '../helpers'
import { BlockFormat, MarkFormat } from '../types'

const Button = ({
    children,
    active,
    onClick,
}: {
    children: ReactNode
    active: boolean
    onClick: MouseEventHandler<HTMLButtonElement>
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded p-1 ${active ? 'bg-gray-200' : ''}`}
        >
            {children}
        </button>
    )
}

const BlockButton = ({
    children,
    format,
}: {
    children: ReactNode
    format: BlockFormat
}) => {
    const editor = useSlate()
    return (
        <Button
            active={isBlockActive(
                editor,
                format,
                TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
            )}
            onClick={(e) => {
                e.preventDefault()
                toggleBlock(editor, format)
            }}
        >
            {children}
        </Button>
    )
}

const MarkButton = ({
    children,
    format,
}: {
    children: ReactNode
    format: MarkFormat
}) => {
    const editor = useSlate()
    return (
        <Button
            active={isMarkActive(editor, format)}
            onClick={(e) => {
                e.preventDefault()
                toggleMark(editor, format)
            }}
        >
            {children}
        </Button>
    )
}

const InsertImageButton = () => {
    const editor = useSlateStatic()
    return (
        <button type="button" className="rounded p-1">
            <label htmlFor="insertImage" className="cursor-pointer">
                <Image src={imageIcon} alt="insert image" className="h-5 w-5" />
            </label>
            <input
                type="file"
                id="insertImage"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                    const { files } = e.target
                    if (files && files?.length > 0) {
                        const res = await uploadImageToServer(files[0])
                        if (res?.imageUrl) {
                            insertImage(editor, res.imageUrl)
                        }
                    }
                }}
            />
        </button>
    )
}

const InsertLinkButton = () => {
    const { setInputOpen } = useLinkInputContext()
    return (
        <button
            type="button"
            className="rounded p-1"
            onClick={() => setInputOpen(true)}
        >
            <Image src={linkIcon} alt="insert link" className="h-5 w-5" />
        </button>
    )
}

export { BlockButton, InsertImageButton, InsertLinkButton, MarkButton }
