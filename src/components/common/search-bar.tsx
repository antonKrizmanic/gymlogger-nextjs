import { IconInput } from "@/src/components/ui/icon-input";
import { Search } from "lucide-react";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string

}

export function SearchBar({ value, onChange, placeholder = 'Search...', className }: SearchBarProps) {
    return (
        <IconInput
            icon={Search}
            type="search"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`text-black dark:text-white ${className}`}
        />
    );
} 