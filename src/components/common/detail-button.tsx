import { Button } from "@/src/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";

interface DetailButtonProps {
    href: string;
}

export function DetailButton({ href }: DetailButtonProps) {
    return (
        <Button asChild className="w-full" variant="outline">
            <Link href={href}><Eye className="mr-2" /> Details</Link>
        </Button>
    );
}
