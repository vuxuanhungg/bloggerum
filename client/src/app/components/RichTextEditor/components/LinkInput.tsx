import isHotkey from 'is-hotkey'
import isUrl from 'is-url'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { toast } from 'react-toastify'
import { Editor, Range } from 'slate'
import { useFocused, useSlate } from 'slate-react'
import { useLinkInputContext } from '../context/LinkInputContext'
import { wrapLink } from '../helpers'

const Portal = ({ children }: { children?: ReactNode }) => {
    return typeof document === 'object'
        ? createPortal(children, document.body)
        : null
}

const LinkInput = () => {
    const { inputOpen, setInputOpen } = useLinkInputContext()
    const editor = useSlate()
    const focused = useFocused()
    const ref = useRef<HTMLDivElement | null>(null)
    const [url, setUrl] = useState('')

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
        </Portal>
    )
}

export default LinkInput
