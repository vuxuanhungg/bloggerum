import isHotkey from 'is-hotkey'
import isUrl from 'is-url'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Editor } from 'slate'
import { useSlate } from 'slate-react'
import Modal from '../../Modal'
import { useLinkInputContext } from '../context/LinkInputContext'
import { getActiveLink, isLinkActive, unwrapLink, wrapLink } from '../helpers'

const useUrl = (editor: Editor) => {
    const [url, setUrl] = useState('')
    const activeUrl = getActiveLink(editor)

    useEffect(() => {
        setUrl(activeUrl || '')
    }, [activeUrl])

    return { url, setUrl }
}

const useHandleKeyDown = () => {
    const { setInputOpen } = useLinkInputContext()

    useEffect(() => {
        const checkHotKey = (e: KeyboardEvent) => {
            if (isHotkey('mod+k', e)) {
                e.preventDefault()
                setInputOpen(true)
            }
        }

        document.addEventListener('keydown', checkHotKey)
        return () => {
            document.removeEventListener('keydown', checkHotKey)
        }
    }, [setInputOpen])
}

const LinkInput = () => {
    const { inputOpen, setInputOpen } = useLinkInputContext()
    const editor = useSlate()
    const { url, setUrl } = useUrl(editor)
    useHandleKeyDown()

    return (
        <Modal isOpen={inputOpen} onClose={() => setInputOpen(false)}>
            <div className="text-sm">
                <input
                    type="text"
                    placeholder="Paste a link"
                    className="w-full rounded border-2 px-3 py-1.5 shadow-sm focus:outline-green-600"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => {
                        if (isHotkey('Enter', e)) {
                            e.preventDefault()

                            if (!isUrl(url)) {
                                toast.warn('Invalid url')
                                return
                            }

                            wrapLink(editor, url)
                            setUrl('')
                            setInputOpen(false)
                        }
                    }}
                />
                {isLinkActive(editor) && (
                    <div className="mt-2 flex justify-center">
                        <button
                            type="button"
                            className="rounded border border-red-600 px-2 py-1 text-red-600 transition-colors hover:bg-red-600 hover:text-white focus:bg-red-600 focus:text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                            onClick={() => {
                                unwrapLink(editor)
                                setUrl('')
                                setInputOpen(false)
                            }}
                        >
                            Remove link
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    )
}

export default LinkInput
