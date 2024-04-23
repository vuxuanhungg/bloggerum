import { Combobox } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { Dispatch, SetStateAction, useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const useTagQuery = () => {
    const [tags, setTags] = useState<string[]>([])

    useEffect(() => {
        const fetchTags = async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/tags`
            )
            const tags = await res.json()
            setTags(tags)
        }

        fetchTags()
    }, [])

    return { tags }
}

const TagInput = ({
    tags,
    setTags,
}: {
    tags: string[]
    setTags: Dispatch<SetStateAction<string[]>>
}) => {
    const { tags: suggestions } = useTagQuery()
    const [query, setQuery] = useState('')

    const filterSuggestions = () => {
        const filteredByQuery =
            query === ''
                ? suggestions
                : suggestions.filter((suggestion) =>
                      suggestion.toLowerCase().includes(query.toLowerCase())
                  )

        // Filter out existing tags
        const result = filteredByQuery
            .filter((suggestion) => !tags.includes(suggestion))
            .slice(0, 5)

        return result
    }
    const filteredSuggestions = filterSuggestions()

    return (
        <div className="mt-6">
            {/* <label htmlFor="tags">Tags</label> */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="flex items-center gap-2 rounded-lg border py-1 pl-3 pr-2"
                    >
                        {tag}
                        <button
                            className="text-red-500"
                            onClick={() =>
                                setTags(tags.filter((_tag) => _tag !== tag))
                            }
                        >
                            <XMarkIcon className="h-4 w-4" />
                        </button>
                    </span>
                ))}

                <div className="relative w-32 flex-auto">
                    <Combobox
                        value=""
                        onChange={(value) => {
                            if (value.length > 0) {
                                setTags([...tags, value])
                                setQuery('')
                            }
                        }}
                    >
                        <Combobox.Input
                            id="tags"
                            placeholder={tags.length === 0 ? 'Post tags' : ''}
                            autoComplete="off"
                            className="w-full py-2 focus:outline-none"
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    // Prevent weird quirks when pressing Enter on empty input query
                                    if (query.length === 0) {
                                        e.preventDefault()
                                        return
                                    }

                                    // Have suggestions, let it do its default job
                                    if (filteredSuggestions.length > 0) return

                                    // No suggestions, duplicate tag
                                    if (
                                        tags.some(
                                            (tag) =>
                                                tag.toLowerCase() ===
                                                query.toLowerCase()
                                        )
                                    ) {
                                        toast.info('Tag already added')
                                        setQuery('')
                                        return
                                    }

                                    // No suggestions, tag not exist yet
                                    setTags([...tags, query])
                                    setQuery('')
                                }
                            }}
                        />

                        {filteredSuggestions.length > 0 && (
                            <div className="absolute -left-1 top-full mt-2 w-80 overflow-hidden rounded bg-white shadow">
                                <Combobox.Options className="rounded border-2 border-gray-300">
                                    {filteredSuggestions.map((tag) => (
                                        <Combobox.Option
                                            key={tag}
                                            value={tag}
                                            className={({ active }) =>
                                                `px-6 py-3 text-sm ${active ? 'bg-gray-200' : ''}`
                                            }
                                        >
                                            {tag}
                                        </Combobox.Option>
                                    ))}
                                </Combobox.Options>
                            </div>
                        )}
                    </Combobox>
                </div>
            </div>
        </div>
    )
}

export default TagInput
