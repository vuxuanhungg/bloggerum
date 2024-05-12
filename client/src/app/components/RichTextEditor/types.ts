import { BaseEditor } from 'slate'
import { HistoryEditor } from 'slate-history'
import { ReactEditor } from 'slate-react'

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor & HistoryEditor
        Element: CustomElement
        Text: CustomText
    }
}

type CustomElement =
    | {
          type: BlockFormat
          children: CustomText[]
          align?: TextAlign
      }
    | ImageElement

type CustomText = {
    text: string
    bold?: true
    italic?: true
    underline?: true
    code?: true
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

type EmptyText = {
    text: string
}

export type ImageElement = {
    type: 'image'
    url: string
    children: EmptyText[]
}
