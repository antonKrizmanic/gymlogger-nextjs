"use client"

import * as React from "react"
import { useMediaQuery } from "@/src/hooks/use-media-query"
import { Button } from "@/src/components/ui/button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/src/components/ui/command"
import {
	Drawer,
	DrawerContent,
	DrawerTrigger,
} from "@/src/components/ui/drawer"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/src/components/ui/popover"

export type ComboboxItem = {
	value: string
	label: string
	[key: string]: any
}

interface ResponsiveComboboxProps {
	items: ComboboxItem[]
	placeholder: string
	emptyMessage: string
	filterPlaceholder: string
	value?: ComboboxItem | null
	defaultValue?: ComboboxItem | null	
	onValueChange?: (item: ComboboxItem | null) => void
}

export const ResponsiveCombobox = ({
	items,
	placeholder,
	emptyMessage,
	filterPlaceholder,
	value,
	defaultValue,
	onValueChange
}: ResponsiveComboboxProps) => {
	const [open, setOpen] = React.useState(false)
	const isDesktop = useMediaQuery("(min-width: 768px)")
	
	// For internal state when used in uncontrolled mode
	const [internalValue, setInternalValue] = React.useState<ComboboxItem | null>(defaultValue || null)
	
	// Determine if we're in controlled or uncontrolled mode
	const isControlled = value !== undefined
	const selectedItem = isControlled ? value : internalValue
	
	const handleSelectItem = (item: ComboboxItem | null) => {
		if (!isControlled) {
			setInternalValue(item)
		}
		
		if (onValueChange) {
			onValueChange(item)
		}
		
		setOpen(false)
	}

	if (isDesktop) {
		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant="outline" className={`w-full justify-start`}>
						{selectedItem ? selectedItem.label : placeholder}
					</Button>
				</PopoverTrigger>
				<PopoverContent className={`w-full p-0`} align="start">
					<ItemList 
						items={items} 
						onSelectItem={handleSelectItem}
						emptyMessage={emptyMessage}
						filterPlaceholder={filterPlaceholder}
						selectedValue={selectedItem?.value}
					/>
				</PopoverContent>
			</Popover>
		)
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant="outline" className={`w-full justify-start`}>
					{selectedItem ? selectedItem.label : placeholder}
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mt-4 border-t">
					<ItemList 
						items={items} 
						onSelectItem={handleSelectItem}
						emptyMessage={emptyMessage}
						filterPlaceholder={filterPlaceholder}
						selectedValue={selectedItem?.value}
					/>
				</div>
			</DrawerContent>
		</Drawer>
	)
}

function ItemList({
	items,
	onSelectItem,
	emptyMessage,
	filterPlaceholder,
	selectedValue,
}: {
	items: ComboboxItem[]
	onSelectItem: (item: ComboboxItem | null) => void
	emptyMessage: string
	filterPlaceholder: string
	selectedValue?: string
}) {
	return (
		<Command value={selectedValue}>
			<CommandInput placeholder={filterPlaceholder} />
			<CommandList>
				<CommandEmpty>{emptyMessage}</CommandEmpty>
				<CommandGroup>
					{items.map((item) => (
						<CommandItem
							key={item.value}
							value={item.value}
							onSelect={(value) => {
								onSelectItem(
									items.find((i) => i.value === value) || null
								)
							}}
						>
							{item.label}
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</Command>
	)
}
