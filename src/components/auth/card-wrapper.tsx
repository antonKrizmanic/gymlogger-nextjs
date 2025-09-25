"use client"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader
} from "@/src/components/ui/card";

import { BackButton } from "@/src/components/auth/back-button";
import { Header } from "@/src/components/auth/header";
import { FaDumbbell } from "react-icons/fa";
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
        <Card className="w-full border-0 shadow-2xl backdrop-blur-sm bg-card/95">
            <CardHeader className="space-y-4 pb-8">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <FaDumbbell className="w-8 h-8 text-primary" />
                    </div>
                </div>
                <Header label={headerLabel} />
            </CardHeader>
            <CardContent className="px-8">
                {children}
            </CardContent>
            {showSocial && (
                <CardFooter className="px-8 pt-6">
                    <Social />
                </CardFooter>
            )}
            <CardFooter className="px-8 pb-8">
                <BackButton href={backButtonHref} label={backButtonLabel} />
            </CardFooter>
        </Card>
    )
};