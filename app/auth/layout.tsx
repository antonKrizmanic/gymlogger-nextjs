import { Metadata } from "next";

export const metadata: Metadata = {
    icons: {
        icon: "../icon.svg",
    }
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-700 via-primary-600 to-primary-700 text-primary-foreground flex items-center justify-center px-4 py-12">
            {children}
        </div>
    );
} 