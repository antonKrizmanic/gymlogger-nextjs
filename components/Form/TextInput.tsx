import { BaseInput } from "./BaseInput";

interface TextInputProps {
    label: string;
    id: string;
    value: string | undefined;
    onChange: (value: string) => void;
}

export function TextInput({ label, id, value, onChange }: TextInputProps) {
    return (
        <BaseInput type="text" label={label} id={id} value={value} onChange={onChange} />
    );
}

interface DateInputProps {
    label: string;
    id: string;
    value: string | undefined;
    onChange: (value: string) => void;
}

export function DateInput({ label, id, value, onChange }: DateInputProps) {
    return (
        <BaseInput type="date" label={label} id={id} value={value} onChange={onChange} />
    );
}

export interface NumberInputProps {
    label: string;
    id: string;
    value: number | undefined;
    onChange: (value: number) => void;
}

export function NumberInput({ label, id, value, onChange }: NumberInputProps) {
    return (
        <BaseInput type="number" label={label} id={id} value={value} onChange={(value) => onChange(Number(value))} />
    );
}





