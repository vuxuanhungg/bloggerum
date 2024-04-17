import { Combobox } from '@headlessui/react'
import { Dispatch, SetStateAction, useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const useTagQuery = () => {
    const [tags, setTags] = useState<string[]>([])

    useEffect(() => {
        const fetchTags = async () => {
            const res = await fetch('http://localhost:8080/api/tags')
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
        const result = filteredByQuery.filter(
            (suggestion) => !tags.includes(suggestion)
        )

        return result
    }
    const filteredSuggestions = filterSuggestions()

    return (
        <div className="mt-6">
            <label htmlFor="tags">Tags</label>
            <div className="mt-2 flex flex-wrap items-center gap-2 rounded border border-slate-500 p-1 focus-within:outline focus-within:outline-1">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="flex items-center gap-2 rounded border px-3 py-1"
                    >
                        {tag}
                        <button
                            className="text-red-500"
                            onClick={() =>
                                setTags(tags.filter((_tag) => _tag !== tag))
                            }
                        >
                            x
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
                            placeholder="Post tags"
                            autoComplete="off"
                            className="w-full px-4 py-2 focus:outline-none"
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
                            <Combobox.Options className="absolute -left-1 top-full mt-2 overflow-hidden rounded bg-white shadow">
                                {filteredSuggestions.map((tag) => (
                                    <Combobox.Option
                                        key={tag}
                                        value={tag}
                                        className={({ active }) =>
                                            `px-4 py-2 ${active ? 'bg-slate-500 text-white' : ''}`
                                        }
                                    >
                                        {tag}
                                    </Combobox.Option>
                                ))}
                            </Combobox.Options>
                        )}
                    </Combobox>
                </div>
            </div>
        </div>
    )
}

export default TagInput
