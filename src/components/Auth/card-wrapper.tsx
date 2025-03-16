"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardFooter
} from "@/src/components/ui/card";

import { Header } from "@/src/components/Auth/header";
import { BackButton } from "@/src/components/Auth/back-button";

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
        <Card className="w-96">
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