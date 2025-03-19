import { SearchIcon } from '../Icons';
import { TextInput } from '../Form/TextInput';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search...' }: SearchBarProps) {
    return (
        <div className="relative">
            <TextInput
                id={'search-bar'}
                placeholder={placeholder}
                value={value}
                onChange={onChange}                 
            />  
            <SearchIcon />
        </div>
    );
} 