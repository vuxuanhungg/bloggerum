import { RenderElementProps } from 'slate-react'
import { LinkElement as LinkElementType } from '../types'

const LinkElement = ({ attributes, children, element }: RenderElementProps) => {
    return (
        <a
            {...attributes}
            href={(element as LinkElementType).url}
            className="text-green-600 underline"
        >
            {children}
        </a>
    )
}

export default LinkElement
