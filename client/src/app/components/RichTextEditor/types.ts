import { BaseEditor } from 'slate'
import { HistoryEditor } from 'slate-history'
import { ReactEditor } from 'slate-react'

type CustomElement = {
    type: BlockFormat
    children: CustomText[]
    align?: TextAlign
}

type CustomText = {
    text: string
    bold?: true
    italic?: true
    underline?: true
    code?: true
}

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor & HistoryEditor
        Element: CustomElement
        Text: CustomText
    }
}

export type TextAlign = 'left' | 'center' | 'right' | 'justify'
export type MarkFormat = 'bold' | 'italic' | 'underline' | 'code'
export type BlockFormat =
    | 'heading-two'
    | 'heading-three'
    | 'paragraph'
    | 'block-quote'
    | 'list-item'
    | 'numbered-list'
    | 'bulleted-list'
    | TextAlign
