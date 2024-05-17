import { RenderElementProps } from 'slate-react'

const LinkElement = ({ attributes, children, element }: RenderElementProps) => {
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

export default LinkElement
