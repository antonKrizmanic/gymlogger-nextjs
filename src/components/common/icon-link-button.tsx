import Link from "next/link";
import { ReactNode } from "react";

import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

type ButtonBaseProps = Omit<React.ComponentProps<typeof Button>, "asChild" | "children">;

interface IconLinkButtonProps extends ButtonBaseProps {
    href: string;
    icon: ReactNode;
    "aria-label"?: string;
    className?: string;
}

export function IconLinkButton({
    href,
    icon,
    className,
    "aria-label": ariaLabel,
    ...buttonProps
}: IconLinkButtonProps) {
    return (
        <Button
            asChild
            {...buttonProps}
            className={cn("w-full", className)}
        >
            <Link href={href} aria-label={ariaLabel}>
                {icon}
            </Link>
        </Button>
    );
}
