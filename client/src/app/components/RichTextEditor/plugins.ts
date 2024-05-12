import { Editor } from 'slate'
import { insertImage, isImageUrl, uploadImageToServer } from './helpers'

export const withImages = (editor: Editor) => {
    const { insertData, isVoid } = editor

    editor.isVoid = (element) => element.type === 'image' || isVoid(element)
    editor.insertData = (data) => {
        const text = data.getData('text/plain')
        const { files } = data

        if (files?.length > 0) {
            Array.from(files).forEach(async (file) => {
                const [mime] = file.type.split('/')
                if (mime === 'image') {
                    const res = await uploadImageToServer(file)
                    if (res?.imageUrl) {
                        insertImage(editor, res.imageUrl)
                    }
                }
            })
        } else if (isImageUrl(text)) {
            insertImage(editor, text)
        } else {
            insertData(data)
        }
    }

    return editor
}
