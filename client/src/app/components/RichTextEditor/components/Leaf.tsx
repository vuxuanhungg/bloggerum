import { RenderLeafProps } from 'slate-react'

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
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

export default Leaf
