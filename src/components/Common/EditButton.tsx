import { PencilIcon } from "@/src/components/Icons";
import { Button } from "@/src/components/ui/button"
import Link from "next/link";

interface EditButtonProps {
    href: string;
}

export function EditButton({ href }: EditButtonProps) {
    return (
        <Button asChild className="rounded-1 w-full">
            <Link href={href}><PencilIcon /></Link>
        </Button>

    );
}
