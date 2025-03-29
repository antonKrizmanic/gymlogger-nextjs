import { NewVerificationForm } from "@/src/components/auth/new-verification";
import { Suspense } from "react";

export default async function NewVerificationPage() {
    return(
        <Suspense>
            <NewVerificationForm />
        </Suspense>
    )
}