'use client'
import isHotkey from 'is-hotkey'
import { KeyboardEvent, useCallback, useMemo } from 'react'
import { Descendant, createEditor } from 'slate'
import { withHistory } from 'slate-history'
import {
    Editable,
    RenderElementProps,
    RenderLeafProps,
    Slate,
    withReact,
} from 'slate-react'
import { Element, Leaf, Toolbar } from './components'
import { toggleMark, withImages } from './helpers'
import { MarkFormat } from './types'

const HOTKEYS: Record<string, MarkFormat> = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
}

const RichTextEditor = ({
    readOnly,
    value,
    onChange,
}: {
    readOnly?: true
    value?: string
    onChange?: (value: string) => void
}) => {
    const renderElement = useCallback(
        (props: RenderElementProps) => <Element {...props} />,
        []
    )
    const renderLeaf = useCallback(
        (props: RenderLeafProps) => <Leaf {...props} />,
        []
    )
    const editor = useMemo(
        () => withImages(withHistory(withReact(createEditor()))),
        []
    )

    const initialValue: Descendant[] = value
        ? JSON.parse(value)
        : [
              {
                  type: 'paragraph',
                  children: [{ text: '' }],
              },
          ]

    const handleHotKeys = (e: KeyboardEvent<HTMLDivElement>) => {
        for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, e)) {
                e.preventDefault()
                const mark = HOTKEYS[hotkey]
                toggleMark(editor, mark)
            }
        }
    }

    return (
        <Slate
            editor={editor}
            initialValue={initialValue}
            onChange={(value) => {
                const isAstChange = editor.operations.some(
                    (op) => 'set_selection' !== op.type
                )
                if (isAstChange) {
                    const content = JSON.stringify(value)
                    onChange && onChange(content)
                }
            }}
        >
            {!readOnly && <Toolbar />}
            <div className="mt-6">
                <Editable
                    readOnly={readOnly}
                    placeholder="Post body"
                    className="focus:outline-none"
                    style={{ minHeight: '16rem' }}
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    onKeyDown={handleHotKeys}
                />
            </div>
        </Slate>
    )
}

export default RichTextEditor
