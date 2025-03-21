import { Button } from "@/src/components/ui/button"
import { Eye } from "lucide-react";
import Link from "next/link";

interface DetailButtonProps {
    href: string;
}

export function DetailButton({ href }: DetailButtonProps) {
    return (
        <Button asChild className="rounded-1 w-full">
            <Link href={href}><Eye /></Link>
        </Button>
    );
}
