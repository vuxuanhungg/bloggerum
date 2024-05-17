import { Editor } from 'slate'
import { insertImage, uploadImageToServer } from './helpers'

export const withImages = (editor: Editor) => {
    const { insertData, isVoid } = editor

    editor.isVoid = (element) => element.type === 'image' || isVoid(element)

    editor.insertData = (data) => {
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
        } else {
            insertData(data)
        }
    }

    return editor
}

export const withInlines = (editor: Editor) => {
    const { isInline } = editor

    editor.isInline = (element) => element.type === 'link' || isInline(element)

    return editor
}
