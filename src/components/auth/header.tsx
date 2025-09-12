interface HeaderProps {
    label: string;
}

export const Header = ({ label }: HeaderProps) => {
    return (
        <div className="w-full flex flex-col gap-y-2 items-center justify-center">
            <h1 className="text-3xl font-display font-semibold text-primary-900 dark:text-white">Gym Logger</h1>
            <p className="text-primary-600 dark:text-primary-100 text-sm">{label}</p>
        </div>
    )
};
