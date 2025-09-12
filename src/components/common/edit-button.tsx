import { Button } from "@/src/components/ui/button";
import { Pencil } from "lucide-react";
import Link from "next/link";

interface EditButtonProps {
    href: string;
}

export function EditButton({ href }: EditButtonProps) {
    return (
        <Button asChild className="w-full" variant="accent">
            <Link href={href}><Pencil className="mr-2" /> Edit</Link>
        </Button>

    );
}
