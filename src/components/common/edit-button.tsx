import { Button } from "@/src/components/ui/button"
import { Pencil } from "lucide-react";
import Link from "next/link";

interface EditButtonProps {
    href: string;
}

export function EditButton({ href }: EditButtonProps) {
    return (
        <Button asChild className="rounded-1 w-full">
            <Link href={href}><Pencil /></Link>
        </Button>

    );
}
