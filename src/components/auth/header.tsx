interface HeaderProps {
    label: string;
}

export const Header = ({ label }: HeaderProps) => {
    return (
        <div className="w-full flex flex-col gap-y-4 items-center justify-center text-center">
            <h1 className="text-3xl font-bold text-foreground">GymNotebook</h1>
            <p className="text-lg text-muted-foreground">{label}</p>
        </div>
    )
};
