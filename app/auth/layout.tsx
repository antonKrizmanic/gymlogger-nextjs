import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Authentication | GymNotebook",
    description: "Sign in or create your account to start tracking your fitness journey.",
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
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
            <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
}