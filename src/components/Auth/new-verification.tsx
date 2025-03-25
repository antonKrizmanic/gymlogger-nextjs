"use client";

import { Loader2 } from "lucide-react";
import { CardWrapper } from "./card-wrapper";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/src/actions/new-verification";
import { FormSuccess } from "../form-success";
import { FormError } from "../form-error";

export const NewVerificationForm = () => {
    
    const [error, setError] = useState<string | undefined>(undefined);
    const [success, setSuccess] = useState<string | undefined>(undefined);
    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    const onSubmit = useCallback(() =>{       
        if(!token) {
            setError("No token provided.");
            return;
        }

        newVerification(token)
        .then((data) => {
            setSuccess(data.success);
            setError(data.error);
        }).catch(() => {
            setError("An error occurred.");
        })
    }, [token]);

    useEffect(() => {
        onSubmit();
    },[onSubmit])

    return (
        <CardWrapper 
        headerLabel="Verify your email"
        backButtonLabel="Back to login"
        backButtonHref="/auth/login">
            <div className="flex items-center justify-center">
                {!success && !error && <Loader2 className="animate-spin" size={24} />}

                <FormSuccess message={success}/>
                <FormError message={error}/>
            </div>
        </CardWrapper>
    );
}