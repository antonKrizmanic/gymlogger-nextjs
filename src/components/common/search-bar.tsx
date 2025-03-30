import { Search } from "lucide-react"
import { Input } from "@/src/components/ui/input"

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string

}

export function SearchBar({ value, onChange, placeholder = 'Search...', className }: SearchBarProps) {
    return (
        <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`pl-9 text-black dark:text-white ${className}`}
            />
        </div>
    );
} 