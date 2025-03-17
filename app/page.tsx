import { Button } from "@/src/components/ui/button";
import Link from "next/link";

export default async function IndexPaxe() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] space-y-4 bg-white dark:bg-slate-950">
            <h1 className="text-3xl text-bold text-gray-600 dark:text-gray-300">Welcome to GymLogger</h1>
            <Button asChild size="lg">
                <Link href="/auth/login">
                    Login
                </Link>
            </Button>
        </div>
    )
}