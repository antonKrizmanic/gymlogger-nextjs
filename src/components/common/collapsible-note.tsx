'use client'

import { Button } from '@/src/components/ui/button'
import { IconTextarea } from '@/src/components/ui/icon-input'
import { ChevronDown, ChevronUp, MessageSquare, type LucideIcon } from 'lucide-react'
import React from 'react'

interface CollapsibleNoteProps {
    label: string
    value: string
    onChange: (value: string) => void
    icon: LucideIcon
    placeholder?: string
}

export function CollapsibleNote({ label, value, onChange, icon: Icon, placeholder }: CollapsibleNoteProps) {
    const [isExpanded, setIsExpanded] = React.useState(false)
    const [isEditing, setIsEditing] = React.useState(false)
    const [draft, setDraft] = React.useState<string>(value || '')

    React.useEffect(() => {
        setDraft(value || '')
    }, [value])

    const handleToggle = React.useCallback(() => {
        setIsExpanded((prev) => !prev)
    }, [])

    const handleEdit = React.useCallback(() => {
        setIsEditing(true)
        setIsExpanded(true)
    }, [])

    const handleSave = React.useCallback(() => {
        onChange(draft)
        setIsEditing(false)
        setIsExpanded(false)
    }, [draft, onChange])

    const handleCancel = React.useCallback(() => {
        setDraft(value || '')
        setIsEditing(false)
        setIsExpanded(false)
    }, [value])

    return (
        <div className="space-y-2">
            {!isExpanded && (
                <div
                    className="border border-dashed border-muted-foreground/30 rounded-lg p-3 bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer"
                    style={{ pointerEvents: 'auto' }}
                    onClick={handleToggle}
                >
                    {draft?.trim() ? (
                        <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium text-muted-foreground">{label}</span>
                                </div>
                                <p className="text-sm text-foreground line-clamp-2 break-words">
                                    {draft}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2 opacity-60 hover:opacity-100 transition-opacity">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleEdit()
                                    }}
                                    className="h-6 px-2 text-xs"
                                >
                                    Edit
                                </Button>
                                {isExpanded ? (
                                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center space-x-2 py-2">
                            <MessageSquare className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{placeholder || 'Add note'}</span>
                            <ChevronDown className="h-3 w-3 text-muted-foreground" />
                        </div>
                    )}
                </div>
            )}

            {isExpanded && (
                <div className="border border-muted-foreground/20 rounded-lg p-4 bg-muted/10">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground">{label}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleCancel}
                                className="h-8 px-3 text-sm font-medium"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="default"
                                size="sm"
                                onClick={handleSave}
                                className="h-8 px-3 text-sm font-medium bg-primary hover:bg-primary/90"
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                    <IconTextarea
                        icon={Icon}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder={placeholder || 'Add details...'}
                    />
                </div>
            )}
        </div>
    )
}


