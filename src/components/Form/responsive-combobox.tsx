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
import { Drawer, DrawerContent, DrawerTrigger } from "@/src/components/ui/drawer"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"

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
  onValueChange,
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
          <Button variant="outline" className="w-full justify-start">
            {selectedItem ? selectedItem.label : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
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
        <Button variant="outline" className="w-full justify-start">
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
  const [search, setSearch] = React.useState("")

  return (
    <Command
      filter={(value, search) => {
        // Custom filter function that matches on label, not value
        if (!search) return 1
        const item = items.find((item) => item.value === value)
        if (!item) return 0

        return item.label.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
      }}
	  className="[&_[cmdk-item]]:text-gray-800 dark:[&_[cmdk-item]]:text-gray-200"
	  >
		<CommandInput
		  placeholder={filterPlaceholder}
		  value={search}
		  onValueChange={setSearch}
		  className="text-gray-800 dark:text-gray-200 placeholder:text-gray-500"
		/>
		<CommandList>
		  <CommandEmpty className="text-gray-800 dark:text-gray-200">{emptyMessage}</CommandEmpty>
		  <CommandGroup>
			{items.map((item) => (
			  <CommandItem
				key={item.value}
				value={item.value}
				onSelect={(value) => {
				  onSelectItem(items.find((i) => i.value === value) || null)
				  setSearch("") // Reset search after selection
				}}
				className="text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white data-[selected=true]:text-gray-900 dark:data-[selected=true]:text-white"
			  >
				{item.label}
			  </CommandItem>
			))}
		  </CommandGroup>
		</CommandList>
    </Command>
  )
}

