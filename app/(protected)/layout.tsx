import { Navbar } from "@/src/components/Navigation/Navbar";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <main className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-slate-900">
                {children}
            </main>
        </>
    )
}