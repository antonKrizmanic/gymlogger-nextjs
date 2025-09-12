"use client"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader
} from "@/src/components/ui/card";

import { BackButton } from "@/src/components/auth/back-button";
import { Header } from "@/src/components/auth/header";
import { Social } from "./social";

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocial?: boolean;
}

export const CardWrapper = ({
    children,
    headerLabel,
    backButtonLabel,
    backButtonHref,
    showSocial
}: CardWrapperProps) => {
    return (
        <Card className="w-96 bg-white/95 backdrop-blur dark:bg-primary-900/80">
            <CardHeader>
                <Header label={headerLabel} />
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {showSocial && (
                <CardFooter>
                    <Social />
                </CardFooter>
            )}
            <CardFooter>
                <BackButton href={backButtonHref} label={backButtonLabel} />
            </CardFooter>
        </Card>
    )
};