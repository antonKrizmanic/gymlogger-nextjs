export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
            <main className="flex items-center justify-center min-h-screen">
                {children}
            </main>
        </div>
    );
} 