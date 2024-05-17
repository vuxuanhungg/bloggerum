import { RenderElementProps } from 'slate-react'
import ImageElement from './ImageElement'
import LinkElement from './LinkElement'

const Element = (props: RenderElementProps) => {
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

export default Element
