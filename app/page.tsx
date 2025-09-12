"use client";

import { Button } from "@/src/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function IndexPage() {
    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState<string | null>(null);

    const handleNavigation = (path: string) => {
        setIsNavigating(path);
        router.push(path);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] space-y-4 bg-white dark:bg-slate-950">
            <h1 className="text-3xl text-bold text-gray-600 dark:text-gray-300">Welcome to GymNotebook</h1>
            <div className="flex flex-row items-center justify-center gap-4">
                <Button
                    size="lg"
                    variant="outline"
                    disabled={isNavigating !== null}
                    onClick={() => handleNavigation("/auth/register")}
                >
                    {isNavigating === "/auth/register" ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                        </>
                    ) : (
                        "Create an account"
                    )}
                </Button>
                <Button
                    size="lg"
                    disabled={isNavigating !== null}
                    onClick={() => handleNavigation("/auth/login")}
                >
                    {isNavigating === "/auth/login" ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                        </>
                    ) : (
                        "Login"
                    )}
                </Button>
            </div>
        </div>
    )
}