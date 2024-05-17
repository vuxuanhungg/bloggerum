import isHotkey from 'is-hotkey'
import isUrl from 'is-url'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useSlate } from 'slate-react'
import Modal from '../../Modal'
import { useLinkInputContext } from '../context/LinkInputContext'
import { wrapLink } from '../helpers'

const LinkInput = () => {
    const { inputOpen, setInputOpen } = useLinkInputContext()
    const editor = useSlate()
    const [url, setUrl] = useState('')

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

    return (
        <Modal isOpen={inputOpen} onClose={() => setInputOpen(false)}>
            <div className="text-sm">
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
                            setUrl('')
                            setInputOpen(false)
                        }
                    }}
                />
            </div>
        </Modal>
    )
}

export default LinkInput
