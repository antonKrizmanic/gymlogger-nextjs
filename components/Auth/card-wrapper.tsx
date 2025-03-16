"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardFooter
} from "@/components/ui/card";

import { Header } from "@/components/Auth/header";
import { BackButton } from "@/components/Auth/back-button";

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;    
}

export const CardWrapper = ({
    children,
    headerLabel,
    backButtonLabel,
    backButtonHref    
}: CardWrapperProps) => {
    return (
        <Card>
            <CardHeader>
                <Header label={headerLabel}/>
                </CardHeader>
            <CardContent>
                {children}
            </CardContent>  
            <CardFooter>
                <BackButton href={backButtonHref} label={backButtonLabel}/>
            </CardFooter>          
        </Card>
    )
};