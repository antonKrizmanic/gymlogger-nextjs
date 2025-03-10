import { BaseInput } from "./BaseInput";

interface TextInputProps {
    label?: string;
    placeholder?: string;
    id: string;
    value: string | undefined;
    onChange: (value: string) => void;
}

export function TextInput({ label, placeholder, id, value, onChange }: TextInputProps) {
    return (
        <BaseInput type="text" label={label} placeholder={placeholder} id={id} value={value} onChange={onChange} />
    );
}

interface DateInputProps {
    label?: string;
    placeholder?: string;
    id: string;
    value: string | undefined;
    onChange: (value: string) => void;
}

export function DateInput({ label, placeholder, id, value, onChange }: DateInputProps) {
    return (
        <BaseInput type="date" label={label} placeholder={placeholder} id={id} value={value} onChange={onChange} />
    );
}

export interface NumberInputProps {
    label?: string;
    placeholder?: string;
    id: string;
    value: number | undefined;
    onChange: (value: number) => void;
}

export function NumberInput({ label, placeholder, id, value, onChange }: NumberInputProps) {
    return (
        <BaseInput type="number" label={label} placeholder={placeholder} id={id} value={value} onChange={(value) => onChange(Number(value))} />
    );
}





