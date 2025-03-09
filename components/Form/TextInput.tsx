import { BaseInput } from "./BaseInput";

interface TextInputProps {
    label?: string;
    placeholder?: string;
    id: string;
    value: string | undefined;
    onChange: (value: string) => void;
    className?: string;
}

export function TextInput({ label, placeholder, id, value, onChange, className }: TextInputProps) {
    return (
        <BaseInput type="text" label={label} placeholder={placeholder} id={id} value={value} onChange={onChange} className={className} />
    );
}

interface DateInputProps {
    label?: string;
    placeholder?: string;
    id: string;
    value: string | undefined;
    onChange: (value: string) => void;
    className?: string;
}

export function DateInput({ label, placeholder, id, value, onChange, className }: DateInputProps) {
    return (
        <BaseInput type="date" label={label} placeholder={placeholder} id={id} value={value} onChange={onChange} className={className} />
    );
}

export interface NumberInputProps {
    label?: string;
    placeholder?: string;
    id: string;
    value: number | undefined;
    onChange: (value: number) => void;
    className?: string;
}

export function NumberInput({ label, placeholder, id, value, onChange, className }: NumberInputProps) {
    return (
        <BaseInput type="number" label={label} placeholder={placeholder} id={id} value={value} onChange={(value) => onChange(Number(value))} className={className} />
    );
}





