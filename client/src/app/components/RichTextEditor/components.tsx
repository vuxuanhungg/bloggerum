import { TrashIcon } from '@heroicons/react/24/outline'
import isHotkey from 'is-hotkey'
import isUrl from 'is-url'
import Image from 'next/image'
import {
    LegacyRef,
    MouseEventHandler,
    ReactNode,
    forwardRef,
    useEffect,
    useRef,
    useState,
} from 'react'
import { createPortal } from 'react-dom'
import { toast } from 'react-toastify'
import { Editor, Range, Transforms } from 'slate'
import {
    ReactEditor,
    RenderElementProps,
    RenderLeafProps,
    useFocused,
    useSelected,
    useSlate,
    useSlateStatic,
} from 'slate-react'
import { useLinkInputContext } from './LinkInputContext'
import codeIcon from './assets/Code.svg'
import imageIcon from './assets/Image.svg'
import linkIcon from './assets/LinkSimple.svg'
import bulletedListIcon from './assets/ListBullets.svg'
import numberedListIcon from './assets/ListNumbers.svg'
import paragraphIcon from './assets/Paragraph.svg'
import quotesIcon from './assets/Quotes.svg'
import textAlignCenterIcon from './assets/TextAlignCenter.svg'
import textAlignJustifyIcon from './assets/TextAlignJustify.svg'
import textAlignLeftIcon from './assets/TextAlignLeft.svg'
import textAlignRightIcon from './assets/TextAlignRight.svg'
import letterBoldIcon from './assets/TextBold.svg'
import headingThreeIcon from './assets/TextHThree.svg'
import headingTwoIcon from './assets/TextHTwo.svg'
import letterItalicIcon from './assets/TextItalic.svg'
import letterUnderlineIcon from './assets/TextUnderline.svg'
import { TEXT_ALIGN_TYPES } from './constants'
import {
    insertImage,
    isBlockActive,
    isMarkActive,
    toggleBlock,
    toggleMark,
    uploadImageToServer,
    wrapLink,
} from './helpers'
import { BlockFormat, MarkFormat } from './types'

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

export const BlockButton = ({
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

export const MarkButton = ({
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

        const TEBI_ENDPOINT = 'https://s3.tebi.io'
        const TEBI_BUCKET_NAME = 'bloggerum'
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

export const LinkElement = ({
    attributes,
    children,
    element,
}: RenderElementProps) => {
    return (
        // a href doesn't work for some reason
        <a
            {...attributes}
            href={element.url}
            className="cursor-pointer text-green-600 underline"
        >
            {children}
        </a>
    )
}

export const Element = (props: RenderElementProps) => {
    const { attributes, children, element } = props

    let style = {}
    if (element.type !== 'image') {
        style = { textAlign: element.align }
    }

    switch (element.type) {
        case 'heading-two':
            return (
                <h2
                    className="mb-4 mt-1 text-2xl font-semibold leading-normal"
                    style={style}
                    {...attributes}
                >
                    {children}
                </h2>
            )
        case 'heading-three':
            return (
                <h3
                    className="mb-2 mt-1 text-xl font-medium leading-normal"
                    style={style}
                    {...attributes}
                >
                    {children}
                </h3>
            )
        case 'paragraph':
            return (
                <p
                    className="mt-1 leading-relaxed"
                    style={style}
                    {...attributes}
                >
                    {children}
                </p>
            )
        case 'block-quote':
            return (
                <blockquote
                    className="border-l-4 p-1 pl-6 italic leading-relaxed text-gray-500"
                    style={style}
                    {...attributes}
                >
                    {children}
                </blockquote>
            )
        case 'list-item':
            return (
                <li className="leading-relaxed" style={style} {...attributes}>
                    {children}
                </li>
            )
        case 'numbered-list':
            return (
                <ol
                    className="mt-4 list-inside list-decimal space-y-2 pl-6"
                    style={style}
                    {...attributes}
                >
                    {children}
                </ol>
            )
        case 'bulleted-list':
            return (
                <ul
                    className="mt-4 list-inside list-disc space-y-2 pl-6"
                    style={style}
                    {...attributes}
                >
                    {children}
                </ul>
            )
        case 'image':
            return <ImageElement {...props} />
        case 'link':
            return <LinkElement {...props} />
        default: // paragraph
            return (
                <p
                    className="mt-1 leading-relaxed"
                    style={style}
                    {...attributes}
                >
                    {children}
                </p>
            )
    }
}

export const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        children = <u>{children}</u>
    }

    if (leaf.code) {
        children = <code className="rounded bg-gray-200 p-1">{children}</code>
    }

    return <span {...attributes}>{children}</span>
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

const Portal = ({ children }: { children?: ReactNode }) => {
    return typeof document === 'object'
        ? createPortal(children, document.body)
        : null
}

const LinkInput = forwardRef((_props, ref: LegacyRef<HTMLDivElement>) => {
    const editor = useSlateStatic()
    const [url, setUrl] = useState('')
    const { inputOpen, setInputOpen } = useLinkInputContext()
    return (
        <div
            ref={ref}
            className={`absolute left-0 top-0 z-10 rounded bg-white p-4 shadow ${inputOpen ? 'opacity-1' : 'pointer-events-none opacity-0'} text-sm`}
        >
            <input
                type="text"
                placeholder="Paste a link"
                className="w-full rounded border-2 px-3 py-1.5 shadow-sm focus:outline-green-600"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onFocus={() => setInputOpen(true)}
                onBlur={() => setInputOpen(false)}
                onKeyDown={(e) => {
                    if (isHotkey('Enter', e)) {
                        e.preventDefault()

                        if (!isUrl(url)) {
                            toast.warn('Invalid url')
                            return
                        }

                        wrapLink(editor, url)
                    }
                }}
            />
        </div>
    )
})
LinkInput.displayName = 'LinkInput'

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

export const HoveringToolbar = () => {
    const editor = useSlate()
    const focused = useFocused()
    const ref = useRef<HTMLDivElement | null>(null)
    const { setInputOpen } = useLinkInputContext()

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const { selection } = editor
        if (
            !selection ||
            !focused ||
            Range.isCollapsed(selection) ||
            Editor.string(editor, selection).trim() === ''
        ) {
            setInputOpen(false)
            return
        }

        // maybe can keep select the text while the input is focused
        const domSelection = window.getSelection()!
        const domRange = domSelection.getRangeAt(0)
        const rect = domRange.getBoundingClientRect()
        el.style.top = `${rect.top + window.scrollY - el.offsetHeight}px`
        el.style.left = `${
            rect.left + window.scrollY - el.offsetWidth / 2 + rect.width / 2
        }px`

        const checkHotKey = (e: KeyboardEvent) => {
            if (isHotkey('mod+k', e)) {
                e.preventDefault()
                setInputOpen(true)
            } else if (isHotkey('Esc', e)) {
                e.preventDefault()
                setInputOpen(false)
            }
        }

        document.addEventListener('keydown', checkHotKey)
        return () => {
            document.removeEventListener('keydown', checkHotKey)
        }
    }, [editor, editor.selection, focused, setInputOpen])

    return (
        <Portal>
            <LinkInput ref={ref} />
        </Portal>
    )
}

export const Toolbar = () => (
    <div className="sticky top-0 z-10 bg-white">
        <div className="flex flex-wrap items-center gap-3 border-b py-4">
            <MarkButton format="bold">
                <Image
                    src={letterBoldIcon}
                    alt="letter bold"
                    className="h-5 w-5"
                />
            </MarkButton>
            <MarkButton format="italic">
                <Image
                    src={letterItalicIcon}
                    alt="letter italic"
                    className="h-5 w-5"
                />
            </MarkButton>
            <MarkButton format="underline">
                <Image
                    src={letterUnderlineIcon}
                    alt="letter underline"
                    className="h-5 w-5"
                />
            </MarkButton>
            <MarkButton format="code">
                <Image src={codeIcon} alt="code" className="h-5 w-5" />
            </MarkButton>
            <BlockButton format="heading-two">
                <Image
                    src={headingTwoIcon}
                    alt="heading two"
                    className="h-5 w-5"
                />
            </BlockButton>
            <BlockButton format="heading-three">
                <Image
                    src={headingThreeIcon}
                    alt="heading three"
                    className="h-5 w-5"
                />
            </BlockButton>
            <BlockButton format="paragraph">
                <Image
                    src={paragraphIcon}
                    alt="paragraph"
                    className="h-5 w-5"
                />
            </BlockButton>
            <BlockButton format="block-quote">
                <Image src={quotesIcon} alt="quotes" className="h-5 w-5" />
            </BlockButton>
            <BlockButton format="numbered-list">
                <Image
                    src={numberedListIcon}
                    alt="numbered list"
                    className="h-5 w-5"
                />
            </BlockButton>
            <BlockButton format="bulleted-list">
                <Image
                    src={bulletedListIcon}
                    alt="bulleted list"
                    className="h-5 w-5"
                />
            </BlockButton>
            <BlockButton format="left">
                <Image
                    src={textAlignLeftIcon}
                    alt="text align left"
                    className="h-5 w-5"
                />
            </BlockButton>
            <BlockButton format="center">
                <Image
                    src={textAlignCenterIcon}
                    alt="text align center"
                    className="h-5 w-5"
                />
            </BlockButton>
            <BlockButton format="right">
                <Image
                    src={textAlignRightIcon}
                    alt="text align right"
                    className="h-5 w-5"
                />
            </BlockButton>
            <BlockButton format="justify">
                <Image
                    src={textAlignJustifyIcon}
                    alt="text align justify"
                    className="h-5 w-5"
                />
            </BlockButton>
            <InsertImageButton />
            <InsertLinkButton />
        </div>
    </div>
)
