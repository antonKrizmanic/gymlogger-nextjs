import { Navbar } from "@/src/components/navigation/navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard | GymNotebook",
    description: "Track your workouts, monitor progress, and achieve your fitness goals with GymNotebook.",
    icons: {
        icon: "../icon.svg",
    }
};


export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <main className="min-h-[calc(100vh-4rem)]">
                {children}
            </main>
        </>
    )
}