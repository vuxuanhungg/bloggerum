import Image from 'next/image'
import codeIcon from '../assets/Code.svg'
import bulletedListIcon from '../assets/ListBullets.svg'
import numberedListIcon from '../assets/ListNumbers.svg'
import paragraphIcon from '../assets/Paragraph.svg'
import quotesIcon from '../assets/Quotes.svg'
import textAlignCenterIcon from '../assets/TextAlignCenter.svg'
import textAlignJustifyIcon from '../assets/TextAlignJustify.svg'
import textAlignLeftIcon from '../assets/TextAlignLeft.svg'
import textAlignRightIcon from '../assets/TextAlignRight.svg'
import letterBoldIcon from '../assets/TextBold.svg'
import headingThreeIcon from '../assets/TextHThree.svg'
import headingTwoIcon from '../assets/TextHTwo.svg'
import letterItalicIcon from '../assets/TextItalic.svg'
import letterUnderlineIcon from '../assets/TextUnderline.svg'
import {
    BlockButton,
    InsertImageButton,
    InsertLinkButton,
    MarkButton,
} from './Button'

const Toolbar = () => (
    <div className="sticky top-0 z-10 bg-white">
        <div className="flex flex-wrap items-center gap-3 border-b py-4">
            <MarkButton format="bold">
                <Image
                    src={letterBoldIcon}
                    alt="letter bold"
                    className="h-5 w-5"
                />
            </MarkButton>
            <MarkButton format="italic">
                <Image
                    src={letterItalicIcon}
                    alt="letter italic"
                    className="h-5 w-5"
                />
            </MarkButton>
            <MarkButton format="underline">
                <Image
                    src={letterUnderlineIcon}
                    alt="letter underline"
                    className="h-5 w-5"
                />
            </MarkButton>
            <MarkButton format="code">
                <Image src={codeIcon} alt="code" className="h-5 w-5" />
            </MarkButton>
            <BlockButton format="heading-two">
                <Image
                    src={headingTwoIcon}
                    alt="heading two"
                    className="h-5 w-5"
                />
            </BlockButton>
            <BlockButton format="heading-three">
                <Image
                    src={headingThreeIcon}
                    alt="heading three"
                    className="h-5 w-5"
                />
            </BlockButton>
            <BlockButton format="paragraph">
                <Image
                    src={paragraphIcon}
                    alt="paragraph"
                    className="h-5 w-5"
                />
            </BlockButton>
            <BlockButton format="block-quote">
                <Image src={quotesIcon} alt="quotes" className="h-5 w-5" />
            </BlockButton>
            <BlockButton format="numbered-list">
                <Image
                    src={numberedListIcon}
                    alt="numbered list"
                    className="h-5 w-5"
                />
            </BlockButton>
            <BlockButton format="bulleted-list">
                <Image
                    src={bulletedListIcon}
                    alt="bulleted list"
                    className="h-5 w-5"
                />
            </BlockButton>
            <BlockButton format="left">
                <Image
                    src={textAlignLeftIcon}
                    alt="text align left"
                    className="h-5 w-5"
                />
            </BlockButton>
            <BlockButton format="center">
                <Image
                    src={textAlignCenterIcon}
                    alt="text align center"
                    className="h-5 w-5"
                />
            </BlockButton>
            <BlockButton format="right">
                <Image
                    src={textAlignRightIcon}
                    alt="text align right"
                    className="h-5 w-5"
                />
            </BlockButton>
            <BlockButton format="justify">
                <Image
                    src={textAlignJustifyIcon}
                    alt="text align justify"
                    className="h-5 w-5"
                />
            </BlockButton>
            <InsertImageButton />
            <InsertLinkButton />
        </div>
    </div>
)

export default Toolbar
